import React from 'react'
import { useState } from 'react'
import blogService from '../services/blogs'

const NewBlogForm = ({ reloadBlogs, handleNotification, handleError }) => {
  const [blogName, setBlogName] = useState('')
  const [blogAuthor, setBlogAuthor] = useState('')
  const [blogUrl, setBlogUrl] = useState('')

  const handleNewBlogSubmit = async event => {
    event.preventDefault()
    try {
      const newBlog = {
        title: blogName,
        author: blogAuthor,
        url: blogUrl,
      }
      await blogService.create(newBlog)
      setBlogName('')
      setBlogAuthor('')
      setBlogUrl('')
      reloadBlogs()
      handleNotification(
        `New blog ${newBlog.title} by ${newBlog.author} added!`
      )
    } catch {
      handleError('Missing blog data')
    }
  }

  return (
    <div>
      <h2>create new</h2>
      <p></p>
      <form onSubmit={handleNewBlogSubmit}>
        <div>
          title:
          <input
            value={blogName}
            id="blogTitle"
            onChange={({ target }) => setBlogName(target.value)}
          />
        </div>
        <div>
          author:
          <input
            value={blogAuthor}
            id="blogAuthor"
            onChange={({ target }) => setBlogAuthor(target.value)}
          />
        </div>
        <div>
          url:
          <input
            value={blogUrl}
            id="blogUrl"
            onChange={({ target }) => setBlogUrl(target.value)}
          />
        </div>
        <button id="create-button" type="submit">
          create
        </button>
      </form>
    </div>
  )
}

export default NewBlogForm
