import { useState } from "react"

const Blog = ({ blog, user }) => {
  const [details, setDetails] = useState(false)

  const handleDetails = () => {
    setDetails(!details)
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
  
  const hide =() => {
    return (
      <div>
        {blog.title} {blog.author} <button onClick={handleDetails}>hide</button>
        <p>{blog.url}</p>
        <p><span>likes </span>{blog.likes}  <button >like</button></p>
        <p>{user}</p>
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