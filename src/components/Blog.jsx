import blogService from "../services/blogs";
import PropTypes from "prop-types";
import { eliminarBlog } from "../reducers/blogReducer";
import { Link } from "react-router-dom";
import styled from "styled-components";

const ListBlogs = styled.div`
  background: #e8f5e9;
  color: #e8f5e9;
  padding: 10px;
  font-family: Verdana, Arial, Tahoma;
  border-radius: 2px;
`;

const Blog = ({ blog, user, dispatch, blogs }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const view = () => {
    return (
      <div data-testid="blog-view" className="blog-view">
        <Link to={`/blogs/${blog.id}`}>
          {blog.title} {blog.author}{" "}
        </Link>
      </div>
    );
  };

  const handleRemove = () => {
    const response = window.confirm(
      `Removing blog ${blog.title} by ${blog.author}`,
    );
    if (response === true) {
      blogService.setToken(user.token);
      blogService
        .eliminar(blog.id)
        .then(() => {
          const blogsResultantes = blogs.filter((vlog) => vlog.id !== blog.id);
          dispatch(eliminarBlog(blogsResultantes));
        })
        .catch((error) => {
          console.log("error en eliminar");
        });
    }
  };

  return <ListBlogs style={blogStyle}>{view()}</ListBlogs>;
};

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  blogs: PropTypes.array.isRequired,
};

export default Blog;
