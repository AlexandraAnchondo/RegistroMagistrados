import * as React from 'react';
import { Outlet } from 'react-router';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { Box, Typography } from '@mui/material';

export default function Layout() {
  // Leer atributo en tiempo real
  const [colorScheme, setColorScheme] = React.useState(
    document.documentElement.getAttribute('data-toolpad-color-scheme') || 'light'
  );

  // Listener para cambios
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
      <Outlet />

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
