import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import "bootstrap/dist/css/bootstrap.min.css"
import {createBrowserRouter,RouterProvider} from "react-router-dom"
import MailDetail from './components/MailDetail';

const router= createBrowserRouter([
  {
    path:"/",
    element:<App/>
  },
  {
    path:"/detail",
    element:<MailDetail/>
  }
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>
);


