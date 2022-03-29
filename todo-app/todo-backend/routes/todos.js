const express = require('express')
const { Todo } = require('../mongo')
const router = express.Router()
const { getAsync, setAsync } = require('../redis')

const counter = async () => {
  const count = await getAsync('count')
  // if not null, increase counter : initialize database
  return count ? setAsync('count', parseInt(count) + 1) : setAsync('count', 1)
}

/* GET todos listing. */
router.get('/', async (_, res) => {
  const todos = await Todo.find({})
  res.send(todos);
});

/* GET statistics from Redis db */
router.get('/statistics', async (_, res) => {
  console.log('getting...')
  const count = await getAsync('count')
  return res.json({
    'added_todos': parseInt(count) || 0
  })
})

/* POST todo to listing. */
router.post('/', async (req, res) => {
  counter()
  const todo = await Todo.create({
    text: req.body.text,
    done: false
  })
  res.send(todo);
});

const singleRouter = express.Router();

const findByIdMiddleware = async (req, res, next) => {
  const { id } = req.params
  req.todo = await Todo.findById(id)
  if (!req.todo) return res.sendStatus(404)

  next()
}

/* DELETE todo. */
singleRouter.delete('/', async (req, res) => {
  await req.todo.delete()  
  res.sendStatus(200);
});

/* GET todo. */
singleRouter.get('/', async (req, res) => {
  res.send(req.todo)
});

/* PUT todo. */
singleRouter.put('/', async (req, res) => {
  const body = req.body

  const todo = {
    text: body.text,
    done: body.done
  }
  const result = await Todo.findByIdAndUpdate(req.todo.id, todo, { new: true })
  if (result) {
    res.sendStatus(200);
  } else {
    res.sendStatus(400)
  }
  
});

router.use('/:id', findByIdMiddleware, singleRouter)


module.exports = router;
