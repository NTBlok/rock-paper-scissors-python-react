import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Stack from "react-bootstrap/Stack";
import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import "./App.css";
import { iconSize } from "./App";
import GameRoundsTableFromAPI from "./components/GameRoundsTableFromAPI";
import { useEffect, useMemo, useState } from "react";
import socket from "./socket";
import axios from "axios";
import { APIURL, ACTIVE, INACTIVE, ROCK, PAPER, SCISSORS } from "./common/Constants";
import { useScore } from "./hooks/useRoom";
import { Formik, Field, Form as FormikForm } from "formik";
import Form from "react-bootstrap/Form";
import { toast } from "react-toastify";
import { useRounds } from "./hooks/useRound";
import { setDefaultResultOrder } from "dns";
import { emit } from "process";

const COLOR_SECONDARY = "secondary";
const COLOR_SUCCESS = "success";

const StyledScorePlayer1 = styled(Container)`
  position: absolute;
  padding-top: 13rem;
  padding-right: 1rem;
`;

const StyledScorePlayer2 = styled(Container)`
  text-align: right;
  position: absolute;
  padding-top: 13rem;
  padding-right: 1rem;
`;

const StyledNameTag = styled(Button)`
  background-color: var(--primary-background-dark);
  border-color: var(--primary-background-dark);
  pointer-events: none;
`;


const StyledChoiceButton = styled(Form.Check)`
  background-color: var(--secondary-background-dark);
  border-color: var(--primary-background-light);
  border: solid;
  margin-left: 1rem;

  input[type=radio]{
    transform:scale(1.2);
  }
`;

const StyledResetButton = styled(Button)`
  cursor: "pointer";
`;


  // padding-top: 2%;
  const StyledCard = styled(Card)`
  align-items: center;
  width: 25rem;
  height: 15rem;
`;



const RockPlayer1 = () => {
  return (
    <FontAwesomeIcon
              className={"fa-rotate-90"}
              icon={["far", "hand-rock"]}
              size={iconSize}
            />
  )
}

const PaperPlayer1 = () => {
  return (
    <FontAwesomeIcon 
      className={"fa-rotate-90"}
      icon={["far", "hand"]} 
      size={iconSize} />
  )
}

const ScissorsPlayer1 = () => {
  return (
    <FontAwesomeIcon
      className={"fa-flip-horizontal"}
      icon={["far", "hand-scissors"]}
      size={iconSize}
    />
  )
}

const RockPlayer2 = () => {
  return (
    <div style={{ transform: "rotate(270deg)" }}>
              <FontAwesomeIcon
                className={"fa-flip-horizontal"}
                icon={["far", "hand-rock"]}
                size={iconSize}
              />
            </div>
  )
}

const PaperPlayer2 = () => {
  return (
    <div style={{ transform: "rotate(270deg)" }}>
    <FontAwesomeIcon 
      className={"fa-flip-horizontal"}
      icon={["far", "hand"]} 
      size={iconSize} />
      </div>
  )
}

const ScissorsPlayer2 = () => {
  return (
    <FontAwesomeIcon
      icon={["far", "hand-scissors"]}
      size={iconSize}
    />
  )
}


interface GameRoomProps {
  token: string | null;
  username: string;
  playerN: string | null;
  player1: string | null;
  player2: string | null;
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
  setPlayer1Status: (value: string | ((val: string) => string)) => void;
  player2Status: string | null;
  setPlayer2Status: (
    value: null | string | ((val: null | string) => null | string)
  ) => void;
  isConnected: boolean;
  setIsConnected: (value: boolean | ((val: boolean) => boolean)) => void;
}

function GameRoom({
  token,
  username,
  playerN,
  player1,
  player2,
  setPlayerN,
  setPlayer1,
  setPlayer2,
  player1Status,
  setPlayer1Status,
  player2Status,
  setPlayer2Status,
  isConnected,
  setIsConnected,
}: GameRoomProps) {
  const { roomId } = useParams<{ roomId: string }>();
  const [roomJoined, setRoomJoined] = useState(false);
  const [roomCreated, setRoomCreated] = useState(false);
  const [readyReset, setReadyReset] = useState(false);
  const [titleMessage, setTitleMessage] = useState("Welcome");
  const [roomSocket, setRoomSocket] = useState(null);
  const [messageSocket, setMessageSocket] = useState(null);
  const [submitChoice, setSubmitChoice] = useState(false);
  const [player1Choice, setPlayer1Choice] = useState("rock");
  const [player2Choice, setPlayer2Choice] = useState("rock");
  const [animatePlay, setAnimatePlay] = useState("");
  const [roundN, setRoundN] = useState(1);
  const { getRoundsData, roundsData, getRoundsLoading, getRoundsError } = useRounds({roomId, token});
  const { getScoreData, scoreData, getScoreLoading, getScoreError } = useScore({roomId, token});
  // const roundsMemo = useMemo(() => roundsData, [roundsData]);
  // const scoreMemo = useMemo(() => scoreData, [scoreData]);


  const updateStatusColor = (status: string | null) => {
    var statusColor;
    if (status === INACTIVE || status === null) statusColor = COLOR_SECONDARY;
    if (status === ACTIVE) statusColor = COLOR_SUCCESS;
    return statusColor;
  };

  const handleActivatePlayer = () => {
    const players = {
      1: player1,
      2: player2,
    };

    const playerObj = {
      roomId: roomId,
      playerN: playerN,
      players: players,
    };

    if (
      (playerN === "1" && player1Status === INACTIVE) ||
      (playerN === "2" &&
        (player2Status === INACTIVE || player2Status === null))
    ) {
      socket.emit("join", playerObj);
      if (playerN === "2")
        socket.emit("message", {
          id: roomId,
          player2: player2,
          player2Status: ACTIVE,
        });
      console.log("player2", player2);
      console.log("username", username);
    }


    if (
      (playerN === "1" && player1Status === ACTIVE) ||
      (playerN === "2" && player2Status === ACTIVE)
    )
      socket.emit("exit", playerObj);

    console.log("client: client connected to the server");
    console.log("client: client sent data to server ", playerObj);
  };


  const handleMakeChoice = (
    values:
    { choice: string;}) => {
      const msgValues = {
        choice: values.choice,
        round: roundN, 
        playerN: playerN,
        room: roomId
      }
      socket.emit("make-choice", msgValues);
      setSubmitChoice(true);
      setReadyReset(true);
  }

  useEffect(() => {
    if (!isConnected)
      socket.on("connect", () => {
        setIsConnected(true);
        console.log("Client connected");
      });

    socket.on("player2-joined", (msgObj) => {
      if (!player2) setPlayer2(msgObj.player2);
      setPlayer2Status(ACTIVE);
      setTitleMessage(`Round: ${roundN}: Ready... Submit your choice!`)
      setAnimatePlay("animate-play");
    });

    socket.on("choice-made", (msgObj) => {
      if (msgObj.message) setTitleMessage(msgObj.message);
      socket.emit("check-winner",{"room": roomId, "round": roundN});
    })
      
    socket.on("winner-found", (msgObj) => {
      if (msgObj.player1 && msgObj.player2 && msgObj.winner) {
        setTimeout(() => {
          setAnimatePlay("");
          setPlayer1Choice(msgObj.player1);
          setPlayer2Choice(msgObj.player2);
          if (msgObj.winner === "0") setTitleMessage(`Round ${roundN}: No Winner.`);
          if (msgObj.winner === "1" || msgObj.winner === "2") setTitleMessage(`Round ${roundN}: ${msgObj.winnerName} Wins!`);
          getScoreData();
          getRoundsData();
          setReadyReset(true);
        }, 2500);
      } 
    })

    socket.on("reset-opponent", (msg) => {
      if (playerN === "1") setPlayer2Choice(ROCK);
      if (playerN === "2") setPlayer1Choice(ROCK);
      setAnimatePlay("animate-play");
      setSubmitChoice(false);
      setTitleMessage(`Round: ${msg.roundN}: Ready... Submit your choice!`);
    })


    //////////////
    socket.on("joined-player", (joinedObj) => {
      console.log("joinedObj", joinedObj);
      if (joinedObj.playerN === "1") setPlayer1Status(ACTIVE);
      if (joinedObj.playerN === "2") setPlayer2Status(ACTIVE);
      if (joinedObj.roomSocket) {
        setRoomSocket(joinedObj.roomSocket);
        console.log("joined-player joinedObj roomSocket", joinedObj.roomSocket);
        if (roomId)
          roomPatch({
            room: roomId,
            username: username,
            status: ACTIVE,
            roomSocket: joinedObj.roomSocket,
          });
      } else {
        if (roomId)
          roomPatch({ room: roomId, username: username, status: ACTIVE });
      }
      console.log(
        "client: client recieved 'joined-player' data from server ",
        joinedObj.playerN
      );
    });

    socket.on("exited-player", (player) => {
      if (player === "1") setPlayer1Status(INACTIVE);
      if (player === "2") setPlayer2Status(INACTIVE);
      if (roomId)
        roomPatch({ room: roomId, username: username, status: INACTIVE });
      console.log(
        "client: client recieved 'exited-player' data from server ",
        player
      );
    });
    //////////////


    socket.on("room-data", (msgObj) => {
      console.log("client: client recieved 'room-data' from server", msgObj);
      if (msgObj.player2 && !player2) setPlayer2(msgObj.player2);
      if (msgObj.player2Status && !player2Status)
        setPlayer2Status(msgObj.player2Status);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    // return () => {
    //   socket.off("connect");
    //   socket.off("disconnect");
    //   socket.off("pong");
    // };
  }, []);

  const roomPatch = async (values: {
    room: string;
    username: string;
    status: string;
    roomSocket?: string;
  }) => {
    await axios
      .request({
        method: "PATCH",
        url: APIURL + `/room/${values.room}`,
        headers: {
          Authorization: "Bearer " + token,
        },
        data: values,
      })
      .then(function (response) {
        setPlayer2Status(response.data["player2_status"]);
        setPlayer1Status(response.data["player1_status"]);
      });
  };


  

  const handleResetButton = () => {
    if (readyReset && submitChoice) {
      const nextRound = roundN + 1;
      setRoundN(nextRound);
      if (playerN === "1") {
        setPlayer1Choice(ROCK);
        setReadyReset(false);
        setSubmitChoice(false);
      }
      if (playerN === "2") {
        setPlayer2Choice(ROCK);
        setReadyReset(false);
        setSubmitChoice(false);
      }
      socket.emit("playerN-reset", {"roomId": roomId, "playerN": playerN, roundN: nextRound});
      setTitleMessage(`Round: ${nextRound}: Ready... Submit your choice!`)
    }
  }

  return (
    <>
      <Container style={{ padding: "1rem", textAlign: "center" }}>
        <h3 style={{ color: "var(--text-dark)" }}>
          {playerN === "1" && !player2
            ? `Invite a friend to join game room ID: ${roomId}`
            : titleMessage}
        </h3>
        { readyReset ? (
          <StyledResetButton
          onClick={handleResetButton}
          style={{paddingLeft: "1rem"}}
        >
      Reset to play again
      </StyledResetButton>
        ) : null}
      </Container>

      <Stack
        direction="horizontal"
        gap={3}
        style={{ width: "100vw", padding: "1rem", justifyContent: "center" }}
      >
        <StyledCard style={{ background: "var(--primary)" }}>
          
          <Card.Body
            className="create-game"
            style={{ verticalAlign: "center" }}
          >
          <div id="div-animate-play" className={animatePlay}>

          {player1Choice === "rock" ? <RockPlayer1 /> :
           player1Choice === "paper" ? <PaperPlayer1 /> :
           player1Choice === "scissors" ? <ScissorsPlayer1 /> :
           null}


            </div>
          </Card.Body>
          <Card.Title style={{ textAlign: "center" }}>
            {playerN === "1" ? (
              <OverlayTrigger
                placement={"bottom"}
                overlay={
                  <Tooltip>
                    Click to toggle room status: active/inactive.
                  </Tooltip>
                }
              >
                <StyledNameTag onClick={handleActivatePlayer} size="lg">
                  <Badge bg="light" text="dark">
                    {player1}
                    <Badge
                      bg={updateStatusColor(player1Status)}
                      className={
                        "position-absolute top-0 start-100 translate-middle p-2 border border-light rounded-circle"
                      }
                    >
                      <span className="visually-hidden">Status</span>
                    </Badge>
                  </Badge>
                </StyledNameTag>
              </OverlayTrigger>
            ) : (
              <StyledNameTag size="lg" style={{ pointerEvents: "none" }}>
                <Badge bg="light" text="dark">
                  {player1}
                  <Badge
                    bg={updateStatusColor(player1Status)}
                    className={
                      "position-absolute top-0 start-100 translate-middle p-2 border border-light rounded-circle"
                    }
                  >
                    <span className="visually-hidden">Status</span>
                  </Badge>
                </Badge>
              </StyledNameTag>
            )}
          </Card.Title>
          { scoreData ? 
          (<StyledScorePlayer1 style={{float: "right"}}>{`Score: ${scoreData.player1}`}</StyledScorePlayer1>)
          : null }
        </StyledCard>
        
        
        
        <StyledCard style={{ background: "var(--secondary)" }}>
          
          <Card.Body 
          className="join-game"
          style={{ verticalAlign: "center" }}
          >
          <div id="div-animate-play-2" className={animatePlay}>

          {player2Choice === "rock" ? <RockPlayer2 /> :
           player2Choice === "paper" ? <PaperPlayer2 /> :
           player2Choice === "scissors" ? <ScissorsPlayer2 /> :
           null}
            
            </div>
          </Card.Body>
          <Card.Title style={{ textAlign: "center" }}>
            {playerN === "2" ? (
              <OverlayTrigger
                placement={"bottom"}
                overlay={
                  <Tooltip>
                    Click to toggle room status: active/inactive.
                  </Tooltip>
                }
              >
                <StyledNameTag onClick={handleActivatePlayer} size="lg">
                  <Badge bg="light" text="dark">
                    {player2}
                    <Badge
                      bg={updateStatusColor(player2Status)}
                      className={
                        "position-absolute top-0 start-100 translate-middle p-2 border border-light rounded-circle"
                      }
                    >
                      <span className="visually-hidden">Status</span>
                    </Badge>
                  </Badge>
                </StyledNameTag>
              </OverlayTrigger>
            ) : (
              <StyledNameTag size="lg" >
                <Badge bg="light" text="dark">
                  {player2}
                  <Badge
                    bg={updateStatusColor(player2Status)}
                    className={
                      "position-absolute top-0 start-100 translate-middle p-2 border border-light rounded-circle"
                    }
                  >
                    <span className="visually-hidden">Status</span>
                  </Badge>
                </Badge>
              </StyledNameTag>
            )}
          </Card.Title>
          { scoreData ? 
          (<StyledScorePlayer2 style={{float: "right"}}>{`Score: ${scoreData.player2}`}</StyledScorePlayer2>)
          :
          null }
        </StyledCard>
      </Stack>

      <Formik
        initialValues={{ choice: "" }}
        onSubmit={(values) => {
          if (!submitChoice) {
            toast("You chose: "+ values.choice);
            handleMakeChoice(values);
          }
        }}
      >
        {({ values }) => (
          <FormikForm>
            <Container style={{ width: "50rem", textAlign: "center" }}>
            <Button variant="primary" type="submit">Submit your choice</Button>
            
            <Container style={{ paddingTop: "1rem", paddingBottom: "1rem", borderTop: "solid", borderBottom: "solid", borderWidth: "thin" }}>
          <Field
            as={StyledChoiceButton}
            inline
            label={
              <div id="inline-radio-rock-icon-label">
                <div id="inline-radio-rock-label"><h5>{ROCK}</h5></div>
              <FontAwesomeIcon icon={["far", "hand-rock"]} size={iconSize} />
              </div>
            }
            name="choice"
            value={ROCK}
            type="radio"
            id="inline-radio-rock"
            className="btn-secondary btn-md btn"
            />

            <Field
            as={StyledChoiceButton}
            inline
            label={<div id="inline-radio-paper-icon-label">
              <div id="inline-radio-paper-label"><h5>{PAPER}</h5></div>
              <FontAwesomeIcon icon={["far", "hand"]} size={iconSize} />
              </div>
            }
            name="choice"
            value={PAPER}
            type="radio"
            id="inline-radio-paper"
            className="btn-secondary btn-md btn"
            />

            <Field
            as={StyledChoiceButton}
            inline
            label={
            <div id="inline-radio-scissors-icon-label">
              <div id="inline-radio-scissors-label"><h5>{SCISSORS}</h5></div>
              <FontAwesomeIcon
                icon={["far", "hand-scissors"]}
                size={iconSize}
              />
              </div>
            }
            name="choice"
            value={SCISSORS}
            type="radio"
            id="inline-radio-scissors"
            className="btn-secondary btn-md btn"
            />

          </Container>
          </Container>
          </FormikForm>
        )}
      </Formik>

      {player1 && player2 ? (
        <GameRoundsTableFromAPI 
          player1={player1} 
          player2={player2} 
          getData={roundsData} 
          getLoading={getRoundsLoading}
          getError={getRoundsError}
          />
      ) : null}
    </>
  );
}

export default GameRoom;
