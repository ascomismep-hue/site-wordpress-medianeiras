import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// Injeção de estilo global usando apenas a fonte Montserrat em todo o site
const styleSheet = document.createElement("style");
styleSheet.innerHTML = `
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap');

  body, h1, h2, h3, h4, h5, h6, button, input, textarea {
    font-family: 'Montserrat', sans-serif !important;
  }

  body {
    background-color: #fcfbf9;
    color: #2d3748;
    margin: 0;
    padding: 0;
  }

  .irimep-hero {
    background: linear-gradient(135deg, #005a8d 0%, #004068 50%, #002845 100%);
    color: #ffffff;
  }
  .irimep-gold {
    color: #c5a059;
  }
  .irimep-red {
    background-color: #e31e24;
  }
  .irimep-card {
    background: #ffffff;
    border: 1px solid rgba(197, 160, 89, 0.2);
    border-radius: 1.5rem;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);
  }
`;
document.head.appendChild(styleSheet);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
