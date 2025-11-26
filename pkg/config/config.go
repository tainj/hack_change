package config

import (
	"hack_change/internal/auth"
	postgres "hack_change/pkg/db"

	"log"

	"github.com/caarlos0/env/v8"
	"github.com/joho/godotenv"
)

type Server struct {
    RestPort int   `env:"GRPC_REST_SERVER_PORT" env-default:"8080"`
}

type Config struct {
	Postgres postgres.Config
    JWT auth.Config
}

func LoadConfig() (*Config, error) {
    // загружаем .env файл
    if err := godotenv.Load(); err != nil {
        log.Println("No .env file found, using environment variables")
    }

    cfg := &Config{}
    
    if err := env.Parse(&cfg.Postgres); err != nil {
        return nil, err
    }

    if err := env.Parse(&cfg.JWT); err != nil {
        return nil, err
    }
    
    return cfg, nil
}