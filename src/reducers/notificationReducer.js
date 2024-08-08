const initialState = {
  notification: null,
};

const notificationReducer = (state = initialState, action) => {
  switch (action.type) {
    case "show":
      return { ...state, notification: action.payload };
    case "hide":
      return { ...state, notification: null };
    default:
      return state;
  }
};

export const showNotification = (title, author) => {
  return {
    type: "show",
    payload: `a new blog ${title} by ${author} added`,
  };
};

export const hideNotification = (message) => {
  return {
    type: "hide",
    payload: `${message}`,
  };
};

export default notificationReducer;
