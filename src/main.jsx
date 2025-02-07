import ReactDOM from 'react-dom/client'
import App from './App.jsx';
import { SidebarProvider } from './context/sidebarContext.jsx';
import "./App.css"

ReactDOM.createRoot(document.getElementById('root')).render(
  <SidebarProvider>
    <App />
  </SidebarProvider>
)
