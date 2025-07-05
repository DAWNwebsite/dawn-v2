package database

import (
	"aida/config"
	"aida/models"
	"log"
)

// InitDatabase establishes the database connection and runs auto-migrations.
// This should be called once at application startup.
func InitDatabase() error {
	// Get database configuration
	dbConfig := config.GetDatabaseConfig()

	// Connect to database with configuration. This sets the singleton instance.
	_, err := config.ConnectDatabase(dbConfig)
	if err != nil {
		log.Printf("Failed to connect to database: %v", err)
		return err
	}

	// Get the singleton instance for migration
	db := config.DB()
	if db == nil {
		log.Fatal("Database connection is nil after initialization")
	}

	// Auto-migrate database schema
	err = db.AutoMigrate(
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
		return err
	}

	log.Println("Database migration completed successfully")
	return nil
}
