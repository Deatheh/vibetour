package config

import (
	"log"

	"github.com/ilyakaznacheev/cleanenv"
)

type Config struct {
	DBUser     string `env:"POSTGRES_USER" env-default:"usr"`
	DBPassword string `env:"POSTGRES_PASSWORD" env-default:"pwd"`
	DBHost     string `env:"DB_HOST" env-default:"localhost"`
	DBPort     string `env:"DB_PORT" env-default:"5432"`
	DBName     string `env:"POSTGRES_DB" env-default:"vibetour"`
	AppPort    string `env:"PORT" env-default:"8080"`
	LogLevel   string `env:"LOG_LEVEL" env-default:"info"`
}

func NewConfig() *Config {
	var cfg Config

	err := cleanenv.ReadConfig(".env", &cfg)
	if err != nil {
		// Если файла .env нет, читаем только системные переменные окружения
		err = cleanenv.ReadEnv(&cfg)
		if err != nil {
			log.Fatalf("Error reading env config: %s", err)
		}
	}

	return &cfg
}
