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
import { addBlog } from "./reducers/blogReducer";
import { loginUser, logoutUser } from "./reducers/userReducer";

import userService from "./services/users";

import { BrowserRouter, Routes, Route } from "react-router-dom";

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

const Head = ({ user, handleLogout }) => {
  return (
    <div>
      <p>{user.name} logged in </p>
      <button onClick={handleLogout}>logout</button>
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
  return (
    <>
      <Head user={user} handleLogout={handleLogout} />
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
        <button onClick={handleNewBlog}>create new blog</button>
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

const View = ({ users, notifications, user, handleLogout }) => {
  return (
    <div>
      <Notification message={notifications.notification} />
      <Head user={user} handleLogout={handleLogout} />
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
              <td>{user.name}</td>
              <td>{user.blogs.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
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
  // console.log(blogVisible);

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
          <h2>blogs</h2>
          <Notification message={notifications.notification} />

          <Routes>
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
