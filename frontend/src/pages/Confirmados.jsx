import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, Grid, useMediaQuery } from '@mui/material';
import '../styles/Confirmados.css';
import Loader from '../components/Loader'
import { fetchInvitadosProtesta } from '../data/API';

export default function ConfirmadosPage() {
    const [pendientes, setPendientes] = useState(0);
    const [confirmados, setConfirmados] = useState(0);

    const isMobile = useMediaQuery('(max-width:600px)');

    useEffect(() => {
            const loadData = async () => {
                const data = await fetchInvitadosProtesta();
                if(data) {
                    const pendientesCount = data.filter((inv) => inv.estatus === "Pendiente").length;
                    const confirmadosCount = data.filter((inv) => inv.estatus !== "Pendiente").length;
                    setPendientes(pendientesCount);
                    setConfirmados(confirmadosCount);
                }
            };
            loadData();
        }, []);

    return (
        <div style={{ flex: 1, padding: isMobile ? "16px" : "32px" }}>
            <h1>Resumen de Invitados</h1>

            {pendientes === 0 && confirmados === 0 ? (
                <div className="loading-container" style={{ marginTop: "100px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <Loader />
                </div>
            ) : (
                <Grid item xs={12} sm={6}>
                    <Grid container direction="column" spacing={5} style={{ alignItems: 'center', justifyContent: 'center' }}>
                        <Grid item style={{ width: '80%' }}>
                            <Card className='card'>
                                <CardContent>
                                    <Typography variant="h5" className='card-title'>
                                        Ingresaron al edificio
                                    </Typography>
                                    <Typography variant="h4" fontWeight="bold" sx={{ color: 'black !important' }}>
                                        {confirmados}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid> 

                        <Grid item style={{ width: '80%' }}>
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
                </Grid>
            )}
        </div>
    );
}
