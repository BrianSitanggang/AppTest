package handler

import (
	"WishBridge/db"
	"WishBridge/model"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
)

type PostRequest struct {
	Title   string `json:"title"`
	Content string `json:"content"`
}

func CreatePost(c *fiber.Ctx) error {
	tokenStr := c.Get("Authorization")[len("Bearer "):] // 简单提取 token
	token, _ := jwt.Parse(tokenStr, func(token *jwt.Token) (interface{}, error) {
		return []byte("your_secret_key"), nil
	})
	claims := token.Claims.(jwt.MapClaims)
	userID := uint(claims["user_id"].(float64))

	var req PostRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid input"})
	}

	post := model.Post{
		UserID:  userID,
		Title:   req.Title,
		Content: req.Content,
	}
	if err := db.DB.Create(&post).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "failed to save post"})
	}

	return c.JSON(fiber.Map{
		"message": "post created",
		"post":    post,
	})
}

func ListPosts(c *fiber.Ctx) error {
	var posts []model.Post
	if err := db.DB.Preload("User").Preload("Comments").Preload("Votes").Order("created_at DESC").Find(&posts).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": err.Error()})
	}

	type PostResponse struct {
		model.Post
		MyVote int `json:"MyVote"`
	}

	var results []PostResponse
	var userID uint = 0

	// check login status
	if userToken := c.Locals("user"); userToken != nil {
		user := userToken.(*jwt.Token)
		claims := user.Claims.(jwt.MapClaims)
		userID = uint(claims["user_id"].(float64))
	}

	// construct response structure
	for _, p := range posts {
		myVote := 0
		if userID > 0 {
			for _, v := range p.Votes {
				if v.UserID == userID {
					myVote = v.Type
					break
				}
			}
		}
		results = append(results, PostResponse{
			Post:   p,
			MyVote: myVote,
		})
	}

	return c.JSON(results)
}
