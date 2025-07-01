package models

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Product struct {
	gorm.Model
	ID          uuid.UUID
	Name        string
	Description string
	CoverImage  string
	Students    []Student `gorm:"many2many:student_products"`
}
