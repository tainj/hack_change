package models

import "time"

// Submission представляет отправку задания студентом (и/или её оценку)
type Submission struct {
	ID           int64      `db:"id" json:"id"`
	AssignmentID int64      `db:"assignment_id" json:"assignment_id"`
	StudentID    int64      `db:"student_id" json:"student_id"`
	Content      string     `db:"content" json:"content"`
	SubmittedAt  time.Time  `db:"submitted_at" json:"submitted_at"`
	Score        *float64   `db:"score" json:"score,omitempty"`
	GradedAt     *time.Time `db:"graded_at" json:"graded_at,omitempty"`
	Feedback     *string    `db:"feedback" json:"feedback,omitempty"`
}
