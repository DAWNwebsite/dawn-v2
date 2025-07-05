package routers

import (
	"aida/auth"
	"aida/models"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

func SetupTeacherRoutes(r *gin.Engine, db *gorm.DB) {
	teacherGroup := r.Group("/teacher")
	{
		teacherGroup.POST("/new", CreateTeachers(db))
		teacherGroup.GET("/all", GetAllTeachers(db))
		teacherGroup.GET("/:id", GetOneTeacher(db))
	}
}

func CreateTeachers(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		user, err := auth.CurrentUser(c, db)
		id := c.Query("id")
		if err != nil {
			c.JSON(http.StatusUnauthorized, err.Error())
			return
		}
		if user.Role != "Admin" {
			c.JSON(http.StatusUnauthorized, "You're unauthorized to perform this action")
			return
		}
		tUser := models.User{}
		err = db.First(&tUser, "id = ?", id).Error
		if err != nil {
			c.JSON(http.StatusNotFound, "This user was not found")
			return
		}
		exitsTeacher := models.Teacher{}
		err = db.First(&exitsTeacher, "profile_id = ?", tUser.ID).Error
		if err == nil {
			c.JSON(http.StatusConflict, "user already exists as teacher")
			return
		}

		newTeacher := models.Teacher{
			ID:        uuid.New().String(),
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
}

func GetAllTeachers(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		_, err := auth.CurrentUser(c, db)
		if err != nil {
			c.JSON(http.StatusUnauthorized, "unauthorized")
			return
		}
		teachers := []models.Teacher{}
		err = db.Order("created_at DESC").Find(&teachers).Error
		if err != nil {
			c.JSON(http.StatusInternalServerError, err.Error())
			return
		}
		c.JSON(http.StatusOK, teachers)
	}
}

func GetOneTeacher(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		_, err := auth.CurrentUser(c, db)
		if err != nil {
			c.JSONP(http.StatusUnauthorized, "unauthorized")
			return
		}
		id := c.Param("id")
		teacher := models.Teacher{}
		err = db.Preload("Profile").
			Preload("Courses").
			First(&teacher, "id = ?", id).Error
		if err != nil {
			c.JSON(http.StatusNotFound, "Teacher not found")
			return
		}
		c.JSON(http.StatusOK, teacher)
	}
}
