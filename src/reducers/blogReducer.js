// import { type } from "@testing-library/user-event/dist/cjs/utility/type.js";

const initialState = {
  user: null,
  title: null,
  author: null,
  id: null,
};

const blogReducer = (state = [], action) => {
  // console.log(action.type);
  switch (action.type) {
    case "add":
      // console.log("entro");
      // console.log(action.payload);
      return state.concat(action.payload);
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

export default blogReducer;
