// components/LogoutButton.jsx
import React, { useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";

export default function LogoutButton() {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        // 🔑 Borra token y estado de login
        localStorage.removeItem("token");
        localStorage.setItem("isLoggedIn", "false");

        setOpen(false);
        navigate("/login");
    };

    return (
        <>
            <Button
                variant="outlined"
                startIcon={<LogoutIcon />}
                onClick={() => setOpen(true)}
                className="logout-btn"
            >
                Cerrar sesión
            </Button>

            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Cerrar sesión</DialogTitle>
                <DialogContent>
                    <DialogContentText style={{marginTop: 25}}>
                        ¿Estás seguro de que quieres cerrar tu sesión?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancelar</Button>
                    <Button onClick={handleLogout} color="error">Salir</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
