import React, { useEffect, useRef, useState } from "react";
import { Button, Box, Typography, Snackbar, Alert, useMediaQuery } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { Html5Qrcode } from "html5-qrcode";
import axios from "axios";
import Card from "../components/Card";
import { actualizarInvitado } from '../data/API';

export default function EscanearInvitado() {
    const [scanning, setScanning] = useState(false);
    const [result, setResult] = useState(null);
    const [alert, setAlert] = useState({ open: false, message: "", severity: "info" });
    const scannerRef = useRef(null);
    const html5QrCodeRef = useRef(null);

    const isMobile = useMediaQuery('(max-width:600px)');

    const stopScanner = async () => {
        if (html5QrCodeRef.current) {
            try {
                const state = html5QrCodeRef.current.getState();
                if (state === 2) {
                    await html5QrCodeRef.current.stop();
                }
                await html5QrCodeRef.current.clear();
            } catch (err) {
                console.warn("Scanner ya estaba detenido o limpio");
            }
            // 🔹 Limpiar referencia para permitir reinicio
            html5QrCodeRef.current = null;
            processingRef.current = false; // resetear la flag
        }
        setScanning(false);
    };


    const processingRef = useRef(false); // nuevo ref

    useEffect(() => {
        if (scanning && scannerRef.current) {
            if (!html5QrCodeRef.current) {
                html5QrCodeRef.current = new Html5Qrcode(scannerRef.current.id);
            }

            html5QrCodeRef.current.start(
                { facingMode: "environment" },
                { fps: 10, qrbox: isMobile ? 250 : 600 },
                async (decodedText) => {
                    if (processingRef.current) return; // evita llamadas múltiples
                    processingRef.current = true;

                    try {
                        const data = JSON.parse(decodedText);
                        const nombre = data?.nombre;
                        if (!nombre) {
                            setAlert({ open: true, message: "QR inválido", severity: "error" });
                            processingRef.current = false;
                            return;
                        }

                        const res = await actualizarInvitado(data.id);
                        setResult(res);
                        await stopScanner();
                    } catch (err) {
                        console.error(err);

                        if (err.response && err.response.status === 401) {
                            localStorage.removeItem("token");
                            localStorage.setItem("isLoggedIn", "false");
                            window.location.href = "/login";
                        } else {
                            setAlert({ open: true, message: "Error leyendo el QR", severity: "error" });
                        }

                        processingRef.current = false;
                    }

                }
            ).catch((err) => console.error("Error iniciando scanner:", err));

            return () => stopScanner().catch(() => { });
        }
    }, [scanning, isMobile]);


    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100vh",
                px: 2,
                gap: 3,
            }}
        >
            {!scanning ? (
                <Button
                    variant="contained"
                    size={isMobile ? "medium" : "large"}
                    startIcon={<FontAwesomeIcon icon={faCamera} />}
                    sx={{
                        fontSize: isMobile ? "1rem" : "1.5rem",
                        padding: isMobile ? "12px 24px" : "20px 40px",
                        color: 'white !important',
                        borderRadius: 4,
                        backgroundColor: "#691c36"
                    }}
                    onClick={() => {
                        setResult(null);
                        setScanning(true);
                    }}
                >
                    Escanear Invitado
                </Button>
            ) : (
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div
                        id="qr-reader"
                        ref={scannerRef}
                        style={{
                            width: isMobile ? "90vw" : "600px",
                            height: isMobile ? "450px" : "300px",
                            maxWidth: "100%",
                            border: "4px solid #1976d2",
                            borderRadius: "12px",
                            overflow: "hidden",
                        }}
                    />
                    <Button
                        variant="outlined"
                        sx={{ mt: 2 }}
                        onClick={stopScanner}
                    >
                        Cancelar
                    </Button>
                </Box>
            )}

            {result && (
                <Card
                    nombre={result.nombre}
                    cargo={result.cargo}
                    lugar={result.lugar}
                    zona={result.zona}
                    tipoInvitado={result.tipoInvitado}
                    estatus={result.mensaje}
                />
            )}

            <Snackbar
                open={alert.open}
                autoHideDuration={3000}
                onClose={() => setAlert({ ...alert, open: false })}
            >
                <Alert
                    severity={alert.severity}
                    onClose={() => setAlert({ ...alert, open: false })}
                >
                    {alert.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}
