const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const helper = require('./test_helper')
const User = require('../models/user')
const bcrypt = require('bcrypt')

let token = null

beforeEach(async () => {
  jest.setTimeout(10000)
  await User.deleteMany({})
  const passwordHash = await bcrypt.hash('testpassword', 10)
  const user = new User({
    username: 'testUser',
    name: 'Test User',
    passwordHash,
  })
  user.save()

  const response = await api.post('/api/login').send({
    username: 'testUser',
    password: 'testpassword',
  })
  token = `bearer ${response.body.token}`

  await Blog.deleteMany({})
  await api
    .post('/api/blogs')
    .set('Authorization', token)
    .send(helper.initialBlogs[0])
  await api
    .post('/api/blogs')
    .set('Authorization', token)
    .send(helper.initialBlogs[1])
})

describe('with blogs in a list', () => {
  test('the right number of blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
  test('blogs are identified with a field `id`', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body[0].id).toBeDefined()
  })
})

describe('adding blog', () => {
  test('increases the count of blogs by one', async () => {
    await api
      .post('/api/blogs')
      .set('Authorization', token)
      .send(helper.oneBlog)
      .expect(200)
      .expect('Content-type', /application\/json/)
    const blogsAtEnd = await helper.blogsInDB()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
  })
  test('added data is correct', async () => {
    await api
      .post('/api/blogs')
      .set('Authorization', token)
      .send(helper.oneBlog)
      .expect(200)
      .expect('Content-type', /application\/json/)
    const blogsAtEnd = await helper.blogsInDB()
    const titles = blogsAtEnd.map(blog => blog.title)
    expect(titles).toContain('Canonical string reduction')
  })
  test('if likes not defined, set it to 0', async () => {
    await api
      .post('/api/blogs')
      .set('Authorization', token)
      .send(helper.oneBlogUndefinedLikes)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    const blogsAtEnd = await helper.blogsInDB()
    const likes = blogsAtEnd.map(blog => blog.likes)
    expect(likes.at(-1)).toBe(0)
  })
  test('if title or url not defined, expect 400', async () => {
    await api
      .post('/api/blogs')
      .set('Authorization', token)
      .send(helper.oneBlogNoTitleOrUrl)
      .expect(400)
  })
})

describe('delete post', () => {
  test('works with existing post', async () => {
    const response = await api.get('/api/blogs')
    const idOfBlogToBeDeleted = response.body[1].id

    await api
      .delete(`/api/blogs/${idOfBlogToBeDeleted}`)
      .set('Authorization', token)
      .expect(204)
    const blogsAtEnd = await helper.blogsInDB()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)
  })
  test('gives 400 if id does not exist', async () => {
    await api
      .delete('/api/blogs/620b9d1531644e903c7824ac')
      .set('Authorization', token)
      .expect(400)
    const blogsAtEnd = await helper.blogsInDB()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })
})
describe('update blog', () => {
  test('with correct data', async () => {
    const blogs = await helper.blogsInDB()
    const idOfBlogBeingUpdated = blogs[0].id
    const updatedBlogData = {
      title: 'Hennan heppablogi4',
      author: 'Henna H.',
      url: 'hennanheppablogi4.fi',
      likes: 100,
    }
    await api
      .put(`/api/blogs/${idOfBlogBeingUpdated}`)
      .send(updatedBlogData)
      .expect(200)

    const blogsAtEnd = await helper.blogsInDB()
    const titles = blogsAtEnd.map(blog => blog.title)
    expect(titles).toContain('Hennan heppablogi4')
  })
  test('with title missing', async () => {
    const blogs = await helper.blogsInDB()
    const idOfBlogBeingUpdated = blogs[0].id
    const updatedBlogData = {
      author: 'Henna H.',
      url: 'hennanheppablogi4.fi',
      likes: 100,
    }
    await api
      .put(`/api/blogs/${idOfBlogBeingUpdated}`)
      .send(updatedBlogData)
      .expect(400)
    const blogsAtEnd = await helper.blogsInDB()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })
})

afterAll(() => {
  mongoose.connection.close()
})
