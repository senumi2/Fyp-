import { createRoot } from 'react-dom/client';
import './index.css';
import { AuthProvider } from "./context/AuthContext";
import { BrowserRouter } from 'react-router-dom'; 
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </AuthProvider>
);
