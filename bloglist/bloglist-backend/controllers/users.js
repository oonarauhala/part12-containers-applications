const bcrypt = require('bcrypt')
const { json } = require('express')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs')
  response.json(users)
})

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  const userExists = await User.findOne({ username })
  if (userExists) {
    return response.status(400).json({
      error: 'username already taken',
    })
  }
  if (!password) {
    return response.status(400).json({
      error: 'password missing',
    })
  }
  if (password.length < 3) {
    return response.status(400).json({
      error: 'password too short',
    })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username: username,
    name: name,
    passwordHash,
  })

  const savedUser = await user.save()
  response.json(savedUser)
})

module.exports = usersRouter
