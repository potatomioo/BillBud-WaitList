package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type WaitlistEntry struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	Email     string             `bson:"email" json:"email"`
	CreatedAt time.Time          `bson:"created_at" json:"created_at"`
}
