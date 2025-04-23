package db

import (
	"log"
	"github.com/glebarez/sqlite"
	"gorm.io/gorm"
	"WishBridge/model"
)

var DB *gorm.DB

func InitDB() {
	db, err := gorm.Open(sqlite.Open("WishBridge.db"), &gorm.Config{})
	if err != nil {
		log.Fatal("failed to connect database", err)
	}
/* 	db.Migrator().DropTable(
		&model.Vote{},
		&model.Comment{},
		&model.Post{},
		&model.User{},
	) */
	if err = db.AutoMigrate(&model.User{}, &model.Post{}, &model.Comment{}, &model.Vote{}); err != nil {
		log.Fatalf("migration failed: %v", err)
	}
	DB = db
}