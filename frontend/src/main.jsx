import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import App from './App';
import Layout from './layouts/dashboard';
import ListadoPage from './pages/Listado';
import EscanearInvitado from './pages/EscanearInvitado';
import Confirmados from './pages/Confirmados'
import Login from './pages/Login';

function PrivateRoute({ children }) {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  return isLoggedIn ? children : <Navigate to="/login" replace />;
}

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    Component: App,
    children: [
      { index: true, element: <Navigate to="login" /> },
      {
        path: "/",
        Component: Layout,
        children: [
          {
            path: "listado",
            element: (
              <PrivateRoute>
                <ListadoPage />
              </PrivateRoute>
            )
          },
          {
            path: "form",
            element: (
              <PrivateRoute>
                <EscanearInvitado />
              </PrivateRoute>
            )
          },
          {
            path: "confirmados",
            element: (
              <PrivateRoute>
                <Confirmados />
              </PrivateRoute>
            )
          },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
