import * as React from 'react';
import { Outlet } from 'react-router';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { Box, Typography } from '@mui/material';
import LogoutButton from '../components/LogoutButton';

export default function Layout() {
  const [colorScheme, setColorScheme] = React.useState(
    document.documentElement.getAttribute('data-toolpad-color-scheme') || 'light'
  );

  React.useEffect(() => {
    const observer = new MutationObserver(() => {
      const scheme = document.documentElement.getAttribute('data-toolpad-color-scheme') || 'light';
      setColorScheme(scheme);
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-toolpad-color-scheme'],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <DashboardLayout>
      {/* 🔑 Botón logout arriba */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
        <LogoutButton />
      </Box>

      {/* Aquí se pintan las páginas hijas */}
      <Outlet />

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          textAlign: 'center',
          padding: 2,
          mt: 4,
          backgroundColor: colorScheme === 'light' ? '#f5f5f5' : '#222',
          color: colorScheme === 'light' ? '#333' : '#ddd',
        }}
      >
        <Typography variant="body2">
          © {new Date().getFullYear()} Poder Legislativo del Estado de B.C.
        </Typography>
      </Box>
    </DashboardLayout>
  );
}
