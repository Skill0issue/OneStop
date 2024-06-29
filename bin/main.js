import { jsx as _jsx } from "react/jsx-runtime";
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
//context
import { CanvasProvider } from './context/canvasContext';
//Router 
import { BrowserRouter } from 'react-router-dom';
ReactDOM.createRoot(document.getElementById('root')).render(_jsx(BrowserRouter, { children: _jsx(CanvasProvider, { children: _jsx(App, {}) }) }));
