// En tu archivo App.jsx o index.js
import 'primereact/resources/themes/viva-light/theme.css'; // Tema de PrimeReact (puedes elegir otro tema si lo deseas)
import 'primereact/resources/primereact.min.css'; // Estilos generales de PrimeReact
import 'primeicons/primeicons.css'; // Iconos de PrimeIcons // Estilos de PrimeIcons
import "./App.css"
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import { AuthRoute } from './routers/AuthRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <AuthRoute />
      </Router>
    </AuthProvider>
  );
}

export default App;
