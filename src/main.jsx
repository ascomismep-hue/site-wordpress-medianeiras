import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// Injeção de estilo global direto para garantir que o site nunca perca as cores e o layout no GitHub Pages
const styleSheet = document.createElement("style");
styleSheet.innerText = `
  body {
    background-color: #fcfbf9;
    color: #2d3748;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
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
