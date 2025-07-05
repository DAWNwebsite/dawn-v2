package routers

import (
	"aida/auth"

	"github.com/gin-gonic/gin"
)

func UserProfile(c *gin.Context) {
	user, err := auth.CurrentUser(c)
	if err != nil {
		c.JSON(400, gin.H{
			"error": err.Error(),
		})
		return
	}
	c.JSON(200, user)
}
