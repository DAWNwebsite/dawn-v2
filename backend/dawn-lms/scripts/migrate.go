package main

import (
	"aida/config"
	"aida/models"
	"flag"
	"fmt"
	"log"
	"os"

	"gorm.io/gorm"
)

func main() {
	var (
		drop = flag.Bool("drop", false, "Drop all tables before migration")
		seed = flag.Bool("seed", false, "Seed database with sample data")
	)
	flag.Parse()

	// Load environment variables
	if err := loadEnv(); err != nil {
		log.Printf("Warning: Could not load .env file: %v", err)
	}

	// Get database configuration
	dbConfig := config.GetDatabaseConfig()
	
	// Connect to database
	db, err := config.ConnectDatabase(dbConfig)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	// Drop tables if requested
	if *drop {
		fmt.Println("Dropping all tables...")
		err = db.Migrator().DropTable(
			&models.Product{},
			&models.Preference{},
			&models.Teacher{},
			&models.Student{},
			&models.Course{},
			&models.Challenges{},
			&models.User{},
		)
		if err != nil {
			log.Fatalf("Failed to drop tables: %v", err)
		}
		fmt.Println("Tables dropped successfully")
	}

	// Run migrations
	fmt.Println("Running database migrations...")
	err = db.AutoMigrate(
		&models.User{},
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
	fmt.Println("Database migration completed successfully")

	// Seed database if requested
	if *seed {
		fmt.Println("Seeding database with sample data...")
		if err := seedDatabase(db); err != nil {
			log.Fatalf("Failed to seed database: %v", err)
		}
		fmt.Println("Database seeded successfully")
	}
}

func loadEnv() error {
	// Simple .env file loader
	if _, err := os.Stat(".env"); os.IsNotExist(err) {
		return fmt.Errorf(".env file not found")
	}
	// In a real implementation, you'd use godotenv here
	return nil
}

func seedDatabase(db *gorm.DB) error {
	// Create sample admin user
	adminUser := &models.User{
		Username: "admin",
		Email:    "admin@dawn.ai",
		Role:     "admin",
		// Password would be hashed in real implementation
	}
	
	if err := db.FirstOrCreate(adminUser, models.User{Email: adminUser.Email}).Error; err != nil {
		return fmt.Errorf("failed to create admin user: %w", err)
	}

	// Create sample teacher
	teacherUser := &models.User{
		Username: "teacher",
		Email:    "teacher@dawn.ai", 
		Role:     "teacher",
	}
	
	if err := db.FirstOrCreate(teacherUser, models.User{Email: teacherUser.Email}).Error; err != nil {
		return fmt.Errorf("failed to create teacher user: %w", err)
	}

	// Create sample student
	studentUser := &models.User{
		Username: "student",
		Email:    "student@dawn.ai",
		Role:     "student",
	}
	
	if err := db.FirstOrCreate(studentUser, models.User{Email: studentUser.Email}).Error; err != nil {
		return fmt.Errorf("failed to create student user: %w", err)
	}

	return nil
} 