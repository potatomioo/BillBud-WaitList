package handlers

import (
	"context"
	"net/http"
	"net/mail"
	"strings"
	"time"

	"billbud-waitlist/backend/internal/models"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/mongo"
)

func AddToWaitlist(db *mongo.Database) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req struct {
			Email string `json:"email"`
		}

		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body."})
			return
		}

		email := strings.TrimSpace(req.Email)
		if email == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Email cannot be empty."})
			return
		}

		parsedAddr, err := mail.ParseAddress(email)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid email address."})
			return
		}
		cleanEmail := strings.ToLower(parsedAddr.Address)

		collection := db.Collection("Waitlist-Emails")

		entry := models.WaitlistEntry{
			Email:     cleanEmail,
			CreatedAt: time.Now(),
		}

		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()

		_, err = collection.InsertOne(ctx, entry)
		if err != nil {
			if mongo.IsDuplicateKeyError(err) {
				c.JSON(http.StatusConflict, gin.H{"error": "Email already registered."})
				return
			}
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error."})
			return
		}

		c.JSON(http.StatusCreated, gin.H{"message": "You've been added to the waitlist."})
	}
}
