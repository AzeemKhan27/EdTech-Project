import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter, RouterProvider } from "react-router-dom";
import rootReducer from "./reducer/index.js";
import {configureStore} from "@reduxjs/toolkit"
import { Provider } from "react-redux";
import { Toaster } from 'react-hot-toast';

const store = configureStore({
  reducer : rootReducer
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider stote={store}>
        <BrowserRouter>
            <App />
            <Toaster />
        </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
