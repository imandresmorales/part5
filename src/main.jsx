import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import notificationReducer from "./reducers/notificationReducer";

import { createStore } from "redux";
import App from "./App";

const store = createStore(notificationReducer);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <App />
  </Provider>,
);
