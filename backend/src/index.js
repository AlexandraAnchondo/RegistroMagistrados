

require('dotenv').config();
const fs = require('fs');
const express = require('express');
const sql = require('mssql');
const cors = require('cors');

const app = express();
app.use(express.json());

app.use(cors({ origin: true, credentials: true }));

const config_prod = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    options: {
        encrypt: true,
        trustServerCertificate: true,
    }
};

async function getConnection() {
    try {
        const pool = await sql.connect(config_prod);
        return pool;
    } catch (err) {
        console.error('Error conectando a SQL Server:', err);
        throw err;
    }
}

// GET /api/listado → todos los Invitados
app.get('/api/listado', async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request().query('SELECT * FROM Invitados');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// PUT /api/invitado/:id → obtener invitado y actualizar estatus según reglas
app.put('/api/invitado/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const pool = await getConnection();

        // 1️⃣ Obtener invitado
        const result = await pool.request()
            .input('id', id)
            .query('SELECT * FROM Invitados WHERE id = @id');

        if (result.recordset.length === 0)
            return res.status(404).json({ error: 'Invitado no encontrado' });

        const invitado = result.recordset[0];

        // 2️⃣ Determinar nuevo estatus
        let nuevoEstatus;
        let ultimoEstatus;
        let mensaje;
        switch (invitado.estatus) {
            case 'Pendiente':
                nuevoEstatus = 'Edificio';
                ultimoEstatus = 'Pendiente';
                mensaje = 'Ingreso al edificio permitido';
                break;
            case 'Edificio':
                nuevoEstatus = 'Zona';
                ultimoEstatus = 'Edificio';
                mensaje = `Ingreso a la zona ${invitado.zona} permitido`;
                break;
            case 'Zona':
                if (invitado.ultimoEstatus === 'Edificio') {
                    nuevoEstatus = 'Salida';
                    ultimoEstatus = 'Zona';
                    mensaje = `Salida de la zona registrada`;
                } else {
                    nuevoEstatus = 'Zona';
                    ultimoEstatus = 'Salida';
                    mensaje = 'Acceso denegado';
                }
                break;
            case 'Salida':
                // Ya salió de la zona, puede volver a entrar a la zona
                nuevoEstatus = 'Zona';
                ultimoEstatus = 'Salida';
                mensaje = `Ingreso a la zona ${invitado.zona} permitido`;
                break;
            default:
                nuevoEstatus = 'Salida';
                ultimoEstatus = 'Zona';
        }

        // 3️⃣ Actualizar estatus en la base de datos
        await pool.request()
            .input('id', id)
            .input('estatus', nuevoEstatus)
            .query('UPDATE Invitados SET estatus = @estatus WHERE id = @id');

        await pool.request()
        .input('id', id)
        .input('ultimoEstatus', ultimoEstatus)
        .query('UPDATE Invitados SET ultimoEstatus = @ultimoEstatus WHERE id = @id');

        await pool.request()
            .input('id', id)
            .input('mensaje', mensaje)
            .query('UPDATE Invitados SET mensaje = @mensaje WHERE id = @id');

        // 4️⃣ Devolver invitado actualizado
        const updated = await pool.request()
            .input('id', id)
            .query('SELECT * FROM Invitados WHERE id = @id');

        res.json(updated.recordset[0]);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

const port = process.env.PORT || 3001;
const host = process.env.HOST || '0.0.0.0'; // 0.0.0.0 escucha en todas las interfaces

app.listen(port, host, () => {
    console.log(`API corriendo en http://${host}:${port}`);
});
