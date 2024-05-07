import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 
  const [user, setUser] = useState(null)
  const [title, setTitle] = useState ('')
  const [author, setAuthor] = useState ('')
  const [url, setUrl] = useState ('')
  
  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      ) 
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      console.log("error username or password")
    }
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
          <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
          <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>      
  )
  const handleLogout = () => {
    window.localStorage.clear()
    setUser(null)
  }

  const handleCreate = () => {
    blogService.setToken(user.token)
    blogService.create({title:title, author:author, url:url})
  }

  const blogForm = () => (
    <div>
      <h2>blogs</h2>
      <p>{user.name} logged in </p>
      <button onClick={handleLogout}>logout</button>
      <h2>Create new</h2>
      <div>
        title:<input
            type="text"
            value={title}
            name="title"
            onChange={({ target }) => setTitle(target.value)}
        />
      </div>
      <div>
        author:<input
            type="text"
            value={author}
            name="author"
            onChange={({ target }) => setAuthor(target.value)}
        />
      </div>
      <div>
        url:<input
            type="text"
            value={url}
            name="url"
            onChange={({ target }) => setUrl(target.value)}
        />
      </div>
      <button onClick={handleCreate}>create</button>

      {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )

  return (
    <div>
      {user === null 
        ?loginForm() 
        :blogForm()}
      
    </div>
  )
}

export default App