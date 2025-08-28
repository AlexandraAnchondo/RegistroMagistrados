import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DataGrid from '../components/DataGrid';
import { Button, Snackbar, Alert, Modal, Box, useMediaQuery, Typography } from '@mui/material';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQrcode, faShareAlt, faDownload } from "@fortawesome/free-solid-svg-icons";
import { QRCodeCanvas } from "qrcode.react";
import '../styles/Listado.css';
import { shareQrImage } from "../components/shareQRImage";
import Loader from '../components/Loader'

export default function MovimientosPage() {
    const [invitados, setInvitados] = useState([]);
    const [selected, setSelected] = useState(null);
    const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });

    const isMobile = useMediaQuery('(max-width:600px)');

    const fetchData = () => {
        const token = localStorage.getItem("token");
        axios
            .get(`${import.meta.env.VITE_API_URL}/api/listado`, {
                headers: {
                    Authorization: `Bearer ${token}`, 
                },
                withCredentials: true,
            })
            .then((res) => setInvitados(res.data))
            .catch((err) => {
                console.error(err);

                // si el token ya expiró o es inválido, saco al usuario al login
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


    useEffect(() => {
        fetchData();
    }, []);

    const handleDownload = () => {
        const canvas = document.getElementById("qr-code");
        shareQrImage(canvas, selected.nombre, selected.tipoInvitado, selected.lugar, selected.zona, false, true);
    };

    const handleShare = async () => {
        const canvas = document.getElementById("qr-code");
        shareQrImage(canvas, selected.nombre, selected.tipoInvitado, selected.lugar, selected.zona, true, false);
    };

    const columns = [
        { field: 'nombre', headerName: 'Nombre', flex: 1, minWidth: 120 },
        { field: 'cargo', headerName: 'Cargo', flex: 1, minWidth: 100 },
        { field: 'tipoInvitado', headerName: 'Tipo', flex: 1, minWidth: 100 },
        { field: 'lugar', headerName: 'Lugar', flex: 1, minWidth: 100 },
        { field: 'zona', headerName: 'Zona', flex: 1, minWidth: 100 },
        { field: 'confirmacion', headerName: 'Confirmación', flex: 1, minWidth: 120 },
        { field: 'estatus', headerName: 'Estatus', flex: 1, minWidth: 100 },
        {
            field: 'qr',
            headerName: 'QR',
            flex: 1,
            minWidth: 120,
            renderCell: (params) => (
                <Button
                    variant="contained"
                    endIcon={<FontAwesomeIcon icon={faQrcode} />}
                    sx={{
                        backgroundColor: "#67b265ff",
                        color: "white !important",
                        fontSize: isMobile ? "0.7rem" : "0.9rem",
                        padding: isMobile ? "4px 8px" : "6px 12px",
                        "&:hover": { backgroundColor: "#558853ff" }
                    }}
                    onClick={() => setSelected(params.row)}
                >
                    Ver QR
                </Button>
            ),
        },
    ];

    return (
        <div className="inventario-container" style={{ flex: 1 }}>
            <h1>Listado de Invitados</h1>

            {invitados.length === 0 ? (
                <div className="loading-container" style={{ marginTop: "100px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <Loader />
                </div>
            ) : (
                <div className="data-grid-container" style={{ height: isMobile ? 400 : 600 }}>
                    <DataGrid
                        rows={invitados}
                        columns={columns}
                        pageSize={isMobile ? 5 : 10}
                        getRowId={(row) => row.id}
                        sx={{
                            boxShadow: 3,
                            border: 2,
                            borderColor: '#1976d2',
                            '& .MuiDataGrid-cell:hover': {
                                color: 'primary.main',
                            },
                        }}
                        autoHeight={isMobile} // para que la tabla ajuste su altura automáticamente en móviles
                    />
                </div>
            )}

            {/* Modal QR */}
            <Modal open={!!selected} onClose={() => setSelected(null)}>
                <Box sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    bgcolor: "white",
                    p: isMobile ? 2 : 4,
                    borderRadius: 2,
                    textAlign: "center",
                    width: isMobile ? '90vw' : 400
                }}>
                    <Typography variant={isMobile ? "h6" : "h6"}>
                        Tipo de invitado <br />{selected?.tipoInvitado}
                    </Typography>
                    <QRCodeCanvas
                        id="qr-code"
                        value={JSON.stringify({
                            id: selected?.id,
                            nombre: selected?.nombre,
                            cargo: selected?.cargo,
                            tipoInvitado: selected?.tipoInvitado,
                            lugar: selected?.lugar,
                            zona: selected?.zona
                        })}
                        size={isMobile ? 80 : 200}
                        style={{
                            width: isMobile ? 150 : 200,
                            height: isMobile ? 150 : 200,
                            marginTop: 10
                        }}
                        includeMargin={true}
                    />
                    <Box sx={{
                        mt: 2,
                        display: "flex",
                        gap: 1,
                        justifyContent: "center",
                        flexWrap: "wrap"
                    }}>
                        <Button
                            variant="contained"
                            startIcon={<FontAwesomeIcon icon={faDownload} />}
                            onClick={handleDownload}
                            sx={{
                                backgroundColor: '#7da765',
                                color: 'white !important',
                                fontSize: isMobile ? "0.7rem" : "0.9rem",
                                px: isMobile ? 1 : 2
                            }}
                        >
                            Descargar
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<FontAwesomeIcon icon={faShareAlt} />}
                            onClick={handleShare}
                            sx={{
                                color: 'white !important',
                                fontSize: isMobile ? "0.7rem" : "0.9rem",
                                px: isMobile ? 1 : 2
                            }}
                        >
                            Compartir
                        </Button>
                    </Box>
                </Box>
            </Modal>

            <Snackbar
                open={alert.open}
                autoHideDuration={3000}
                onClose={() => setAlert({ ...alert, open: false })}
            >
                <Alert severity={alert.severity} onClose={() => setAlert({ ...alert, open: false })}>
                    {alert.message}
                </Alert>
            </Snackbar>
        </div>
    );
}
