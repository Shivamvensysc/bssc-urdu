import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from "react-oidc-context";
import { zitadelConfig } from "./auth/zitadelConfig";



createRoot(document.getElementById('root')!).render(
  <StrictMode>
    
    <App />
  
  </StrictMode>,
)
