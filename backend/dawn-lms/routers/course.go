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

func SetupCourseRoutes(r *gin.Engine, db *gorm.DB) {
	courseGroup := r.Group("/course")
	{
		courseGroup.POST("/new", CreateCourse(db))
		courseGroup.GET("/all", GetAllCourses(db))
		courseGroup.GET("/:id", GetOneCourse(db))
		courseGroup.DELETE("/:id/delete", DeleteCourse(db))
		courseGroup.PUT("/:id/students/new", AddCourseToStudent(db))
		courseGroup.DELETE("/:id/students/delete", RemoveStudentFromCourse(db))
		courseGroup.DELETE("/:id/teachers/delete", RemoveTeacherFromCourse(db))
		courseGroup.PUT("/:id/teachers/new", AddTeacherToCourse(db))
		courseGroup.GET("/:id/teachers", GetAllCourseTeachers(db))
		courseGroup.GET("/:id/students", GetCourseStudents(db))
	}
}

type CourseInput struct {
	Title       string `json:"title"`
	Description string `json:"description"`
}

func CreateCourse(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		user, err := auth.CurrentUser(c, db)
		if err != nil {
			c.JSON(http.StatusUnauthorized, err.Error())
			return
		}
		courseInput := CourseInput{}
		c.BindJSON(&courseInput)
		if user.Role == "Admin" {
			newCourse := models.Course{
				ID:          uuid.New(),
				Title:       courseInput.Title,
				Description: courseInput.Description,
			}

			err = db.Create(&newCourse).Error
			if err != nil {
				c.JSON(http.StatusBadRequest, err.Error())
				return
			}
			c.JSON(http.StatusCreated, newCourse)
			return
		}
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized action"})
	}
}

func GetAllCourses(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		_, err := auth.CurrentUser(c, db)
		if err != nil {
			c.JSON(http.StatusUnauthorized, err.Error())
			return
		}
		courses := []models.Course{}
		err = db.Preload("Students").
			Preload("Students.Profile").
			Preload("TeacherS").
			Preload("TeacherS.Profile").
			Order("created_at DESC").Find(&courses).Error
		if err != nil {
			c.JSON(http.StatusBadRequest, err.Error())
			return
		}
		c.JSON(http.StatusOK, courses)
	}
}

func GetOneCourse(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		_, err := auth.CurrentUser(c, db)
		if err != nil {
			c.JSON(http.StatusUnauthorized, err.Error())
			return
		}
		course := models.Course{}
		id := c.Param("id")
		err = db.Preload("Students").
			Preload("Students.Profile").
			Preload("TeacherS").
			Preload("TeacherS.Profile").
			First(&course, "id = ?", id).Error
		if err != nil {
			c.JSON(http.StatusBadRequest, err.Error())
			return
		}
		c.JSON(http.StatusOK, course)
	}
}

func DeleteCourse(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		user, err := auth.CurrentUser(c, db)
		if err != nil {
			c.JSON(http.StatusUnauthorized, err.Error())
			return
		}
		course := models.Course{}
		id := c.Param("id")
		if user.Role != "Admin" {
			c.JSON(http.StatusUnauthorized, "Unauthorized to perform this action!")
			return
		}
		err = db.Delete(&course, "id = ?", id).Error
		if err != nil {
			c.JSON(http.StatusNotFound, err.Error())
			return
		}
		c.JSON(http.StatusOK, "course deleted successfully!")
	}
}

func AddCourseToStudent(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		user, err := auth.CurrentUser(c, db)
		if err != nil {
			c.JSON(http.StatusUnauthorized, err.Error())
			return
		}

		course := models.Course{}
		student := models.Student{}
		student_id := c.Query("student_id")
		courseID := c.Param("id")
		if user.Role != "Admin" {
			c.JSON(http.StatusUnauthorized, "unauthorized to perform this action!")
			return
		}
		err = db.First(&course, "id =  ?", courseID).Error
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "course not found"})
			return
		}
		err = db.Preload("Courses").First(&student, "id = ?", student_id).Error
		if err != nil {
			c.JSON(http.StatusNotFound, "student not found")
			return
		}
		for _, v := range student.Courses {
			if v.ID == course.ID {
				c.JSON(http.StatusConflict, "Course already added to user list")
				return
			}
		}
		err = db.Model(&student).Association("Courses").Append(&course)
		if err != nil {
			c.JSON(http.StatusBadRequest, err.Error())
			return
		}
		c.JSON(http.StatusOK, "Course added to user")
	}
}

func RemoveStudentFromCourse(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		user, err := auth.CurrentUser(c, db)
		if err != nil {
			c.JSON(http.StatusUnauthorized, err.Error())
			return
		}

		course := models.Course{}
		student := models.Student{}
		student_id := c.Query("student_id")
		courseID := c.Param("id")
		if user.Role != "Admin" {
			c.JSON(http.StatusUnauthorized, "unauthorized to perform this action!")
			return
		}
		err = db.First(&course, "id =  ?", courseID).Error
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "course not found"})
			return
		}
		err = db.Preload("Courses").First(&student, "id = ?", student_id).Error
		if err != nil {
			c.JSON(http.StatusNotFound, "student not found")
			return
		}
		found := false
		for _, v := range student.Courses {
			if v.ID == course.ID {
				found = true
				break
			}
		}
		fmt.Println("found:", found)
		if !found {
			c.JSON(http.StatusNotFound, "this course does not exist in the list of courses for this student!")
			return
		}
		err = db.Model(&student).Association("Courses").Delete(&course)
		if err != nil {
			c.JSON(http.StatusBadRequest, err.Error())
			return
		}
		c.JSON(http.StatusOK, "User removed from courses!")
	}
}

func GetCourseStudents(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		user, err := auth.CurrentUser(c, db)
		id := c.Param("id")
		if err != nil {
			c.JSON(http.StatusUnauthorized, "unauthorized")
			return
		}
		if user.Role != "Admin" {
			c.JSON(http.StatusUnauthorized, "Not Unauthorized to execute this action")
			return
		}
		course := models.Course{}

		err = db.Preload("Students").
			Preload("Students.Profile").
			Preload("Students.Preferences").
			Preload("Students.Courses").
			Preload("Students.Challenges").
			Preload("Students.Products").
			First(&course, "id = ?", id).Error
		if err != nil {
			c.JSON(http.StatusNotFound, err.Error())
			return
		}
		c.JSON(http.StatusOK, course.Students)
	}
}

func AddTeacherToCourse(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		user, err := auth.CurrentUser(c, db)
		if err != nil {
			c.JSON(http.StatusUnauthorized, "unauthorized")
			return
		}
		if user.Role != "Admin" {
			c.JSON(http.StatusUnauthorized, "unauthorized to perform this action")
			return
		}
		tId := c.Query("teacherID")

		courseID := c.Param("id")
		teacher := models.Teacher{}
		course := models.Course{}
		err = db.First(&teacher, "id = ?", tId).Error
		if err != nil {
			c.JSON(http.StatusNotFound, "Teacher profile not found")
			return
		}
		err = db.First(&course, "id = ?", courseID).Error
		if err != nil {
			c.JSON(http.StatusNotFound, "Course not found!")
			return
		}
		found := false
		for _, v := range teacher.Courses {
			if v.ID == course.ID {
				found = true
			}
		}
		if found {
			c.JSON(http.StatusNotFound, "Teacher already found in this course list")
			return
		}

		err = db.Model(&course).Association("TeacherS").Append(&teacher)
		if err != nil {
			c.JSON(http.StatusInternalServerError, err.Error())
			return
		}
		c.JSON(http.StatusOK, "teacher now added to this course!")
	}
}

func RemoveTeacherFromCourse(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		user, err := auth.CurrentUser(c, db)
		if err != nil {
			c.JSON(http.StatusUnauthorized, "unauthorized")
			return
		}
		if user.Role != "Admin" {
			c.JSON(http.StatusUnauthorized, "Unauthorized to perform this action")
			return
		}

		tId := c.Query("teacherID")
		courseID := c.Param("id")
		teacher := models.Teacher{}
		course := models.Course{}
		err = db.First(&teacher, "id = ?", tId).Error
		if err != nil {
			c.JSON(http.StatusNotFound, "Teacher profile not found")
			return
		}
		err = db.First(&course, "id = ?", courseID).Error
		if err != nil {
			c.JSON(http.StatusNotFound, "Course not found!")
			return
		}
		found := true
		for _, v := range teacher.Courses {
			if v.ID != course.ID {
				found = false
			}
		}
		if !found {
			c.JSON(http.StatusNotFound, "Teacher not found in this course list")
			return
		}

		err = db.Model(&course).Association("TeacherS").Delete(&teacher)
		if err != nil {
			c.JSON(http.StatusInternalServerError, err.Error())
			return
		}
		c.JSON(http.StatusOK, "Teacher removed from course")
	}
}

func GetAllCourseTeachers(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		_, err := auth.CurrentUser(c, db)
		if err != nil {
			c.JSON(http.StatusUnauthorized, err.Error())
			return
		}

		courseID := c.Param("id")
		course := models.Course{}
		err = db.Preload("TeacherS").First(&course, "id = ?", courseID).Error
		if err != nil {
			c.JSON(http.StatusNotFound, err.Error())
			return
		}
		c.JSON(http.StatusOK, course.TeacherS)
	}
}
