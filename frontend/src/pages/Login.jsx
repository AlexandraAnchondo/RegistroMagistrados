import React, { useState } from 'react';
import styled from 'styled-components';
import logo from '../assets/logo_congreso.png';

const Login = () => {
    const [usuario, setUsuario] = useState("");
    const [contraseña, setContraseña] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ usuario, contraseña }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Error al iniciar sesión");

            // Guardar token en localStorage
            localStorage.setItem("token", data.token);
            localStorage.setItem("isLoggedIn", "true");

            // Redirigir
            window.location.href = "/listado";
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <StyledWrapper>
            <div className="form-container">
                <form className="form_main" onSubmit={handleSubmit}>
                    <p className="heading">Inicio de Sesión</p>
                    <div className="inputContainer">
                        <input
                            type="text"
                            className="inputField"
                            placeholder="Usuario"
                            value={usuario}
                            onChange={(e) => setUsuario(e.target.value)}
                        />
                    </div>
                    <div className="inputContainer">
                        <input
                            type="password"
                            className="inputField"
                            placeholder="Contraseña"
                            value={contraseña}
                            onChange={(e) => setContraseña(e.target.value)}
                        />
                    </div>
                    {error && <p style={{ color: "red" }}>{error}</p>}
                    <button id="button">Entrar</button>
                </form>
                <img src={logo} alt="Logo Congreso" className="logo" />
            </div>
        </StyledWrapper>
    );
};

const StyledWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* 👈 centrado vertical */
  background: #f5f5f5;

  .form-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }

  .form_main {
    width: 260px;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: white;
    padding: 30px;
    box-shadow: 0px 0px 40px rgba(0, 0, 0, 0.1);
    border-radius: 12px;
    position: relative;
    z-index: 2;
  }

  .heading {
    font-size: 1.8em;
    color: #2e2e2e;
    font-weight: 700;
    margin-bottom: 15px;
  }

  .inputContainer {
    width: 100%;
    position: relative;
    display: flex;
    align-items: center;
  }

  .inputIcon {
    position: absolute;
    left: 8px;
  }

  .inputField {
    width: 100%;
    height: 35px;
    border: none;
    border-bottom: 2px solid #adadad;
    margin: 10px 0;
    padding-left: 28px;
    font-size: 0.9em;
  }

  .inputField:focus {
    outline: none;
    border-bottom: 2px solid #681f36;
  }

  #button {
    width: 100%;
    border: none;
    background-color: #681f36;
    height: 35px;
    color: white;
    font-weight: 600;
    margin-top: 10px;
    cursor: pointer;
    border-radius: 5px;
  }

  #button:hover {
    background-color: #350c2bff;
  }

  .forgotLink {
    font-size: 0.8em;
    color: #350c2bff;
    margin-top: 8px;
    text-decoration: none;
  }

  .logo {
    width: 220px;
    margin-top: 20px;
    height: auto;
  }
`;

export default Login;
