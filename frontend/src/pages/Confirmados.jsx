import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, Grid, useMediaQuery } from '@mui/material';
import '../styles/Confirmados.css';

export default function ConfirmadosPage() {
    const [pendientes, setPendientes] = useState(0);
    const [confirmados, setConfirmados] = useState(0);

    const isMobile = useMediaQuery('(max-width:600px)');

    const fetchData = () => {
        const token = localStorage.getItem("token");
        axios
            .get(`${import.meta.env.VITE_API_URL}/api/listado`, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true,
            })
            .then((res) => {
                const data = res.data || [];
                const pendientesCount = data.filter((inv) => inv.estatus === "Pendiente").length;
                const confirmadosCount = data.filter((inv) => inv.estatus !== "Pendiente").length;
                setPendientes(pendientesCount);
                setConfirmados(confirmadosCount);
            })
            .catch((err) => {
                console.error(err);
                if (err.response && err.response.status === 401) {
                    localStorage.removeItem("token");
                    localStorage.setItem("isLoggedIn", "false");
                    window.location.href = "/login";
                }
            });
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div style={{ flex: 1, padding: isMobile ? "16px" : "32px" }}>
            <h1>Resumen de Invitados</h1>

            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <Card className='card'>
                        <CardContent>
                            <Typography variant="h5" className='card-title'>
                                Confirmados
                            </Typography>
                            <Typography variant="h4" fontWeight="bold" sx={{ color: 'black !important' }}>
                                {confirmados}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <Card className='card2'>
                        <CardContent>
                            <Typography variant="h5" className='card-title'>
                                Pendientes
                            </Typography>
                            <Typography variant="h4" fontWeight="bold" sx={{ color: 'black !important' }}>
                                {pendientes}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </div>
    );
}
