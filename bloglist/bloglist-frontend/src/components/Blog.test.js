import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
  const blog = {
    title: 'Testiblogi',
    author: 'Testaaja',
    url: 'testiblogi.com',
    likes: 20,
    user: {
      username: 'testaaja1',
      name: 'T. Testaaja',
    },
  }
  const mockHandleLike = jest.fn()
  const mockRemoveBlog = jest.fn()

  beforeEach(() => {
    render(
      <Blog
        blog={blog}
        handleLike={mockHandleLike}
        removeBlog={mockRemoveBlog}
      />
    )
  })

  test('renders blog in small', () => {
    const title = screen.findByText('Testiblogi')
    const likeButton = screen.queryByText('like')
    expect(title).toBeDefined()
    expect(likeButton).toBeNull()
  })

  test('renders blog in big when opened', () => {
    const button = screen.getByText('view')
    userEvent.click(button)

    const title = screen.findByText('Testiblogi')
    const url = screen.getByText('testiblogi.com')
    const likes = screen.getByText('20')
    expect(title).toBeDefined()
    expect(url).toBeDefined()
    expect(likes).toBeDefined()
  })

  test('like button yields function call', () => {
    const viewButton = screen.getByText('view')
    userEvent.click(viewButton)

    const likeButton = screen.getByText('like')
    userEvent.click(likeButton)
    userEvent.click(likeButton)

    expect(mockHandleLike.mock.calls).toHaveLength(2)
  })
})
