import React from "react";
import { Routes, Route } from "react-router-dom";
import { Main } from "./Main";
import GameRoom from "./GameRoom";
// import { HeaderBarProps } from "./components/HeaderBar";

interface RouterProps {
  token: string | null;
  username: string | null;
  setPlayerN: (value: null | string | ((val: string |  null) => null | string)) => void
  setPlayer1: (value: null | string | ((val: string |  null) => null | string)) => void;
  setPlayer2: (value: null | string | ((val: string |  null) => null | string)) => void;
  playerN: string | null;
  player1: string | null;
  player2: string | null;
  player1Status: string;
  player2Status: string | null;
  setPlayer1Status: (value: string | ((val: string) => string)) => void;
  setPlayer2Status: (value: null | string | ((val: string | null) => null | string)) => void;
  isConnected: boolean;
  setIsConnected: (value: boolean | ((val: boolean) => boolean)) => void;
}

function Router(
  {
    token,
    username,
    setPlayerN,
    setPlayer1,
    setPlayer2,
    playerN,
    player1,
    player2,
    player1Status,
    player2Status,
    setPlayer1Status,
    setPlayer2Status,
    isConnected,
    setIsConnected
  }:RouterProps 
) {

  return (
      <Routes>
        <Route
          path="/"
          element={
            <Main 
            token={token}
            username={username}
            playerN={playerN}
            setPlayerN={setPlayerN}
            setPlayer1={setPlayer1}
            setPlayer2={setPlayer2}
            player1Status={player1Status}
            setPlayer1Status={setPlayer1Status}
            player2Status={player2Status}
            setPlayer2Status={setPlayer2Status}
            isConnected={isConnected}
            setIsConnected={setIsConnected}
            />
          }
        />
        {  username ? ( 
        <Route
          path="/game-room/:roomId"
          element={
            <GameRoom 
            token={token} 
            username={username}
            playerN={playerN}
            player1={player1}
            player2={player2}
            setPlayerN={setPlayerN}
            setPlayer1={setPlayer1}
            setPlayer2={setPlayer2}
            player1Status={player1Status}
            player2Status={player2Status}
            setPlayer1Status={setPlayer1Status}
            setPlayer2Status={setPlayer2Status}
            isConnected={isConnected}
            setIsConnected={setIsConnected}
            />
          }
        />
        ):null} 
      </Routes>
  );
}

export default Router;
