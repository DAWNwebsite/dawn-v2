package routers

import (
	"aida/auth"
	"aida/config"
	"aida/models"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func CreateTeachers(c *gin.Context) {
	user, err := auth.CurrentUser(c)
	id := c.Query("id")
	if err != nil {
		c.JSON(http.StatusUnauthorized, err.Error())
		return
	}
	if user.Role != "Admin" {
		c.JSON(http.StatusUnauthorized, "Your'\re unauthorized to perform this action")
		return
	}

	db := config.DB()
	tUser := models.User{}
	err = db.First(&tUser, "ID = ?", id).Error
	if err != nil {
		c.JSON(http.StatusNotFound, "This user was not found")
		return
	}
	exitsTeacher := models.Teacher{}
	err = db.First(&exitsTeacher, "ProfileID = ?", tUser.ID).Error
	if err == nil {
		c.JSON(http.StatusConflict, "user already exists as teacher ")
		return
	}

	newTeacher := models.Teacher{
		ID:        uuid.New(),
		ProfileID: tUser.ID,
		Profile:   tUser,
	}

	err = db.Create(&newTeacher).Error
	if err != nil {
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}
	c.JSON(http.StatusOK, newTeacher)
}

func GetAllTeachers(c *gin.Context) {
	_, err := auth.CurrentUser(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, "unauthorized")
		return
	}
	db := config.DB()
	teachers := []models.Teacher{}
	err = db.Order("created_at DESC").Find(&teachers).Error
	if err != nil {
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}
	c.JSON(http.StatusOK, teachers)
}

func GetOneTeacher(c *gin.Context) {
	_, err := auth.CurrentUser(c)
	if err != nil {
		c.JSONP(http.StatusUnauthorized, "unauthorized")
		return
	}
	id := c.Param("id")
	db := config.DB()
	teacher := models.Teacher{}
	err = db.Preload("Profile").
		Preload("Courses").
		First(&teacher, "ID = ?", id).Error
	if err != nil {
		c.JSON(http.StatusNotFound, "Teacher not found")
		return

	}
	c.JSON(http.StatusOK, teacher)
}
