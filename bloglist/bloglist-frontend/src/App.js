import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import {
  createNotification,
  resetNotification,
} from './reducers/notificationReducer'
import { createError, resetError } from './reducers/errorReducer'
import { useDispatch, useSelector } from 'react-redux'
import Error from './components/Error'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import userService from './services/users'
import LoginForm from './components/LoginForm'
import BlogContent from './components/BlogContent'
import './index.css'
import Users from './components/Users'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [newBlog, setNewBlog] = useState(false)
  const dispatch = useDispatch()
  const notification = useSelector(state => state.notification)
  const error = useSelector(state => state.error)
  const [users, setUsers] = useState([])

  useEffect(() => {
    loadBlogs()
    loadUsers()
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  //reload after adding blog
  useEffect(() => {
    loadBlogs()
    setNewBlog(false)
  }, [newBlog])

  const reloadBlogs = () => {
    setNewBlog(true)
  }

  const handleError = message => {
    dispatch(createError(message))
    setTimeout(() => {
      dispatch(resetError())
    }, 5000)
  }

  const handleNotification = message => {
    dispatch(createNotification(message))
    setTimeout(() => {
      dispatch(resetNotification())
    }, 5000)
  }

  const handleLogin = async event => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username,
        password,
      })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      handleError('Wrong username or password')
      setUsername('')
      setPassword('')
    }
  }

  const handleLogout = () => {
    window.localStorage.clear()
    setUser(null)
  }

  const handleLike = blog => {
    blogService.like(blog).then(() => {
      loadBlogs()
    })
  }

  const loadBlogs = () => {
    blogService.getAll().then(blogs => {
      setBlogs(
        blogs.sort((first, second) => (first.likes > second.likes ? -1 : 1))
      )
    })
  }

  const loadUsers = () => {
    userService.getAllUsers().then(users => {
      setUsers(users)
    })
  }

  const removeBlog = async blog => {
    if (window.confirm(`Remove ${blog.title}?`)) {
      await blogService.remove(blog)
      loadBlogs()
    }
  }

  return (
    <div>
      {user === null ? (
        <div>
          <Error message={error} />
          <Notification message={notification} />
          <p>log in</p>
          <LoginForm
            handleLogin={handleLogin}
            username={username}
            setUsername={setUsername}
            password={password}
            setPassword={setPassword}
          />
        </div>
      ) : (
        <div>
          <h2>blogs</h2>
          <Error message={error} />
          <Notification message={notification} />
          <p>{user.name} logged in</p>
          <button onClick={handleLogout}>Logout</button>
          <p></p>
          <Router>
            <Routes>
              <Route
                path="/"
                element={
                  <BlogContent
                    reloadBlogs={reloadBlogs}
                    handleNotification={handleNotification}
                    handleError={handleError}
                    blogs={blogs}
                    handleLike={handleLike}
                    removeBlog={removeBlog}
                  />
                }
              />
              <Route path='/users' element={<Users users={users}/>} />
            </Routes>
          </Router>
        </div>
      )}
    </div>
  )
}

export default App
