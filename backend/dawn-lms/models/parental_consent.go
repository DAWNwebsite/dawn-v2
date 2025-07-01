package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// ParentalConsent manages COPPA compliance for users under 13
type ParentalConsent struct {
	gorm.Model
	ChildUserID     uuid.UUID  `gorm:"type:uuid;not null;index"`
	ChildUser       User       `gorm:"foreignKey:ChildUserID"`
	
	// Parent/Guardian information
	ParentEmail     string     `gorm:"not null"`              // Parent/guardian email address
	ParentName      string     `gorm:"not null"`              // Parent/guardian full name
	Relationship    string     `gorm:"not null"`              // 'parent', 'guardian', 'other'
	
	// Consent status and tracking
	ConsentStatus   string     `gorm:"not null;default:'pending'"` // 'pending', 'granted', 'revoked', 'expired'
	RequestDate     time.Time  `gorm:"not null;index"`        // When consent was first requested
	ConsentDate     *time.Time `gorm:"index"`                 // When consent was granted
	RevokedDate     *time.Time `gorm:"index"`                 // When consent was revoked (if applicable)
	ExpiryDate      *time.Time `gorm:"index"`                 // When consent expires (if applicable)
	
	// Verification and tracking
	VerificationToken string   `gorm:"uniqueIndex"`           // Unique token for email verification
	VerificationMethod string  `gorm:"default:'email'"`       // 'email', 'postal', 'phone', 'in_person'
	IPAddress         string   `gorm:"index"`                 // IP address when consent was given
	UserAgent         string   `gorm:"type:text"`             // Browser/device info when consent was given
	
	// Consent details
	ConsentVersion    string   `gorm:"not null;default:'1.0'"` // Version of consent terms
	DataUsageConsent  bool     `gorm:"default:false"`         // Consent for educational data collection
	CommunicationConsent bool  `gorm:"default:false"`         // Consent for communication with child
	ThirdPartyConsent bool     `gorm:"default:false"`         // Consent for third-party integrations
	
	// Audit trail
	ConsentText       string   `gorm:"type:text"`             // Full text of consent given
	ConsentSource     string   `gorm:"default:'web'"`         // 'web', 'mobile', 'paper', 'phone'
	LastModified      time.Time `gorm:"autoUpdateTime"`       // Last modification timestamp
	
	// Additional notes and context
	Notes             string   `gorm:"type:text"`             // Additional notes about the consent process
	SpecialCircumstances string `gorm:"type:text"`           // Any special circumstances or requirements
}

// IsValid checks if the parental consent is currently valid
func (pc *ParentalConsent) IsValid() bool {
	if pc.ConsentStatus != "granted" {
		return false
	}
	
	// Check if consent has expired
	if pc.ExpiryDate != nil && time.Now().After(*pc.ExpiryDate) {
		return false
	}
	
	return true
}

// IsExpiringSoon checks if consent will expire within the specified number of days
func (pc *ParentalConsent) IsExpiringSoon(days int) bool {
	if pc.ExpiryDate == nil {
		return false
	}
	
	warningDate := time.Now().AddDate(0, 0, days)
	return pc.ExpiryDate.Before(warningDate)
}

// GetAge calculates the current age of the child user
func (pc *ParentalConsent) GetAge() int {
	if pc.ChildUser.DateOfBirth == nil {
		return 0
	}
	
	now := time.Now()
	age := now.Year() - pc.ChildUser.DateOfBirth.Year()
	
	// Adjust if birthday hasn't occurred this year
	if now.YearDay() < pc.ChildUser.DateOfBirth.YearDay() {
		age--
	}
	
	return age
}

// RequiresConsent determines if a user requires parental consent based on age
func RequiresConsent(dateOfBirth *time.Time) bool {
	if dateOfBirth == nil {
		return false
	}
	
	now := time.Now()
	age := now.Year() - dateOfBirth.Year()
	
	// Adjust if birthday hasn't occurred this year
	if now.YearDay() < dateOfBirth.YearDay() {
		age--
	}
	
	return age < 13
} 