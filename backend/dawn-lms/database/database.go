package database

import (
	"aida/config"
	"log"

	"gorm.io/gorm"
)

func ConnectDB() *gorm.DB {
	// Get database configuration
	dbConfig := config.GetDatabaseConfig()

	// Connect to database with configuration
	DB, err := config.ConnectDatabase(dbConfig)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
		return nil
	}
	return DB
}
