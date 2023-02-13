import React, { useEffect, useState } from "react";
// import { Routes, Route, Outlet, Link } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
// import Container from "react-bootstrap/Container";
// import Row from "react-bootstrap/Row";
// import Col from "react-bootstrap/Col";
// import Button from "react-bootstrap/Button";
// import ButtonGroup from "react-bootstrap/ButtonGroup";
// import Stack from "react-bootstrap/Stack";
import Card from "react-bootstrap/Card";
import styled from "styled-components";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import CreateRoomModal from "./components/CreateRoomModal";
// import JoinRoomModal from "./components/JoinRoomModal";
import HeaderBar from "./components/HeaderBar";
import 'react-toastify/dist/ReactToastify.css';
import Router from "./Routes";
import useToken from "./hooks/useToken";
import { ToastContainer } from "react-toastify";
import { ACTIVE, INACTIVE } from "./common/Constants";


export const iconSize = "6x";

export const StyledCard = styled(Card)`
  padding-top: 2%;
  align-items: center;
  width: 25rem;
  height: 15rem;

  &:hover {
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.5);
    cursor: pointer;
  }
`;

export const StyledBrand = styled(Navbar.Brand)`
  color: var(--primary-base);
`;

export const StyledAvatar = styled.div`
  background: aqua;
  height: 40px;
  width: 40px;
  border-radius: 50%;
  text-align: center;
  padding-top: 8px;
  margin-right: 10px;
  font-weight: bold;
`;

export function App() {
  const { token, removeToken, setToken } = useToken();
  const [username, setUsername] = useState<string | null>(null);
  const [playerN, setPlayerN] = useState<string | null>(null);
  const [player1, setPlayer1] = useState<string | null>(null);
  const [player2, setPlayer2] = useState<string | null>(null);
  const [player1Status, setPlayer1Status] = useState<string>(INACTIVE);
  const [player2Status, setPlayer2Status] = useState<string | null>(null);
  const [showRegisterModal, setShowRegisterModal] = React.useState(false);
  const [showLoginModal, setShowLoginModal] = React.useState(false);
  const [isConnected, setIsConnected] = React.useState(false);
  

  return (
    <div className="App">
  <HeaderBar 
      showLoginModal={showLoginModal}
      setShowLoginModal={setShowLoginModal}
      showRegisterModal={showRegisterModal}
      setShowRegisterModal={setShowRegisterModal}
      token={token}
      removeToken={removeToken}
      setToken={setToken}
      username={username}
      setUsername={setUsername}
    />
    <Router 
      token={token} 
      username={username}
      setPlayerN={setPlayerN}
      setPlayer1={setPlayer1}
      setPlayer2={setPlayer2}
      playerN={playerN}
      player1={player1}
      player2={player2}
      player1Status={player1Status}
      player2Status={player2Status}
      setPlayer1Status={setPlayer1Status}
      setPlayer2Status={setPlayer2Status}
      isConnected={isConnected}
      setIsConnected={setIsConnected}
    />
    <ToastContainer position="bottom-left" />
    </div>
  );
}

