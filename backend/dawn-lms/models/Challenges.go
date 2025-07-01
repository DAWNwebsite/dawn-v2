package models

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Challenges struct {
	gorm.Model
	ID          uuid.UUID
	Name        string
	Description string
	Students    []Student `gorm:"many2many:student_challenges"`
}
