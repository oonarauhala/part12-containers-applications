import React from 'react'
import Togglable from './Togglable'
import NewBlogForm from './NewBlogForm'
import BlogsList from './BlogsList'

const BlogContent = ({
  reloadBlogs,
  handleNotification,
  handleError,
  blogs,
  handleLike,
  removeBlog,
}) => (
  <div>
    <Togglable buttonLabel="New blog">
      <NewBlogForm
        reloadBlogs={reloadBlogs}
        handleNotification={handleNotification}
        handleError={handleError}
      />
    </Togglable>
    <p></p>
    <BlogsList blogs={blogs} handleLike={handleLike} removeBlog={removeBlog} />
  </div>
)

export default BlogContent
