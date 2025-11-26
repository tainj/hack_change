package handler

import (
	"net/http"
	"hack_change/internal/model"
	"hack_change/internal/repository"
	"hack_change/pkg/jwt"
	"hack_change/pkg/logger"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type AuthHandler struct {
	db *gorm.DB
}

func NewAuthHandler(db *gorm.DB) *AuthHandler {
	return &AuthHandler{db: db}
}

func (h *AuthHandler) Register(c *gin.Context) {
	var input struct {
		Email    string `json:"email" binding:"required,email"`
		Password string `json:"password" binding:"required,min=6"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user := model.User{Email: input.Email, Password: input.Password} // лучше хэшируй пароль!
	repo := repository.NewUserRepo(h.db)
	if err := repo.Create(&user); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to register"})
		return
	}

	token, _ := jwt.GenerateToken(user)
	c.JSON(http.StatusOK, gin.H{"token": token})
}

func (h *AuthHandler) Login(c *gin.Context) {
	// аналогично: проверка по email + пароль → выдача токена
}