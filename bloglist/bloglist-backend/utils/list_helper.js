const lodash = require('lodash')

const dummy = blogs => {
  return 1
}

const totalLikes = blogs => {
  let total = 0
  blogs.forEach(blog => {
    total = total + blog.likes
  })
  return total
}

const favouriteBlog = blogs => {
  let blogWithMostLikes = {}
  let mostLikes = 0
  blogs.forEach(blog => {
    if (blog.likes > mostLikes) {
      mostLikes = blog.likes
      blogWithMostLikes = blog
    }
  })
  return blogWithMostLikes
}

const mostBlogs = blogs => {
  let authorWithMostBlogs = {}
  let numberOfBlogs = 0

  if (blogs.length === 0) {
    return authorWithMostBlogs
  }
  const allAuthors = lodash.countBy(blogs, 'author')
  for (let author in allAuthors) {
    if (allAuthors[author] > numberOfBlogs) {
      authorWithMostBlogs = author
      numberOfBlogs = allAuthors[author]
    }
  }
  return {
    author: authorWithMostBlogs,
    blogs: numberOfBlogs,
  }
}

const mostLikes = blogs => {
  if (blogs.length === 0) {
    return {}
  }

  const allAuthors = lodash.groupBy(blogs, 'author')

  let authorWithMostLikes = ''
  let numberOfLikes = 0

  // key: author, value: blogs by author
  lodash.forEach(allAuthors, (value, key) => {
    if (totalLikes(value) > numberOfLikes) {
      authorWithMostLikes = key
      numberOfLikes = totalLikes(value)
    }
  })

  return {
    author: authorWithMostLikes,
    likes: numberOfLikes,
  }
}

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
  mostBlogs,
  mostLikes,
}
