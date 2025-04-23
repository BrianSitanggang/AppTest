// main.go
package main

import (
	"log"
	"WishBridge/db"
	"WishBridge/handler"
	"WishBridge/middleware"

  	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2"
)

func main() {
	db.InitDB()

	r := fiber.New()
	r.Use(cors.New())
	
	r.Post("/api/register", handler.Register)
	r.Post("/api/login", handler.Login)
	r.Get("/api/posts", handler.ListPosts) // public interface for unauthorised user

	api := r.Group("/api", middleware.JWTMiddleware)
	api.Get("/profile", handler.Profile)
	api.Post("/posts", handler.CreatePost)
	api.Get("/posts", handler.ListPosts)
	api.Post("/posts/:id/comments", handler.CreateComment)
	api.Get("/posts/:id/comments", handler.ListComments)
	api.Post("/posts/:id/vote", handler.CreateVote)
	
	log.Fatal(r.Listen(":3000"))
}