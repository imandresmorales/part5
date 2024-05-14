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
  const [errorMessage, setErrorMessage] = useState(null)
  const [notification, setNotification] = useState(null)
  const [blogVisible, setBlogVisible] = useState(false)


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

  const Notification = ({message}) => {
    if(message ===null )
      return null
    const css =  {
      color: 'green',
      background: 'lightgrey',
      fontSize: 20,
      borderStyle: 'solid',
      borderRadius: 5,
      padding: 10,
      marginBottom: 10
    }
    
    return(
      <div style={css}>
        <p>{message}</p>
      </div>
    )
  }

  const ErrorMessage = ({message}) => {
    if(message ===null )
      return null
    const css =  {
      color: 'red',
      background: 'lightgrey',
      fontSize: 20,
      borderStyle: 'solid',
      borderRadius: 5,
      padding: 10,
      marginBottom: 10
    }
    return(
      <div style={css}>
        <p>{message}</p>
      </div>
    )
}

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
      setErrorMessage('wrong username or password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 3000);
      
    }
  }

  const loginForm = () => {
    return (
    <>
    <ErrorMessage message={errorMessage}/>
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
    </> 
  )
  }
    
  const handleLogout = () => {
    window.localStorage.clear()
    setUser(null)
  }

  const handleCreate = (event) => {
    event.preventDefault()
    try{
        blogService.setToken(user.token)
        const newBlog = blogService.create({title:title, author:author, url:url})
        .then(returnedBlog => {
          setBlogs(blogs.concat(returnedBlog))
          setAuthor('')
          setTitle('')
          setUrl('')
          setBlogVisible(!blogVisible)
          setNotification(`a new blog ${title} by ${author} added`)
          setTimeout(() => {
            setNotification(null)
          }, 3000);
        })
    }
    catch(error){
      console.log("error")
      setNotification(`error`)
          setTimeout(() => {
            setNotification(null)
          }, 3000);
    }
  }

  const handleNewBlog = () => {
    setBlogVisible(!blogVisible)
  }

  const newBlogForm = () => {
    return(
      <>
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
        <button onClick={handleNewBlog}>cancel</button>
      </>
    )
  }

  const blogForm = () => {
    return (
      <>
      <div>
        <h2>blogs</h2>
        <Notification message={notification}/>
        <span>{user.name} logged in </span>
        <button onClick={handleLogout}>logout</button>
        <div>
          {blogVisible == true ?
          newBlogForm():
          <button onClick={handleNewBlog}>new note</button>}
        </div>

        {blogs.map(blog =>
            <Blog key={blog.id} blog={blog} />
        )}
      </div>
      </>
    )
  }

  return (
    <div>
      {user === null ?
      loginForm() :
      blogForm()
      }
    </div>
  )
}

export default App