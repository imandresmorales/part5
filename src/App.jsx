import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import NewBlogForm from "./components/NewBlogForm";
import { useDispatch, useSelector } from "react-redux";
import {
  showNotification,
  hideNotification,
} from "./reducers/notificationReducer";
import { addBlog, updateBlog } from "./reducers/blogReducer";
import { loginUser, logoutUser } from "./reducers/userReducer";

import userService from "./services/users";

import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useParams,
} from "react-router-dom";

const Notification = ({ message }) => {
  if (message === null) return null;
  const css = {
    color: "green",
    background: "lightgrey",
    fontSize: 20,
    borderStyle: "solid",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  };

  return (
    <div style={css}>
      <p>{message}</p>
    </div>
  );
};

const ErrorMessage = ({ message }) => {
  if (message === null) return null;
  const css = {
    color: "red",
    background: "lightgrey",
    fontSize: 20,
    borderStyle: "solid",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  };
  return (
    <div style={css}>
      <p>{message}</p>
    </div>
  );
};

const Home = ({
  user,
  blogs,
  blogVisible,
  title,
  setTitle,
  author,
  setAuthor,
  url,
  setUrl,
  handleCreate,
  handleNewBlog,
  handleLogout,
  dispatch,
}) => {
  const margin = {
    margin: "0 0 4px 0",
  };
  return (
    <>
      {blogVisible === true ? (
        <NewBlogForm
          title={title}
          setTitle={setTitle}
          author={author}
          setAuthor={setAuthor}
          url={url}
          setUrl={setUrl}
          handleCreate={handleCreate}
          handleNewBlog={handleNewBlog}
        />
      ) : (
        <button style={margin} onClick={handleNewBlog}>
          create new blog
        </button>
      )}
      {blogs
        .sort((a, b) => b.likes - a.likes)
        .map((blog) => (
          <Blog
            data-test="vlogs"
            key={blog.id}
            blog={blog}
            user={user}
            dispatch={dispatch}
            blogs={blogs}
          />
        ))}
    </>
  );
};

const View = ({ users, notifications }) => {
  return (
    <div>
      <Notification message={notifications.notification} />

      <h2>Users</h2>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>blogs created</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>
                <Link to={`/users/${user.id}`}>{user.name}</Link>
              </td>
              <td>{user.blogs.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const User = ({ users }) => {
  const id = useParams().id;
  const userParams = users.find((user) => user.id === id);
  if (!userParams) return null;
  return (
    <>
      <h2>{userParams.name}</h2>
      <h3>added blogs</h3>
      <ul>
        {userParams.blogs.map((blog) => (
          <li key={blog.id}>{blog.title}</li>
        ))}
      </ul>
    </>
  );
};

const handleLike = ({ user, blogParams, dispatch, blogs }) => {
  blogService.setToken(user.token);

  const object = {
    user: blogParams.user.id,
    title: blogParams.title,
    likes: blogParams.likes + 1,
    author: blogParams.author,
    url: blogParams.url,
    id: blogParams.id,
  };

  blogService.put(object).then(() => {
    const b = blogParams;
    const bChange = { ...b, likes: blogParams.likes + 1 };
    const updateBlogs = blogs.map((vlog) =>
      vlog.id === blogParams.id ? bChange : vlog,
    );
    dispatch(updateBlog(updateBlogs));
  });
};

const handleComment = ({
  dispatch,
  comment,
  blogParams,
  blogs,
  user,
  setComment,
}) => {
  blogService.setToken(user.token);

  let newComments = [...blogParams.comments, comment];
  const object = {
    user: blogParams.user.id,
    title: blogParams.title,
    likes: blogParams.likes,
    author: blogParams.author,
    url: blogParams.url,
    id: blogParams.id,
    comments: newComments,
  };

  blogService.put(object).then(() => {
    const b = blogParams;
    const bChange = { ...b, comments: newComments };
    const updateBlogs = blogs.map((vlog) =>
      vlog.id === blogParams.id ? bChange : vlog,
    );

    dispatch(updateBlog(updateBlogs));
    setComment("");
  });
};

const Blogs = ({ blogs, user, dispatch, comment, setComment }) => {
  const id = useParams().id;
  const blogParams = blogs.find((blog) => blog.id === id);
  const random = () => Math.random(99999);

  return (
    <>
      <h1>
        {blogParams.title} {blogParams.author}
      </h1>
      <a href="#">{blogParams.url}</a>
      <p>
        <span>likes {blogParams.likes}</span>{" "}
        <button
          onClick={() => handleLike({ user, blogParams, dispatch, blogs })}
        >
          like
        </button>
      </p>
      <p>added by {blogParams.user.name}</p>
      <h2>Comments</h2>

      <input
        type="text"
        value={comment}
        onChange={(event) => setComment(event.target.value)}
      />
      <button
        onClick={() =>
          handleComment({
            dispatch,
            comment,
            blogParams,
            blogs,
            user,
            setComment,
          })
        }
      >
        add comment
      </button>

      <ul>
        {blogParams.comments.length === 0 ? (
          <p>No comments</p>
        ) : (
          blogParams.comments.map((comment) => (
            <li key={random()}>{comment}</li>
          ))
        )}
      </ul>
    </>
  );
};

const Login = ({ user, handleLogout }) => {
  return (
    <>
      <span>{user.name} logged in </span>
      <button onClick={handleLogout}>logout</button>
    </>
  );
};

const App = () => {
  const dispatch = useDispatch();
  const notifications = useSelector((state) => state.notification);
  const blogs = useSelector((state) => state.blogs);
  const user = useSelector((state) => state.user);

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [blogVisible, setBlogVisible] = useState(false);

  const [users, setUsers] = useState([]);

  const [comment, setComment] = useState("");
  // console.log(comment);

  const margin = {
    margin: "5px",
  };

  useEffect(() => {
    userService.getAll().then((user) => setUsers(user));
  }, []);

  useEffect(() => {
    blogService.getAll().then((blogs) => {
      blogs.map((blog) => {
        dispatch(addBlog(blog));
      });
    });
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const userX = JSON.parse(loggedUserJSON);
      dispatch(loginUser(userX));
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const userLogin = await loginService.login({
        username,
        password,
      });

      window.localStorage.setItem(
        "loggedBlogappUser",
        JSON.stringify(userLogin),
      );

      blogService.setToken(userLogin.token);
      dispatch(loginUser(userLogin));
      setUsername("");
      setPassword("");
    } catch (exception) {
      setErrorMessage("wrong username or password");
      setTimeout(() => {
        setErrorMessage(null);
      }, 3000);
    }
  };

  const loginForm = () => {
    return (
      <>
        <ErrorMessage message={errorMessage} />
        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              data-testid="username"
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input
              data-testid="password"
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit">login</button>
        </form>
      </>
    );
  };

  const handleLogout = () => {
    window.localStorage.clear();
    dispatch(logoutUser("salio"));
  };

  const handleCreate = (event) => {
    event.preventDefault();
    try {
      blogService.setToken(user.token);
      blogService
        .create({ title: title, author: author, url: url })
        .then((returnedBlog) => {
          const newBlog = {
            ...returnedBlog,
            user: {
              name: user.name,
              username: user.username,
              id: returnedBlog.user,
            },
          };
          dispatch(addBlog(newBlog));
          setAuthor("");
          setTitle("");
          setUrl("");
          setBlogVisible(!blogVisible);
          dispatch(showNotification(title, author));
          setTimeout(() => {
            dispatch(hideNotification(""));
          }, 3000);
        });
    } catch (error) {
      dispatch(showNotification("error"));
      setTimeout(() => {
        dispatch(hideNotification(""));
      }, 3000);
    }
  };

  const handleNewBlog = () => {
    setBlogVisible(!blogVisible);
  };

  const blogForm = () => {
    return (
      <>
        <BrowserRouter>
          <div>
            <Link style={margin} to="/">
              blog
            </Link>
            <Link style={margin} to="/users">
              users
            </Link>
            <Login user={user} handleLogout={handleLogout} />
          </div>
          <h2>blog app</h2>
          <Notification message={notifications.notification} />

          <Routes>
            <Route
              path="/blogs/:id"
              element={
                <Blogs
                  user={user}
                  blogs={blogs}
                  handleLogout={handleLogout}
                  dispatch={dispatch}
                  comment={comment}
                  setComment={setComment}
                />
              }
            />
            <Route
              path="/users/:id"
              element={
                <User users={users} handleLogout={handleLogout} user={user} />
              }
            />
            <Route
              path="/users"
              element={
                <View
                  users={users}
                  notifications={notifications}
                  user={user}
                  handleLogout={handleLogout}
                />
              }
            />
            <Route
              path="/"
              element={
                <Home
                  user={user}
                  blogs={blogs}
                  blogVisible={blogVisible}
                  title={title}
                  setTitle={setTitle}
                  author={author}
                  setAuthor={setAuthor}
                  url={url}
                  setUrl={setUrl}
                  handleCreate={handleCreate}
                  handleNewBlog={handleNewBlog}
                  handleLogout={handleLogout}
                  dispatch={dispatch}
                />
              }
            />
          </Routes>
        </BrowserRouter>
      </>
    );
  };

  return <div>{user.name === null ? loginForm() : blogForm()}</div>;
};

export default App;
