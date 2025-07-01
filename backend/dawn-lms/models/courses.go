package models

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Course struct {
	gorm.Model
	ID          uuid.UUID
	Title       string
	Description string
	CoverImage  string
	Students    []Student `gorm:"many2many:student_courses"`
	TeacherS    []Teacher `gorm:"many2many:teacher_courses"`
}

type Teacher struct {
	gorm.Model
	ID        uuid.UUID
	Profile   User `gorm:"foreignKey:ProfileID"`
	ProfileID uuid.UUID
	Courses   []Course `gorm:"many2many:teacher_courses"`
}

type Student struct {
	gorm.Model
	ID          uuid.UUID
	Profile     User `gorm:"foreignKey:ProfileID"`
	ProfileID   uuid.UUID
	Preferences []Preference `gorm:"many2many:student_preferences"`
	Courses     []Course     `gorm:"many2many:student_courses"`
	Challenges  []Challenges `gorm:"many2many:student_challenges"`
	Products    []Product    `gorm:"many2many:student_products"`
}

type Preference struct {
	gorm.Model
	ID          uuid.UUID
	Name        string
	Description string
	Student     []Student `gorm:"many2many:student_preferences"`
}
