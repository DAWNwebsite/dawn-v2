package routers

import (
	"aida/auth"
	"aida/database"
	"net/http"

	"github.com/gin-gonic/gin"
)

var DB = database.ConnectDB()

func UserProfile(c *gin.Context) {
	user, err := auth.CurrentUser(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, err.Error())
		return
	}
	c.JSON(http.StatusOK, user)
}
