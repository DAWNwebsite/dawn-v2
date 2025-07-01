package config

import (
	"fmt"
	"log"
	"os"
	"strconv"
	"time"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

type DatabaseConfig struct {
	Host         string
	Port         int
	User         string
	Password     string
	Database     string
	SSLMode      string
	MaxOpenConns int
	MaxIdleConns int
	MaxLifetime  time.Duration
}

func GetDatabaseConfig() *DatabaseConfig {
	config := &DatabaseConfig{
		Host:         getEnv("DB_HOST", "localhost"),
		Port:         getEnvAsInt("DB_PORT", 5432),
		User:         getEnv("DB_USER", "postgres"),
		Password:     getEnv("DB_PASSWORD", "password"),
		Database:     getEnv("DB_NAME", "dawn_db"),
		SSLMode:      getEnv("DB_SSLMODE", "disable"),
		MaxOpenConns: getEnvAsInt("DB_MAX_OPEN_CONNS", 25),
		MaxIdleConns: getEnvAsInt("DB_MAX_IDLE_CONNS", 25),
		MaxLifetime:  time.Duration(getEnvAsInt("DB_MAX_LIFETIME_MINUTES", 5)) * time.Minute,
	}

	return config
}

func (config *DatabaseConfig) GetDSN() string {
	return fmt.Sprintf(
		"host=%s port=%d user=%s password=%s dbname=%s sslmode=%s TimeZone=UTC",
		config.Host,
		config.Port,
		config.User,
		config.Password,
		config.Database,
		config.SSLMode,
	)
}

func ConnectDatabase(config *DatabaseConfig) (*gorm.DB, error) {
	// Configure GORM logger
	logLevel := logger.Error
	if getEnv("APP_ENV", "development") == "development" {
		logLevel = logger.Info
	}

	gormConfig := &gorm.Config{
		Logger: logger.Default.LogMode(logLevel),
	}

	// Connect to database
	db, err := gorm.Open(postgres.Open(config.GetDSN()), gormConfig)
	if err != nil {
		return nil, fmt.Errorf("failed to connect to database: %w", err)
	}

	// Get underlying sql.DB for connection pooling
	sqlDB, err := db.DB()
	if err != nil {
		return nil, fmt.Errorf("failed to get underlying sql.DB: %w", err)
	}

	// Configure connection pool
	sqlDB.SetMaxOpenConns(config.MaxOpenConns)
	sqlDB.SetMaxIdleConns(config.MaxIdleConns)
	sqlDB.SetConnMaxLifetime(config.MaxLifetime)

	// Test the connection
	if err := sqlDB.Ping(); err != nil {
		return nil, fmt.Errorf("failed to ping database: %w", err)
	}

	log.Printf("Successfully connected to PostgreSQL database: %s", config.Database)
	return db, nil
}

// Helper functions
func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

func getEnvAsInt(key string, defaultValue int) int {
	if value := os.Getenv(key); value != "" {
		if intValue, err := strconv.Atoi(value); err == nil {
			return intValue
		}
	}
	return defaultValue
} 