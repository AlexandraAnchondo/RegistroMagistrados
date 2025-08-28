import * as React from 'react';
import { Outlet } from 'react-router';
import { ReactRouterAppProvider } from '@toolpad/core/react-router';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AddIcon from '@mui/icons-material/Add';
import ChecklistIcon from '@mui/icons-material/Checklist';
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
    title: 'Acceso',
    icon: <AddIcon />,
    pattern: 'form',
  },
  {
    segment: 'confirmados',
    title: 'Pendientes',
    icon: <ChecklistIcon />,
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
