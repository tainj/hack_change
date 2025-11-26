package models

import "time"

// Role перечисляет доступные роли пользователя
type Role string

const (
	RoleStudent Role = "student"
	RoleTeacher Role = "teacher"
	RoleAdmin   Role = "admin"
)

// User представляет пользователя системы (студент, преподаватель, админ)
type User struct {
	ID           int64     `db:"id" json:"id"`
	Email        string    `db:"email" json:"email"`
	PasswordHash string    `db:"password_hash" json:"-"`
	Name         string    `db:"name" json:"name"`
	Role         Role      `db:"role" json:"role"`
	CreatedAt    time.Time `db:"created_at" json:"created_at"`
	UpdatedAt    time.Time `db:"updated_at" json:"updated_at"`
}

// IsStudent возвращает true, если пользователь — студент
func (u *User) IsStudent() bool { return u != nil && u.Role == RoleStudent }

// IsTeacher возвращает true, если пользователь — преподаватель
func (u *User) IsTeacher() bool { return u != nil && u.Role == RoleTeacher }

// IsAdmin возвращает true, если пользователь — админ
func (u *User) IsAdmin() bool { return u != nil && u.Role == RoleAdmin }
