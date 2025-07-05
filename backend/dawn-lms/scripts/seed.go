package main

import (
	"aida/database"
	"aida/models"
	"aida/utils"
	"fmt"
	"log"

	"github.com/google/uuid"
)

func main() {
	// Connect to the database
	db := database.ConnectDB()

	// Array of users to seed
	users := []models.User{
		{
			FullName: "Student User",
			Email:    "student@example.com",
			Password: "password123",
			Role:     "student",
			Country:  "USA",
		},
		{
			FullName: "Parent User",
			Email:    "parent@example.com",
			Password: "password123",
			Role:     "parent",
			Country:  "USA",
		},
		{
			FullName: "Teacher User",
			Email:    "teacher@example.com",
			Password: "password123",
			Role:     "teacher",
			Country:  "USA",
		},
	}

	// Iterate over the users and create them
	for _, userData := range users {
		// Check if user already exists
		var existingUser models.User
		if db.Where("email = ?", userData.Email).First(&existingUser).Error == nil {
			fmt.Printf("User with email %s already exists. Skipping.\n", userData.Email)
			continue
		}

		// Hash the password
		hashedPassword, err := utils.HashPassword(userData.Password)
		if err != nil {
			log.Fatalf("Failed to hash password for user %s: %v", userData.Email, err)
		}

		// Create a new user record
		newUser := models.User{
			ID:       uuid.New(),
			FullName: userData.FullName,
			Email:    userData.Email,
			Password: hashedPassword,
			Role:     userData.Role,
			Country:  userData.Country,
		}

		// Save the new user to the database
		if err := db.Create(&newUser).Error; err != nil {
			log.Fatalf("Failed to create user %s: %v", userData.Email, err)
		}

		fmt.Printf("Successfully created user: %s (%s)\n", newUser.FullName, newUser.Email)
	}

	fmt.Println("Database seeding completed successfully.")
} 