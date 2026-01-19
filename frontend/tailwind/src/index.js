import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter } from "react-router-dom"
import { Provider } from 'react-redux';
import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./reducer/Idx";
import { SpeedInsights } from "@vercel/speed-insights/react";
import "video-react/dist/video-react.css";
// import { Toaster } from 'react-hot-toast'
const root = ReactDOM.createRoot(document.getElementById("root"));
const store = configureStore({
  reducer: rootReducer
})
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
        <SpeedInsights/>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
