package routers

import (
	"aida/auth"
	"aida/config"
	"aida/models"
	"fmt"

	//	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

//	"gorm.io/gorm
//
// var DB = database.ConnectDB()
func CreateStudentProfile(c *gin.Context) {
	user, err := auth.CurrentUser(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, err.Error())
		return
	}

	db := config.DB()
	oldRec := models.Student{}
	err = db.Where(models.Student{ProfileID: user.ID}).First(&oldRec).Error
	if err != nil {
		NewStudent := models.Student{
			ID:        uuid.New(),
			Profile:   user,
			ProfileID: user.ID,
		}
		err = db.Create(&NewStudent).Preload("Profile").Error
		if err != nil {
			c.JSON(http.StatusBadRequest, err.Error())
			return
		}
		c.JSON(http.StatusCreated, NewStudent)
		return
	}
	c.JSON(http.StatusConflict, gin.H{"error": "User already exists!"})
}

// Get All Students Profile
func GetStudents(c *gin.Context) {
	_, err := auth.CurrentUser(c)
	Students := []models.Student{}
	if err != nil {
		c.JSON(http.StatusUnauthorized, err.Error())
		return
	}
	db := config.DB()
	err = db.Preload("Profile").Omit("Profile.Password").Find(&Students).Error
	if err != nil {
		c.JSON(http.StatusBadGateway, err.Error())
		return
	}
	c.JSON(http.StatusOK, Students)
}

func GetStudentProfile(c *gin.Context) {
	user, err := auth.CurrentUser(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, err.Error())
		return
	}
	db := config.DB()
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

func GetASudent(c *gin.Context) {
	_, err := auth.CurrentUser(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, err.Error())
		return
	}
	id := c.Param("id")
	db := config.DB()
	student := models.Student{}
	fmt.Println("url param is: ", id)
	err = db.Where("ID", id).Or("profile_id", id).Preload("Profile").
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

func DeleteStudentProfile(c *gin.Context) {
	user, err := auth.CurrentUser(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, err.Error())
		return
	}
	student_id := c.Query("id")
	db := config.DB()
	student := models.Student{}
	if user.Role == "Admin" {
		err = db.First(&student, "ID", student_id).First(&student).Error
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
