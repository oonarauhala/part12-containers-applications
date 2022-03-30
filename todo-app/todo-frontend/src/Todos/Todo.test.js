import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Todo from './Todo'

test('renders content', () => {
  const todo = {
    text: 'Buy grapes',
    done: false
  }

  render(<Todo todo={todo} doneInfo={"Done"} notDoneInfo={"Not done"}/>)

  const element = screen.getByText('Buy grapes')
  expect(element).toBeDefined()
})