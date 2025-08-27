import * as React from 'react';
import { Outlet } from 'react-router';
import { ReactRouterAppProvider } from '@toolpad/core/react-router';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AddIcon from '@mui/icons-material/Add';
import "./styles/App.css"

const NAVIGATION = [
{
    segment: 'listado',
    title: 'Listado',
    icon: <DashboardIcon />,
    pattern: 'listado',
  },
  {
    segment: 'form',
    title: 'Agregar acceso',
    icon: <AddIcon />,
    pattern: 'form',
  },
  {
    segment: 'confirmados',
    title: 'Ver confirmados',
    icon: <AddIcon />,
    pattern: 'confirmados',
  },
];

const BRANDING = {
  title: "Registro de Acceso",
  logo: "",
};


export default function App() {
  return (
    <ReactRouterAppProvider navigation={NAVIGATION} branding={BRANDING}>
      <Outlet />
    </ReactRouterAppProvider>
  );
}
