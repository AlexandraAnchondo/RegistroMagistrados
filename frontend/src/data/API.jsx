// src/data/api.js
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// Obtener token y headers
const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
});

// Manejo de errores comunes
const handleApiError = (err) => {
    console.error(err);
    if (err.response && err.response.status === 401) {
        localStorage.removeItem("token");
        localStorage.setItem("isLoggedIn", "false");
        window.location.href = "/login";
    }
    throw err; // para que los componentes puedan reaccionar si quieren
};

// --- Funciones exportadas ---
export const fetchInvitados = async () => {
    try {
        const res = await axios.get(`${API_URL}/api/listado`, {
            headers: getAuthHeaders(),
            withCredentials: true,
        });
        return res.data;
    } catch (err) {
        handleApiError(err);
    }
};

export const fetchInvitadosProtesta = async () => {
    try {
        const res = await axios.get(`${API_URL}/api/listado_protesta`, {
            headers: getAuthHeaders(),
            withCredentials: true,
        });
        return res.data;
    } catch (err) {
        handleApiError(err);
    }
};

export const actualizarInvitado = async (id, body = {}) => {
    try {
        const res = await axios.put(`${API_URL}/api/invitado/${id}`, body, {
            headers: getAuthHeaders(),
            withCredentials: true,
        });
        return res.data;
    } catch (err) {
        handleApiError(err);
    }
};
