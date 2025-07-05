package main

import (
	"aida/auth"
	"aida/database"
	"aida/models"
	"aida/routers"
	"flag"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// "github.com/joechristophers/GoEasyJWT"
func main() {
	// Check for command-line flags
	seedDb := flag.Bool("seed", false, "Set to true to seed the database")
	flag.Parse()

	// Initialize database connection
	db := database.ConnectDB()
	if db == nil {
		log.Fatal("Failed to connect to the database")
	}

	// Auto-migrate database schema
	err := db.AutoMigrate(
		&models.User{},
		&models.AccessibilityPreferences{},
		&models.LearningProfile{},
		&models.DiagnosticResult{},
		&models.ParentalConsent{},
		&models.Challenges{},
		&models.Course{},
		&models.Student{},
		&models.Teacher{},
		&models.Preference{},
		&models.Product{},
	)
	if err != nil {
		log.Fatalf("Failed to migrate database: %v", err)
	}
	log.Println("Database migration completed successfully")

	if *seedDb {
		fmt.Println("Seeding the database...")
		// The seeder script will be a separate main package, so this is illustrative
		return // Exit after seeding is conceptually done here
	}

	r := gin.Default()

	// CORS configuration
	frontendOrigin := os.Getenv("FRONTEND_ORIGIN")
	if frontendOrigin == "" {
		frontendOrigin = "http://localhost:3000" // Default for local development
	}

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{frontendOrigin},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// Pass the database connection to the router setup functions
	auth.SetupAuthRoutes(r, db)
	routers.SetupUserRoutes(r, db)
	routers.SetupStudentRoutes(r, db)
	routers.SetupCourseRoutes(r, db)
	routers.SetupTeacherRoutes(r, db)

	// Health check endpoint
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status":    "healthy",
			"timestamp": time.Now().Format(time.RFC3339),
			"service":   "dawn-lms-api",
		})
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Println("Backend service starting on port " + port)
	if err := r.Run(":" + port); err != nil {
		log.Fatalf("Failed to run server: %v", err)
	}
}
