package repository

import (
	"context"
	"fmt"
	"hack_change/internal/models"
	postgres "hack_change/pkg/db"
	"hack_change/pkg/logger"

	sq "github.com/Masterminds/squirrel"
)

type CourseTeacherRepository struct {
	db     *postgres.DB
	logger logger.Logger
}

func NewCourseTeacherRepository(db *postgres.DB) *CourseTeacherRepository {
	return &CourseTeacherRepository{db: db, logger: logger.New("repository")}
}

func (r *CourseTeacherRepository) CreateCourse(ctx context.Context, teacherID string, course *models.Course) error {
	// собираем запрос на вставку пользователя
	query := sq.Insert("courses").
		Columns("id", "teacher_id", "title", "description").
		Values(course.ID, course.TeacherID, course.Title, course.Description).
		PlaceholderFormat(sq.Dollar)

	// генерируем sql и аргументы
	sql, args, err := query.ToSql()
	if err != nil {
		return fmt.Errorf("failed to build query: %w", err)
	}

	// выполняем запрос
	_, err = r.db.Db.ExecContext(ctx, sql, args...)
	if err != nil {
		return fmt.Errorf("failed to insert course: %w", err)
	}

	r.logger.Debug(ctx, "the teacher's course has been successfully created", "courseId", course.ID)

	return nil
}

func (r *CourseTeacherRepository) ListCourses(ctx context.Context, teacherID string) ([]*models.Course, error) {
	// Build parameterized query using squirrel
	query := sq.Select("id", "title", "description", "teacher_id", "created_at", "updated_at").
		From("courses").
		Where(sq.Eq{"teacher_id": teacherID}).
		OrderBy("created_at DESC").
		PlaceholderFormat(sq.Dollar)

	sqlStr, args, err := query.ToSql()
	if err != nil {
		return nil, fmt.Errorf("failed to build query: %w", err)
	}

	rows, err := r.db.Db.QueryxContext(ctx, sqlStr, args...)
	if err != nil {
		return nil, fmt.Errorf("failed to query courses: %w", err)
	}
	defer rows.Close()

	var courses []*models.Course
	for rows.Next() {
		var c models.Course
		if err := rows.StructScan(&c); err != nil {
			r.logger.Warn(ctx, "scan course failed", "error", err.Error())
			continue
		}
		courses = append(courses, &c)
	}
	return courses, nil
}
