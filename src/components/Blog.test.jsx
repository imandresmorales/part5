import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import { expect } from 'vitest'

test('5.13 muestre el título y el autor del blog',  () => {
  const blog = {
    title: 'titulo',
    author: 'authorbyalex',
    url: 'alex.com',
  }

  render(<Blog blog={blog} user={blog.user} />)

  const titulo = screen.getByTestId('blog-view')
  expect(titulo).toHaveTextContent('titulo')
  expect(titulo).toHaveTextContent('authorbyalex')
  expect(titulo).not.toHaveTextContent('alex.com')
  expect(titulo).not.toHaveTextContent('0')

})