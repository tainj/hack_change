package main

import (
	"context"
	"fmt"
	"hack_change/internal/handler"
	"hack_change/internal/service"
	"hack_change/pkg/config"
	postgres "hack_change/pkg/db"
	repo "hack_change/internal/repository"
	"hack_change/pkg/logger"
	"log"
	"os"

	"hack_change/internal/auth"

	"github.com/gin-gonic/gin"
)

func main() {
	// Инициализация логгера
	mainLogger := logger.New("hack_change")

	// Базовый контекст
    ctx := context.Background()

	r := gin.Default()

	// Загрузка конфигурации
	cfg, err := config.LoadConfig()
    if err != nil {
        mainLogger.Error(ctx, "error loading config", "error", err)
        os.Exit(1)
    }

	if cfg == nil {
		mainLogger.Error(ctx, "error loading config: config is nil")
		os.Exit(1)
	}

	// Инициализация базы данных
	db, err := postgres.New(cfg.Postgres)
    if err != nil {
        fmt.Println(err)
        mainLogger.Error(ctx, "failed to init postgres", "error", err)
        os.Exit(1)
    }

	// Инициализация JWT сервиса
	jwtService := auth.NewJWTService(cfg.JWT)

	// Инициализация сервисов
	service := service.NewService(
		repo.NewAuthUserRepository(db),
		jwtService,
	)

	// Публичные роуты (без JWT)
	authHandler := handler.NewAuthHandler(service)
	r.POST("/login", authHandler.Login)
	r.POST("/register", authHandler.Register)

	// // Защищённые роуты
	// protected := r.Group("/api")
	// protected.Use(middleware.AuthMiddleware(jwtService))
	// {
	// 	courseHandler := handler.NewCourseHandler(db)
	// 	protected.GET("/courses", courseHandler.List)
	// 	protected.POST("/courses", courseHandler.Create)
	// }

	log.Println("Server started on :8080")
	r.Run(":8080")
}