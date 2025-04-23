package handler

import (
	"strconv"

	"WishBridge/db"
	"WishBridge/model"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
)

type CommentRequest struct {
	Text string `json:"text"`
}

func CreateComment(c *fiber.Ctx) error {
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

	var req CommentRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid input"})
	}

	comment := model.Comment{
		UserID:  userID,
		PostID:  uint(postID),
		Text:    req.Text,
	}
	if err := db.DB.Create(&comment).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "failed to save comment"})
	}

	return c.JSON(fiber.Map{
		"message": "comment created",
		"comment": comment,
	})
}

func ListComments(c *fiber.Ctx) error {
	postID := c.Params("id")
	var comments []model.Comment
	db.DB.Where("post_id = ?", postID).Order("created_at asc").Find(&comments)
	return c.JSON(comments)
}