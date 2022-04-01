import React from 'react'
import Blog from './Blog'

const BlogsList = ({ blogs, handleLike, removeBlog }) => (
  <div className="blogsList">
    {blogs.map(blog => (
      <Blog
        key={blog.id}
        blog={blog}
        handleLike={handleLike}
        removeBlog={removeBlog}
      />
    ))}
  </div>
)

export default BlogsList
