const initialState = {
  user: null,
  title: null,
  author: null,
  id: null,
};

const blogReducer = (state = [], action) => {
  switch (action.type) {
    case "add":
      return state.concat(action.payload);
    case "update":
      return action.payload;
    case "eliminar":
      return action.payload;
    default:
      return state;
  }
};

export const addBlog = (blog) => {
  return {
    type: "add",
    payload: blog,
  };
};

export const updateBlog = (blog) => {
  return {
    type: "update",
    payload: blog,
  };
};

export const eliminarBlog = (blog) => {
  return {
    type: "eliminar",
    payload: blog,
  };
};

export default blogReducer;
