package models

import (
	"database/sql/driver"
	"encoding/json"
	"errors"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// SubjectStrengthsWeaknesses represents a JSON structure for storing subject-specific data
type SubjectStrengthsWeaknesses map[string]interface{}

// Value implements the driver.Valuer interface for database storage
func (s SubjectStrengthsWeaknesses) Value() (driver.Value, error) {
	return json.Marshal(s)
}

// Scan implements the sql.Scanner interface for database retrieval
func (s *SubjectStrengthsWeaknesses) Scan(value interface{}) error {
	if value == nil {
		return nil
	}
	
	bytes, ok := value.([]byte)
	if !ok {
		return errors.New("type assertion to []byte failed")
	}
	
	return json.Unmarshal(bytes, s)
}

// LearningProfile stores individual learning preferences and patterns
type LearningProfile struct {
	gorm.Model
	UserID                      uuid.UUID                   `gorm:"type:uuid;not null;uniqueIndex"`
	User                        User                        `gorm:"foreignKey:UserID"`
	
	// Learning style preferences
	LearningStyle               string                      `gorm:"default:'mixed'"` // 'visual', 'auditory', 'kinesthetic', 'mixed'
	PreferredPace               string                      `gorm:"default:'medium'"` // 'slow', 'medium', 'fast', 'adaptive'
	AttentionSpanMinutes        int                         `gorm:"default:20"`       // Estimated attention span in minutes
	
	// Subject-specific strengths and weaknesses (stored as JSONB)
	SubjectStrengthsWeaknesses  SubjectStrengthsWeaknesses  `gorm:"type:jsonb"`
	
	// Learning preferences
	PreferredTimeOfDay          string                      `gorm:"default:'morning'"` // 'morning', 'afternoon', 'evening', 'flexible'
	BreakFrequencyMinutes       int                         `gorm:"default:30"`        // How often breaks are needed
	MultitaskingPreference      bool                        `gorm:"default:false"`     // Prefers single-task focus
	
	// Neurodivergent-specific settings
	SensoryProcessingNotes      string                      `gorm:"type:text"`         // Free-form notes about sensory needs
	CommunicationPreferences    string                      `gorm:"default:'mixed'"`   // 'verbal', 'written', 'visual', 'mixed'
	ExecutiveFunctionSupport    bool                        `gorm:"default:false"`     // Needs executive function support
	
	// Motivation and engagement
	PreferredRewardSystem       string                      `gorm:"default:'progress'"` // 'points', 'badges', 'progress', 'none'
	InterestAreas               string                      `gorm:"type:text"`          // Comma-separated list of interests
	
	// Assessment and feedback preferences
	FeedbackStyle               string                      `gorm:"default:'constructive'"` // 'immediate', 'delayed', 'constructive', 'minimal'
	AssessmentFormat            string                      `gorm:"default:'mixed'"`        // 'multiple_choice', 'open_ended', 'practical', 'mixed'
} 