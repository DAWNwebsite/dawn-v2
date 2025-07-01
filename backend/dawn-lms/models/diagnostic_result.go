package models

import (
	"database/sql/driver"
	"encoding/json"
	"errors"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// DetailedResults represents a JSON structure for storing granular assessment data
type DetailedResults map[string]interface{}

// Value implements the driver.Valuer interface for database storage
func (d DetailedResults) Value() (driver.Value, error) {
	return json.Marshal(d)
}

// Scan implements the sql.Scanner interface for database retrieval
func (d *DetailedResults) Scan(value interface{}) error {
	if value == nil {
		return nil
	}
	
	bytes, ok := value.([]byte)
	if !ok {
		return errors.New("type assertion to []byte failed")
	}
	
	return json.Unmarshal(bytes, d)
}

// DiagnosticResult stores results from various assessments and diagnostic tools
type DiagnosticResult struct {
	gorm.Model
	UserID           uuid.UUID       `gorm:"type:uuid;not null;index"`
	User             User            `gorm:"foreignKey:UserID"`
	
	// Assessment identification
	AssessmentID     string          `gorm:"not null;index"`        // Unique identifier for the assessment type
	AssessmentName   string          `gorm:"not null"`              // Human-readable assessment name
	AssessmentType   string          `gorm:"not null;index"`        // 'adhd', 'dyslexia', 'autism', 'learning_style', 'cognitive'
	Version          string          `gorm:"default:'1.0'"`         // Assessment version for tracking changes
	
	// Results
	Score            float64         `gorm:"not null"`              // Primary numeric score
	MaxScore         float64         `gorm:"not null"`              // Maximum possible score
	PercentageScore  float64         `gorm:"not null"`              // Percentage score (0-100)
	
	// Detailed assessment data (stored as JSONB)
	DetailedResults  DetailedResults `gorm:"type:jsonb"`            // Granular response data and subscores
	
	// Timing and completion
	CompletedAt      time.Time       `gorm:"not null;index"`        // When the assessment was completed
	DurationMinutes  int             `gorm:"not null"`              // How long the assessment took
	
	// Interpretation and recommendations
	Interpretation   string          `gorm:"type:text"`             // AI-generated interpretation of results
	Recommendations  string          `gorm:"type:text"`             // Suggested interventions or next steps
	ConfidenceLevel  float64         `gorm:"default:0.0"`           // AI confidence in the results (0-1)
	
	// Validation and review
	ReviewStatus     string          `gorm:"default:'pending'"`     // 'pending', 'reviewed', 'validated', 'flagged'
	ReviewedBy       *uuid.UUID      `gorm:"type:uuid"`             // Professional who reviewed the results
	ReviewNotes      string          `gorm:"type:text"`             // Professional review notes
	ReviewedAt       *time.Time                                     // When the review was completed
	
	// Flags and alerts
	RequiresFollowUp bool            `gorm:"default:false"`         // Whether results indicate need for follow-up
	AlertLevel       string          `gorm:"default:'none'"`        // 'none', 'low', 'medium', 'high', 'urgent'
	AlertReason      string          `gorm:"type:text"`             // Reason for alert if any
} 