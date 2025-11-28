package handler

import (
	"net/http"

	"github.com/google/uuid"

	"hack_change/internal/dto"
	"hack_change/internal/models"
	"hack_change/internal/service"
	"hack_change/pkg/logger"

	"github.com/gin-gonic/gin"
)

// TeacherHandler содержит зависимости для действий, доступных учителю
type TeacherHandler struct {
	course service.CourseService
	logger logger.Logger
}

// NewTeacherHandler создаёт экземпляр handler'а для teacher-эндпоинтов
func NewTeacherHandler(courseService service.CourseService) *TeacherHandler {
	return &TeacherHandler{course: courseService, logger: logger.New("teacher-handler")}
}

// CreateCourse обрабатывает создание нового курса учителем
func (h *TeacherHandler) CreateCourse(c *gin.Context) {
	var req dto.CourseCreateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, dto.APIResponse{Error: &dto.APIError{Code: "invalid_request", Message: err.Error()}})
		return
	}

	ctx := c.Request.Context()
	teacherIDStr := c.GetString("userID") // предполагается, что middleware аутентификации установил userID в контекст
	if teacherIDStr == "" {
		c.JSON(http.StatusUnauthorized, dto.APIResponse{Error: &dto.APIError{Code: "unauthenticated", Message: "missing user id"}})
		return
	}

	teacherUUID, err := uuid.Parse(teacherIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, dto.APIResponse{Error: &dto.APIError{Code: "invalid_user_id", Message: "invalid user id format"}})
		return
	}

	// создаём модель курса — генерируем id на сервере
	course := &models.Course{
		ID:          uuid.New(),
		Title:       req.Title,
		Description: req.Description,
		TeacherID:   teacherUUID,
	}

	if err := h.course.CreateCourse(ctx, teacherIDStr, course); err != nil {
		c.JSON(http.StatusInternalServerError, dto.APIResponse{Error: &dto.APIError{Code: "internal_error", Message: err.Error()}})
		return
	}

	c.JSON(http.StatusCreated, dto.APIResponse{Data: dto.CourseToResponse(course)})
}

// Courses возвращает список курсов учителя
func (h *TeacherHandler) Courses(c *gin.Context) {
	ctx := c.Request.Context()
	teacherIDStr := c.GetString("userID")
	if teacherIDStr == "" {
		c.JSON(http.StatusUnauthorized, dto.APIResponse{Error: &dto.APIError{Code: "unauthenticated", Message: "missing user id"}})
		return
	}

	courses, err := h.course.ListCourses(ctx, teacherIDStr)
	if err != nil {
		h.logger.Error(ctx, "failed to list courses", "error", err.Error())
		c.JSON(http.StatusInternalServerError, dto.APIResponse{Error: &dto.APIError{Code: "courses_list_failed", Message: "failed to list courses"}})
		return
	}

	var resp []dto.CourseResponse
	for _, cs := range courses {
		resp = append(resp, dto.CourseToResponse(cs))
	}

	c.JSON(http.StatusOK, dto.APIResponse{Data: resp})
}
