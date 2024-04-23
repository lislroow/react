import ReactDOM from 'react-dom/client';
import App from 'App';
import "styles/main.bundle.css";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  // <React.StrictMode>
  //   <App />
  // </React.StrictMode>
  <App />
);
