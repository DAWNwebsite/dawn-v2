package database

import (
	"aida/config"
	"aida/models"
	"log"

	"gorm.io/gorm"
)

func ConnectDB() *gorm.DB {
	// Get database configuration
	dbConfig := config.GetDatabaseConfig()
	
	// Connect to database with configuration
	DB, err := config.ConnectDatabase(dbConfig)
	if err != nil {
		log.Printf("Failed to connect to database: %v", err)
		return nil
	}

	// Auto-migrate database schema
	err = DB.AutoMigrate(
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
		log.Printf("Failed to migrate database: %v", err)
		return nil
	}

	log.Println("Database migration completed successfully")
	return DB
}
