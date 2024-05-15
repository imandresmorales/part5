import { useState } from "react"
import blogService from '../services/blogs'

const Blog = ({ blog, user, setBlogs,blogs }) => {
  const [details, setDetails] = useState(false)

  const handleDetails = () => {
    setDetails(!details)
  }

  const handleLike = () => {
    blogService.setToken(user.token)
    const object = {
      user: blog.user.id,
      title: blog.title,
      likes: blog.likes +1,
      author: blog.author,
      url: blog.url,
      id: blog.id
    }
    
    try{
      const update = blogService.put(object)
      .then(returnedBlog => {
        const b = blog
        const bChange = {...b, likes: blog.likes +1 }
        setBlogs( blogs.map(vlog => vlog.id === blog.id ? bChange : vlog))
        // console.log(blogs)
      })
    }
    catch(error){
      console.log("error")
    }
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const view = () => {
    return (
      <div>
        {blog.title} {blog.author} <button onClick={handleDetails}>view</button>
      </div>
    )
  }

  const handleRemove = () => {
    const response = window.confirm(`Removing blog ${blog.title} by ${blog.author}`)
    if(response == true){
      blogService.setToken(user.token)
      const respuesta = blogService.eliminar(blog.id)
      .then(resp =>{
        setBlogs(blogs.filter(vlog => vlog.id !== blog.id ))
      })
    }
  }
  
  const hide =() => {
    return (
      <div>
        {blog.title} {blog.author} <button onClick={handleDetails}>hide</button>
        <p>{blog.url}</p>
        <p><span>likes </span>{blog.likes}  <button onClick={handleLike}>like</button></p>
        <p>{blog.user.name}</p>
        {blog.user.name === user.name?
        <button onClick={handleRemove}>remove</button>:
        ''}
      </div>
    )
  }

  return (
    <div style={blogStyle}>
      <div>
        {details === false ?
        view():
        hide()}
      </div>
    </div>
)}

export default Blog