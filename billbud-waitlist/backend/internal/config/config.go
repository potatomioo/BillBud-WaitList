package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	MongoURI   string
	MongoDB    string
	Port       string
	CorsOrigin string
}

func LoadConfig() Config {
	err := godotenv.Load()
	if err != nil {
		log.Println("No .env file found. Using default environment variables.")
	}

	mongoURI := os.Getenv("MONGO_URI")
	if mongoURI == "" {
		mongoURI = "mongodb://localhost:27017"
	}

	mongoDB := os.Getenv("MONGO_DB")
	if mongoDB == "" {
		mongoDB = "billbud"
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	corsOrigin := os.Getenv("CORS_ORIGIN")
	if corsOrigin == "" {
		corsOrigin = "http://localhost:5173" // fallback for local dev
	}

	return Config{
		MongoURI:   mongoURI,
		MongoDB:    mongoDB,
		Port:       port,
		CorsOrigin: corsOrigin,
	}
}
