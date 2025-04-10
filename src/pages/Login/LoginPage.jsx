import React, { useState, useContext } from "react";
import styled from "styled-components";
import { AuthContext } from "../../context/AuthContext";
import { FloatLabel } from "primereact/floatlabel";
import { InputText } from "primereact/inputtext";
import { fondo } from "../../utils/images";
import { FaFacebookF } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";

export const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { login } = useContext(AuthContext);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    try {
      await login(username, password);
    } catch (error) {
      setError(error.response ? error.response.data.message : error.message);
    }
  };

  return (
    <FormContainer>
      <div className="contenedores" style={{ display: "flex", justifyContent: 'space-between', width: '70%' }}>
        <div className="contenido" style={{ width: '50%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '30px' }}>
          <a style={{ fontSize: '50px', color: 'white', fontWeight: 'bold' }}>SOMOS EL ALIADO ESTRATÉGICO DE TU NEGOCIO</a>
          <a style={{ color: 'white' }}>Transportando tu mercancía con seguridad, en el menor tiempo y cuando lo requiera.</a>
          <div className="redes">
            <a href="https://www.facebook.com/operacinesjwm/?locale=es_LA" target="_blank" rel="noopener noreferrer">
              <FaFacebookF size={30} color="white" style={{ margin: '0 10px' }} />
            </a>
            <a href="https://www.instagram.com/tu_pagina_de_instagram/" target="_blank" rel="noopener noreferrer">
              <FaInstagram size={30} color="white" style={{ margin: '0 10px' }} />
            </a>
            <a href="https://twitter.com/tu_pagina_de_twitter" target="_blank" rel="noopener noreferrer">
              <FaTwitter size={30} color="white" style={{ margin: '0 10px' }} />
            </a>
          </div>
        </div>

        <Form onSubmit={handleSubmit}>
          <Header>
            <Title>Sing In</Title>
            <Subtitle>Ingrese su usuario y contraseña</Subtitle>
          </Header>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <div className="Contenedor" style={{ display: "flex", flexDirection: "column", gap: "28px", width: "100%" }}>
            <div className="usuario" >
              <FloatLabel >
                <InputText style={{ width: '100%' }} id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                <label htmlFor="username">Username</label>
              </FloatLabel>
            </div>
            <div className="contrasena">
              <FloatLabel style={{ width: '100%' }}>
                <InputText type="password" style={{ width: '100%' }} id="password" value={password} onChange={(e) => setPassword(e.target.value)} toggleMask />
                <label htmlFor="password">Contraseña</label>
              </FloatLabel>
            </div>
          </div>
          <Button type="submit">Empezar</Button>
          <Copyright>© Copyright ENRA. All Rights Reserved</Copyright>
        </Form>
      </div>
    </FormContainer>
  );
};

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-image: url(${fondo.image});
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  padding: 20px;
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.4);
  }
  > * {
    position: relative;
    z-index: 1;
  }
`;

const Form = styled.form`
  background-color: none;
  padding: 30px;
  gap: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  width: 400px; /* Adjust width as needed */
  max-width: 95%;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 15px;
`;

const Title = styled.h2`
  color:rgb(255, 255, 255);
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 5px;
  text-align: center;
`;

const Subtitle = styled.p`
  color: #fff;
  margin-bottom: 15px;
  text-align: center;
  font-size: 0.9rem;
`;

const Button = styled.button`
  width: 100%;
  padding: 12px 20px;
  border: none;
  border-radius: 5px;
  font-size: 1.1rem;
  font-weight: bold;
  background-color: #1976d2;
  color: #fff;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #1565c0;
  }
`;

const ErrorMessage = styled.p`
  color: #f44336;
  margin-bottom: 15px;
  text-align: center;
  font-size: 0.9rem;
`;

const Copyright = styled.p`
  text-align: center;
  color: #fff;
  font-size: 0.8rem;
  margin-top: 20px;
`;