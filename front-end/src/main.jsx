import "./main.css"; // Import CSS chung
import React from "react";
import {createRoot} from "react-dom/client";
import { AuthProvider } from './context/AuthContext';
import { ToolsProvider } from './context/ToolsContext';
import { BrowserRouter } from "react-router-dom";
import App from "./App";

createRoot(document.getElementById("root")).render(
      <BrowserRouter>
        <AuthProvider>
          <ToolsProvider>
            <App/>
          </ToolsProvider>   
        </AuthProvider>
      </BrowserRouter>
      
);