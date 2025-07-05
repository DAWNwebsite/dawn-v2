package auth

import (
	"aida/config"
	"aida/models"
	"aida/utils"

	//	"fmt"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v4"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

func SetupAuthRoutes(r *gin.Engine, db *gorm.DB) {
	authGroup := r.Group("/auth")
	{
		authGroup.POST("/signup", SignUp(db))
		authGroup.POST("/login", Login(db))
	}
}

var secretKey = os.Getenv("SECRET_KEY")

type Claims struct {
	Fullname string    `json:"fullname"`
	ID       uuid.UUID `json:"id"`
	Role     string    `json:"role"`
	jwt.StandardClaims
}

type SignUpInfo struct {
	FullName string `json:"fullname"`
	Email    string `json:"email"`
	Password string `json:"password"`
	Country  string `json:"country"`
	Role     string `json:"role"`
}

type UserResponse struct {
	ID       uuid.UUID `json:"id"`
	FullName string    `json:"fullname"`
	Email    string    `json:"email"`
	Role     string    `json:"role"`
}

type LoginInput struct {
	Email    string
	Password string
}

// GenerateToken creates a JWT token with the given claims and expiry hours
func GenerateToken(claims map[string]any, secretKey []byte, expiryHours int) (string, error) {
	// Convert map to structured claims
	tokenClaims := Claims{
		Fullname: claims["fullname"].(string),
		ID:       claims["id"].(uuid.UUID),
		Role:     claims["role"].(string),
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: time.Now().Add(time.Hour * time.Duration(expiryHours)).Unix(),
			IssuedAt:  time.Now().Unix(),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, tokenClaims)
	return token.SignedString(secretKey)
}

// VerifyToken verifies a JWT token and returns the claims
func VerifyToken(tokenString string, secretKey []byte) (map[string]any, error) {
	token, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (interface{}, error) {
		return secretKey, nil
	})

	if err != nil {
		return nil, err
	}

	if claims, ok := token.Claims.(*Claims); ok && token.Valid {
		return map[string]any{
			"fullname": claims.Fullname,
			"id":       claims.ID,
			"role":     claims.Role,
		}, nil
	}

	return nil, jwt.ErrSignatureInvalid
}

func SignUp(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		SignupInput := SignUpInfo{}
		erro := c.BindJSON(&SignupInput)
		if erro != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": erro.Error()})
			return
		}
		hashed, err := utils.HashPassword(SignupInput.Password)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		newAccount := models.User{
			ID:       uuid.New(),
			FullName: SignupInput.FullName,
			Email:    SignupInput.Email,
			Password: hashed,
			Country:  &SignupInput.Country,
			Role:     SignupInput.Role,
		}

		err = db.Create(&newAccount).Error
		if err != nil {
			if strings.Contains(err.Error(), "duplicate key value violates unique constraint") {
				c.JSON(http.StatusConflict, gin.H{"error": "User with this email already exists."})
				return
			}
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create account."})
			return
		}
		c.JSON(http.StatusCreated, gin.H{"message": "Account created successfully"})
	}
}

func Login(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		user := models.User{}
		logInput := LoginInput{}
		erro := c.BindJSON(&logInput)
		if erro != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": erro.Error()})
			return
		}
		email := logInput.Email
		password := logInput.Password

		err := db.Where("Email = ?", email).First(&user).Error
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
			return
		}
		isPasswordValid, erro := utils.ComparePassword(password, user.Password)
		if !isPasswordValid || erro != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
			return
		}
		claims := map[string]any{
			"fullname": user.FullName,
			"id":       user.ID,
			"role":     user.Role,
		}
		accessToken, _ := GenerateToken(claims, []byte(secretKey), 4)
		refreshToken, _ := GenerateToken(claims, []byte(secretKey), 30*24)
		c.SetCookie("access_token", accessToken, 300*300, "/", "", false, true)
		c.SetCookie("refresh_token", refreshToken, 3000*3000, "/", "", false, true)

		c.JSON(http.StatusOK, gin.H{
			"user": UserResponse{
				ID:       user.ID,
				FullName: user.FullName,
				Email:    user.Email,
				Role:     user.Role,
			},
			"access_token":  accessToken,
			"refresh_token": refreshToken,
		})
	}
}

func GetUser(id any, db *gorm.DB) (models.User, error) {
	user := models.User{}
	err := db.Where("ID = ?", id).Preload("StudentProfile").
		Preload("TeacherProfile").
		Preload("TeacherProfile.Profile").
		Preload("TeacherProfile.Courses").
		Preload("StudentProfile.Preferences").
		Preload("StudentProfile.Courses").
		Preload("StudentProfile.Challenges").
		Preload("StudentProfile.Products").
		Omit("Password").
		First(&user).Error
	if err != nil {
		return models.User{}, err
	}
	return user, err
}

func CurrentUser(c *gin.Context, db *gorm.DB) (models.User, error) {
	user := models.User{}
	accessToken, _ := c.Cookie("access_token")

	refreshToken, errx := c.Cookie("refresh_token")
	if errx != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": errx.Error()})
		return models.User{}, errx

	}

	userClaims, err := VerifyToken(accessToken, []byte(secretKey))
	if err != nil {
		userClaims, err = VerifyToken(refreshToken, []byte(secretKey))
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
			return models.User{}, err

		}
		id := userClaims["id"]

		user, err = GetUser(id, db)
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
			return models.User{}, err
		}
		claims := map[string]any{
			"fullname": user.FullName,
			"id":       user.ID,
			"role":     user.Role,
		}
		accessToken, _ := GenerateToken(claims, []byte(secretKey), 4)
		refreshToken, _ := GenerateToken(claims, []byte(secretKey), 30*24)
		c.SetCookie("access_token", accessToken, 300*300, "/", "", false, true)
		c.SetCookie("refresh_token", refreshToken, 3000*3000, "/", "", false, true)

	}
	id := userClaims["id"]

	user, err = GetUser(id, db)
	return user, err
}

const (
	Admin   = 01
	Student = 02
	Teacher = 03
	Parent  = 04
)

func Role(code int) string {
	switch code {
	case Admin:
		return "Admin"
	case Student:
		return "Student"
	default:
		return ""
	}
}
