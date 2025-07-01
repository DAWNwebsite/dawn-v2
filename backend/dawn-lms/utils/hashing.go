package utils

import "golang.org/x/crypto/bcrypt"

func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	if err != nil {
		return "", err
	}
	return string(bytes), err
}

func ComparePassword(password, hashedPawword string) (bool, error) {
	err := bcrypt.CompareHashAndPassword([]byte(hashedPawword), []byte(password))
	if err != nil {
		return false, err
	}
	return true, err
}
