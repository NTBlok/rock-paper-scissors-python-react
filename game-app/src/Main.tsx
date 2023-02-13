import React, { useEffect, useState } from "react";
import { Routes, Route, Outlet, Link } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Stack from "react-bootstrap/Stack";
import Card from "react-bootstrap/Card";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CreateRoomModal from "./components/CreateRoomModal";
import JoinRoomModal from "./components/JoinRoomModal";
import HeaderBar, { HeaderBarProps } from "./components/HeaderBar";
import { StyledCard, iconSize } from "./App";
import { toast } from "react-toastify";

interface MainProps {
  token: string | null;
  username: string | null;
  playerN: string | null;
  setPlayerN: (
    value: null | string | ((val: string | null) => null | string)
  ) => void;
  setPlayer1: (
    value: null | string | ((val: string | null) => null | string)
  ) => void;
  setPlayer2: (
    value: null | string | ((val: string | null) => null | string)
  ) => void;
  player1Status: string;
  player2Status: string | null;
  setPlayer1Status: ( value: string | ((val: string) => string)) => void;
  setPlayer2Status: (value: null | string | ((val: string | null) => null | string)) => void;
  isConnected: boolean;
  setIsConnected: (value: boolean | ((val: boolean) => boolean)) => void;
}


export function Main(
  { 
    token, 
    username, 
    playerN, 
    setPlayerN, 
    setPlayer1, 
    setPlayer2,
    player1Status,
    setPlayer1Status,
    player2Status,
    setPlayer2Status,
    isConnected,
    setIsConnected
  }: MainProps) {
  const [showCreateRoomModal, setShowCreateRoomModal] = React.useState(false);
  const [showJoinRoomModal, setShowJoinRoomModal] = React.useState(false);

  const handleCreateGame = () => {
    if (username) {
      setShowJoinRoomModal(false);
      setShowCreateRoomModal(true);
    } else {
      toast("Please login to create a game room.");
    }
  };

  const handleJoinGame = () => {
    if (username) {
      setShowCreateRoomModal(false);
      setShowJoinRoomModal(true);
    } else {
      toast("Please login to join a game room.");
    }
  };

  return (
    <>
      <Container style={{ padding: "1rem", textAlign: "center" }}>
        <h3 style={{ color: "var(--text-dark)" }}>
          To play, create or join a game room
        </h3>
      </Container>
      <Stack
        direction="horizontal"
        gap={3}
        style={{ width: "100vw", padding: "1rem", justifyContent: "center" }}
      >
        <StyledCard style={{ background: "var(--primary)" }}>
          <Card.Body
            className="create-game"
            onClick={handleCreateGame}
            style={{ verticalAlign: "center" }}
          >
            <FontAwesomeIcon icon={["far", "hand-rock"]} size={iconSize} />
            <FontAwesomeIcon icon={["far", "hand"]} size={iconSize} />
            <FontAwesomeIcon icon={["far", "hand-scissors"]} size={iconSize} />
          </Card.Body>
          <Card.Title style={{ textAlign: "center" }}>
            Create Game Room
          </Card.Title>
        </StyledCard>
        {username && token ? (
          <CreateRoomModal
            token={token}
            show={showCreateRoomModal}
            setShow={setShowCreateRoomModal}
            username={username}
            playerN={playerN}
            setPlayerN={setPlayerN}
            setPlayer1={setPlayer1}
            setPlayer1Status={setPlayer1Status}
            isConnected={isConnected}
            setIsConnected={setIsConnected}
          />
        ) : null}
        <StyledCard style={{ background: "var(--secondary)" }}>
          <Card.Body className="join-game" onClick={handleJoinGame}>
            <FontAwesomeIcon icon={["far", "hand-rock"]} size={iconSize} />
            <FontAwesomeIcon icon={["far", "hand"]} size={iconSize} />
            <FontAwesomeIcon icon={["far", "hand-scissors"]} size={iconSize} />
          </Card.Body>
          <Card.Title style={{ textAlign: "center" }}>
            Join Game Room
          </Card.Title>
        </StyledCard>
        {username && token ? (
          <JoinRoomModal
            token={token}
            show={showJoinRoomModal}
            setShow={setShowJoinRoomModal}
            username={username}
            playerN={playerN}
            setPlayerN={setPlayerN}
            setPlayer1={setPlayer1}
            setPlayer2={setPlayer2}
            player1Status={player1Status}
            setPlayer1Status={setPlayer1Status}
            setPlayer2Status={setPlayer2Status}
            isConnected={isConnected}
            setIsConnected={setIsConnected}
          />
        ) : null}
      </Stack>
    </>
  );
}

export default Main;
