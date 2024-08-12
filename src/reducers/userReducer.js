const initialState = {
  name: null,
  token: null,
  username: null,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case "login":
      return action.payload;
    case "logout":
      return { ...state, name: null, token: null, username: null };
    default:
      return state;
  }
};

export const loginUser = (user) => {
  return {
    type: "login",
    payload: user,
  };
};

export const logoutUser = (message) => {
  return {
    type: "logout",
    payload: message,
  };
};

export default userReducer;
