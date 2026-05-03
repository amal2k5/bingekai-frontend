import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from "./context/AuthContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./index.css";
import { LoadingProvider } from './context/LoadingContext.jsx';
import { BrowserRouter } from "react-router-dom";
import { UserProvider } from "./context/UserContext";

const originalRemoveItem = localStorage.removeItem.bind(localStorage);
localStorage.removeItem = function(key) {
  if (key === "refresh") {
    console.trace("=== REFRESH TOKEN REMOVED BY ===");
  }
  return originalRemoveItem(key);
};


createRoot(document.getElementById('root')).render(

  <StrictMode>
    <UserProvider>
    <BrowserRouter> 
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <AuthProvider>
          <LoadingProvider>
            <App />
          </LoadingProvider>
        </AuthProvider>
      </GoogleOAuthProvider>
    </BrowserRouter> 
    </UserProvider>
  </StrictMode>
  
);