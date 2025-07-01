package auth

import (
	"aida/database"
	"aida/models"
	"aida/utils"

	//	"fmt"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	goeasyjwt "github.com/joechristophers/GoEasyJWT"
)

var DB = database.ConnectDB()

var secretKey = os.Getenv("SECRET_KEY")

type SignUpInfo struct {
	FullName string `json:"fullname"`
	Email    string `json:"email"`
	Password string `json:"password"`
	Country  string `json:"country"`
	Role     string `json:"role"`
}

type LoginInput struct {
	Email    string
	Password string
}

func SignUp(c *gin.Context) {
	SignupInput := SignUpInfo{}
	erro := c.BindJSON(&SignupInput)
	if erro != nil {
		c.JSON(http.StatusBadRequest, erro.Error())
		return
	}
	hashed, err := utils.HashPassword(SignupInput.Password)
	if err != nil {
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}
	newAccount := models.User{
		ID:       uuid.New(),
		FullName: SignupInput.FullName,
		Email:    SignupInput.Email,
		Password: hashed,
		Country:  SignupInput.Country,
		Role:     SignupInput.Role,
	}

	err = DB.Create(&newAccount).Error
	if err != nil {
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}
	c.JSON(http.StatusCreated, newAccount)
}

func Login(c *gin.Context) {
	user := models.User{}
	logInput := LoginInput{}
	erro := c.BindJSON(&logInput)
	if erro != nil {
		c.JSON(http.StatusBadRequest, erro.Error())
		return
	}
	email := logInput.Email
	password := logInput.Password

	err := DB.Where("Email = ?", email).First(&user).Error
	if err != nil {
		c.JSON(http.StatusUnauthorized, err.Error())
		return
	}
	isPasswordValid, erro := utils.ComparePassword(password, user.Password)
	if !isPasswordValid && erro != nil {
		c.JSON(http.StatusUnauthorized, erro.Error())
		return
	}
	claims := map[string]any{
		"fullname": user.FullName,
		"id":       user.ID,
		"role":     user.Role,
	}
	accessToken, _ := goeasyjwt.GenerateToken(claims, []byte(secretKey), 4)
	refreshToken, _ := goeasyjwt.GenerateToken(claims, []byte(secretKey), 30*50)
	c.SetCookie("access_token", accessToken, 300*300, "/", "", false, true)
	c.SetCookie("refresh_token", refreshToken, 3000*3000, "/", "", false, true)

	c.JSON(http.StatusOK, gin.H{
		"user":          user,
		"access_token":  accessToken,
		"refresh_token": refreshToken,
	})
}

func GetUser(id any) (models.User, error) {
	user := models.User{}
	err := DB.Where("ID = ?", id).Preload("StudentProfile").
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

func CurrentUser(c *gin.Context) (models.User, error) {
	user := models.User{}
	accessToken, _ := c.Cookie("access_token")

	refreshToken, errx := c.Cookie("refresh_token")
	if errx != nil {
		c.JSON(http.StatusBadRequest, errx.Error())
		return models.User{}, errx

	}

	userClaims, err := goeasyjwt.VerifyToken(accessToken, []byte(secretKey))
	if err != nil {
		userClaims, err = goeasyjwt.VerifyToken(refreshToken, []byte(secretKey))
		if err != nil {
			c.JSON(http.StatusUnauthorized, err.Error())
			return models.User{}, err

		}
		id := userClaims["id"]

		user, err = GetUser(id)
		if err != nil {
			c.JSON(http.StatusNotFound, err.Error())
			return models.User{}, err
		}
		claims := map[string]any{
			"fullname": user.FullName,
			"id":       user.ID,
			"role":     user.Role,
		}
		accessToken, _ := goeasyjwt.GenerateToken(claims, []byte(secretKey), 4)
		refreshToken, _ := goeasyjwt.GenerateToken(claims, []byte(secretKey), 30*50)
		c.SetCookie("access_token", accessToken, 300*300, "/", "", false, true)
		c.SetCookie("refresh_token", refreshToken, 3000*3000, "/", "", false, true)

	}
	id := userClaims["id"]

	user, err = GetUser(id)
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
