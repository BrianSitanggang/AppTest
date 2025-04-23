package model

import "gorm.io/gorm"

type User struct {
	gorm.Model
	Username string `gorm:"uniqueIndex;not null"`
	Password string `gorm:"not null"`
	Posts    []Post
	Comments []Comment
	Votes    []Vote
  }
  
  type Post struct {
	gorm.Model
	Title    string
	Content  string
	UserID   uint
	User     User `gorm:"foreignKey:UserID"`
	Comments []Comment
	Votes    []Vote
  }
  
  type Comment struct {
	gorm.Model
	UserID uint
	User   User `gorm:"foreignKey:UserID"`
	PostID uint
	Post   Post `gorm:"foreignKey:PostID"`
	Text   string `gorm:"not null"`
  }
  
  type Vote struct {
	gorm.Model
	UserID uint `gorm:"index"`
	User   User `gorm:"foreignKey:UserID"`
	PostID uint `gorm:"index"`
	Post   Post `gorm:"foreignKey:PostID"`
	Type   int  // 1 = upvote, -1 = downvote
  }
  
  type PostResponse struct {
	Post
	MyVote int `json:"MyVote"`
  }
  