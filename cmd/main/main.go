package main

import (
	"context"
	"fmt"
	"hack_change/internal/handler"
	"hack_change/internal/middleware"
	"hack_change/pkg/config"
	postgres "hack_change/pkg/db"
	"hack_change/pkg/logger"
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"hack_change/internal/auth"
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

	// Публичные роуты (без JWT)
	authHandler := handler.NewAuthHandler(db)
	r.POST("/login", authHandler.Login)
	r.POST("/register", authHandler.Register)

	// Защищённые роуты
	protected := r.Group("/api")
	protected.Use(middleware.AuthMiddleware(jwtService))
	{
		courseHandler := handler.NewCourseHandler(db)
		protected.GET("/courses", courseHandler.List)
		protected.POST("/courses", courseHandler.Create)
	}

	log.Println("Server started on :8080")
	r.Run(":8080")
}