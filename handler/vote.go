package handler

import (
	"strconv"

	"WishBridge/db"
	"WishBridge/model"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
)

type VoteRequest struct {
	Type int `json:"type"` // 1 = upvote, -1 = downvote
}

func CreateVote(c *fiber.Ctx) error {
	tokenStr := c.Get("Authorization")[len("Bearer "):] // 获取 token
	token, _ := jwt.Parse(tokenStr, func(token *jwt.Token) (interface{}, error) {
		return []byte("your_secret_key"), nil
	})
	claims := token.Claims.(jwt.MapClaims)
	userID := uint(claims["user_id"].(float64))

	postID, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid post id"})
	}

	var req VoteRequest
	if err := c.BodyParser(&req); err != nil || (req.Type != 1 && req.Type != -1) {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid vote type"})
	}

	var vote model.Vote
	db.DB.Where("user_id = ? AND post_id = ?", userID, postID).First(&vote)
	if vote.ID != 0 {
		vote.Type = req.Type
		db.DB.Save(&vote)
	} else {
		vote = model.Vote{UserID: userID, PostID: uint(postID), Type: req.Type}
		db.DB.Create(&vote)
	}

	return c.JSON(fiber.Map{"message": "vote recorded"})
}
