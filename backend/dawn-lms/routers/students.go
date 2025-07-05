package routers

import (
	"aida/auth"
	"aida/models"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

func SetupStudentRoutes(r *gin.Engine, db *gorm.DB) {
	studentGroup := r.Group("/student")
	{
		studentGroup.POST("/new", CreateStudentProfile(db))
		studentGroup.GET("/all", GetStudents(db))
		studentGroup.GET("/:id", GetAStudent(db))
		studentGroup.GET("/myprofile", GetStudentProfile(db))
		studentGroup.DELETE("/delete", DeleteStudentProfile(db))
	}
}

func CreateStudentProfile(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		user, err := auth.CurrentUser(c, db)
		if err != nil {
			c.JSON(http.StatusUnauthorized, err.Error())
			return
		}

		oldRec := models.Student{}
		err = db.Where(models.Student{ProfileID: user.ID}).First(&oldRec).Error
		if err != nil {
			NewStudent := models.Student{
				ID:        uuid.New(),
				Profile:   user,
				ProfileID: user.ID,
			}
			err = db.Create(&NewStudent).Error
			if err != nil {
				c.JSON(http.StatusBadRequest, err.Error())
				return
			}
			c.JSON(http.StatusCreated, NewStudent)
			return
		}
		c.JSON(http.StatusConflict, gin.H{"error": "User already exists!"})
	}
}

func GetStudents(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		_, err := auth.CurrentUser(c, db)
		Students := []models.Student{}
		if err != nil {
			c.JSON(http.StatusUnauthorized, err.Error())
			return
		}
		err = db.Preload("Profile").Find(&Students).Error
		if err != nil {
			c.JSON(http.StatusBadGateway, err.Error())
			return
		}
		c.JSON(http.StatusOK, Students)
	}
}

func GetStudentProfile(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		user, err := auth.CurrentUser(c, db)
		if err != nil {
			c.JSON(http.StatusUnauthorized, err.Error())
			return
		}
		student := models.Student{}
		err = db.Where(&models.Student{ProfileID: user.ID}).Preload("Profile").
			Preload("Preferences").
			Preload("Courses").
			Preload("Challenges").
			Preload("Products").
			First(&student).Error
		if err != nil {
			c.JSON(http.StatusNotFound, err.Error())
			return
		}
		c.JSON(http.StatusOK, student)
	}
}

func GetAStudent(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		_, err := auth.CurrentUser(c, db)
		if err != nil {
			c.JSON(http.StatusUnauthorized, err.Error())
			return
		}
		id := c.Param("id")
		student := models.Student{}
		fmt.Println("url param is: ", id)
		err = db.Where("ID = ?", id).Or("profile_id = ?", id).Preload("Profile").
			Preload("Preferences").
			Preload("Courses").
			Preload("Challenges").
			Preload("Products").
			First(&student).Error
		if err != nil {
			c.JSON(http.StatusNotFound, err.Error())
			return
		}
		c.JSON(http.StatusOK, student)
	}
}

func DeleteStudentProfile(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		user, err := auth.CurrentUser(c, db)
		if err != nil {
			c.JSON(http.StatusUnauthorized, err.Error())
			return
		}
		student_id := c.Query("id")
		student := models.Student{}
		if user.Role == "Admin" {
			err = db.First(&student, "id = ?", student_id).Error
			if err != nil {
				c.JSON(http.StatusBadRequest, err.Error())
				return
			}
			err = db.Delete(&student).Error
			if err != nil {
				c.JSON(http.StatusBadRequest, err.Error())
				return
			}
			c.JSON(http.StatusOK, gin.H{"message": "Student profile deleted"})
			return
		} else {
			c.JSON(http.StatusUnauthorized, "unauthorized to delete student")
			return
		}
	}
}
