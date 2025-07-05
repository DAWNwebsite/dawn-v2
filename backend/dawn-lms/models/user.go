package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type User struct {
	ID                       uuid.UUID                 `gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
	CreatedAt                time.Time
	UpdatedAt                time.Time
	DeletedAt                gorm.DeletedAt 			   `gorm:"index"`
	FullName                 string                    `gorm:"not null"`
	Email                    string                    `gorm:"unique;not null"`
	Password                 string                    `json:"-" gorm:"not null"`
	Country                  *string                   // Changed to pointer to be nullable
	DateOfBirth              *time.Time                `gorm:"index"` // Already a pointer, which is correct
	Role                     string                    `gorm:"not null;default:'student'"`
	ProfilePicture           string                    `gorm:"default:'https://avatar.iran.liara.run/public/girl'"`
	
	// Profile relationships
	StudentProfile           *Student                  `gorm:"foreignKey:ProfileID"`
	TeacherProfile           *Teacher                  `gorm:"foreignKey:ProfileID"`
	LearningProfile          *LearningProfile          `gorm:"foreignKey:UserID"`
	AccessibilityPreferences *AccessibilityPreferences `gorm:"foreignKey:UserID"`
	DiagnosticResults        []DiagnosticResult        `gorm:"foreignKey:UserID"`
	ParentalConsents         []ParentalConsent         `gorm:"foreignKey:ChildUserID"`
}

// AccessibilityPreferences stores user-specific accessibility settings
type AccessibilityPreferences struct {
	gorm.Model
	UserID                uuid.UUID `gorm:"type:uuid;not null;index"`
	User                  User      `gorm:"foreignKey:UserID"`
	FontSize              int       `gorm:"default:16"`                    // Font size in pixels
	ContrastMode          string    `gorm:"default:'default'"`             // 'default', 'high', 'dark'
	EnableTextToSpeech    bool      `gorm:"default:false"`                 // Text-to-speech preference
	PrefersReducedMotion  bool      `gorm:"default:false"`                 // Reduced motion preference
	ColorBlindnessSupport string    `gorm:"default:'none'"`                // 'none', 'deuteranopia', 'protanopia', 'tritanopia'
	KeyboardNavigation    bool      `gorm:"default:true"`                  // Keyboard navigation preference
	ScreenReaderOptimized bool      `gorm:"default:false"`                 // Screen reader optimization
	FocusIndicatorStyle   string    `gorm:"default:'default'"`             // 'default', 'enhanced', 'high-contrast'
}
