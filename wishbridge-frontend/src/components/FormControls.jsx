// components/FormControls.jsx
import React, { useState, useEffect } from 'react'
import axios from '../api'

export function TextareaField({ className = '', ...props }) {
  return <textarea className={`border p-2 w-full rounded min-h-[6rem] ${className}`} {...props} /> 
}

export function Button({ children, className = '', ...props }) {
  return (
    <button
      className={`bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 mx-auto block mt-4 ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export function InputField({ className = '', ...props }) {
  return <input className={`border p-2 w-full rounded ${className}`} {...props} />
}

export function PageContainer({ title, children }) {
  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-semibold mb-6 text-center">{title}</h2>
      {children}
    </div>
  )
}

export function PostList({ posts, onSelect, onCreateToggle, showCreate, selectedPost }) {
  const [page, setPage] = useState(1)
  const postsPerPage = 40
  const pageCount = Math.ceil(posts.length / postsPerPage)
  const paginatedPosts = posts.slice((page - 1) * postsPerPage, page * postsPerPage)

  return (
    <div className={`${(showCreate || selectedPost) ? 'lg:w-1/3' : 'w-full'} border-r overflow-y-scroll p-4 max-h-[calc(2.5rem*40+6rem)] border bg-white rounded-l`}>
      <button
        onClick={onCreateToggle}
        className="mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-fit"
      >
        {showCreate ? 'Hide Post Form' : 'New Post'}
      </button>

      {paginatedPosts.map(post => (
        <div
          key={post.ID}
          onClick={() => onSelect(post)}
          className="cursor-pointer p-2 border-b hover:bg-gray-50"
        >
          <div className="font-semibold truncate">{post.Title}</div>
        </div>
      ))}

      {pageCount > 1 && (
        <div className="flex justify-center mt-4 gap-2">
          {Array.from({ length: pageCount }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setPage(i + 1)}
              className={`px-2 py-1 rounded text-sm ${page === i + 1 ? 'bg-blue-600 text-white' : 'bg-white text-blue-600'}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export function CreatePost({ onPostCreated }) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  const handleCreatePost = async () => {
    await axios.post('/posts', { title, content })
    setTitle('')
    setContent('')
    onPostCreated?.()
    setShowCreatePost(false)
    setSelectedPost(null)
  }

  return (
    <div className="lg:w-2/3 w-full bg-white p-4 rounded shadow">
      <h3 className="text-lg font-semibold mb-2">Create Post</h3>
      <InputField
        placeholder="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        className="mb-2"
      />
      <TextareaField className="mb-2" placeholder="Content"
        value={content}
        onChange={e => setContent(e.target.value)}
      />
      <Button onClick={handleCreatePost}>Post</Button>
    </div>
  )
}

export function CommentBox({ postId, onCommented }) {
  const [text, setText] = useState('')

  const handleSubmit = async () => {
    if (!text.trim()) return
    await axios.post(`/posts/${postId}/comments`, { text })
    setText('')
    onCommented?.()
  }

  return (
    <div className="mt-4">
      <TextareaField className="mb-2" placeholder="Write a comment..."
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <Button onClick={handleSubmit}>Submit</Button>
    </div>
  )
}

export function CommentList({ comments, usernames }) {
    if (comments.length === 0) return <p className="text-sm text-gray-500">No comments yet.</p>
  
    return (
        <div className="mt-4 space-y-2">
        {comments.map(c => (
          <div key={c.ID} className="border-t p-2 rounded bg-gray-50">
            <p className="text-xs text-gray-500 italic mb-1">Comment by <span className="font-medium text-gray-700">{usernames[c.UserID] || '...'}</span></p>
            <p className="text-sm text-gray-700">{c.Text}</p>
          </div>
        ))}
      </div>
    )
  }