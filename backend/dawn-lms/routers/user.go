package routers

import (
	"aida/auth"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func SetupUserRoutes(r *gin.Engine, db *gorm.DB) {
	userGroup := r.Group("/user")
	{
		// Pass db to handlers that need it. UserProfile gets it via auth.CurrentUser
		userGroup.GET("/profile", UserProfile(db))
	}
}

func UserProfile(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		user, err := auth.CurrentUser(c, db) // Pass db to CurrentUser
		if err != nil {
			c.JSON(400, gin.H{
				"error": err.Error(),
			})
			return
		}
		c.JSON(200, user)
	}
}
