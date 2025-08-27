import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router';
import App from './App';
import Layout from './layouts/dashboard';
import ListadoPage from './pages/Listado';
import EscanearInvitado from './pages/EscanearInvitado';
import { Navigate } from 'react-router';

const router = createBrowserRouter(
  [
    {
      Component: App,
      children: [
        {
          path: '/',
          Component: Layout,
          children: [
            { index: true, element: <Navigate to="Listado" /> },
            { path: 'Listado', Component: ListadoPage },
            { path: 'form', Component: EscanearInvitado },
          ],
        },
      ],
    },
  ]
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
