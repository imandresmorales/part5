import Blog from "./Blog"
import Notification from "./Notification"

const BlogForm = ({notification, handleLogout, title, author, url, handleCreate, blogs}) => {
    return (
      <>
      <div>
        <h2>blogs</h2>
        <Notification message={notification}/>
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
      </>
    )
  }

  export default blogForm