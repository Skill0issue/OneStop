import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

//context
import { CanvasProvider } from './context/canvasContext'

//Router 
import { BrowserRouter } from 'react-router-dom'





ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <CanvasProvider>
       <App />
    </CanvasProvider>
  </BrowserRouter>, 
)
