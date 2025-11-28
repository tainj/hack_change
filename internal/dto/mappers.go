package dto

import (
	"hack_change/internal/models"
)

func UserToResponse(u *models.User) UserResponse {
	var id string
	if u != nil {
		id = u.ID.String()
	}
	return UserResponse{
		ID:          id,
		Email:       u.Email,
		FirstName:   u.FirstName,
		LastName:    u.LastName,
		MiddleName:  u.MiddleName,
		Role:      string(u.Role),
		CreatedAt: u.CreatedAt,
	}
}

func CourseToResponse(c *models.Course) CourseResponse {
	var id, teacher string
	if c != nil {
		id = c.ID.String()
		teacher = c.TeacherID.String()
	}
	return CourseResponse{
		ID:          id,
		Title:       c.Title,
		Description: c.Description,
		TeacherID:   teacher,
		CreatedAt:   c.CreatedAt,
	}
}

func AssignmentToResponse(a *models.Assignment) AssignmentResponse {
	var id, course string
	if a != nil {
		id = a.ID.String()
		course = a.CourseID.String()
	}
	return AssignmentResponse{
		ID:          id,
		CourseID:    course,
		Title:       a.Title,
		Description: a.Description,
		DueAt:       a.DueAt,
		MaxScore:    a.MaxScore,
	}
}

func SubmissionToResponse(s *models.Submission) SubmissionResponse {
	var id, assignment, student string
	if s != nil {
		id = s.ID.String()
		assignment = s.AssignmentID.String()
		student = s.StudentID.String()
	}
	return SubmissionResponse{
		ID:           id,
		AssignmentID: assignment,
		StudentID:    student,
		Content:      s.Content,
		SubmittedAt:  s.SubmittedAt,
		Score:        s.Score,
		GradedAt:     s.GradedAt,
		Feedback:     s.Feedback,
	}
}
