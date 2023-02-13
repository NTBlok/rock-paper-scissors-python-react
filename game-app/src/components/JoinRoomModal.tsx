import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import "../App.css";
import { Formik, Field, Form as FormikForm } from "formik";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { ACTIVE, INACTIVE } from "../common/Constants";
import socket from "../socket";

interface JoinRoomModalProps {
  token: string;
  show: boolean;
  setShow: (value: boolean | ((val: boolean) => boolean)) => void;
  username: string;
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
  setPlayer1Status: (
    value: string | ((val: string) => string)
  ) => void;
  setPlayer2Status: (
    value: null | string | ((val: null | string) => null | string)
  ) => void;
  isConnected: boolean;
  setIsConnected: (value: boolean | ((val: boolean) => boolean)) => void;
}

export default function JoinRoomModal({ 
  token,
  show, 
  setShow,
  username,
  playerN,
  setPlayerN,
  setPlayer1,
  setPlayer2,
  player1Status,
  setPlayer1Status,
  setPlayer2Status,
  isConnected,
  setIsConnected
}: JoinRoomModalProps) {
  const navigate = useNavigate();
  const [room, setRoom] = useState("0");
  
  const roomPatch = async (values: { room: string; username: string; }) => {
    await axios
      .request({
        method: "PATCH",
        url: `http://localhost:5000/room/${values.room}`,
        headers: {
          Authorization: 'Bearer ' + token
        },
        data: values
      })
      .then(function (response) {
          setPlayerN("2");
          setPlayer2(values.username);
          setPlayer1(response.data.player1);
          setPlayer1Status(response.data["player1_status"]);
          socket.emit("join-player-2", {roomId: values.room, player2: values.username})
          navigate(`/game-room/${values.room}`);
      })
      .catch(function (error) {
        console.error(error);
        toast('Error joining room.')
      })
  };

  const handleClose = () => {
    console.log("close modal");
    setShow(false);
  };
  
  useEffect(() => {
    if (!isConnected) socket.on("connect", () => {
      setIsConnected(true);
      console.log("Client connected");
    });
    
    socket.on("joined-player-2", (roomSocket) => {
      setPlayer2Status(ACTIVE);
    })

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

  }, []);

  return (
    <>
      <Formik
        initialValues={{ username: username, room: "" }}
        onSubmit={(values) => {
          setRoom(values.room);
          roomPatch(values);
        }}
      >
        {({ values }) => (
          <Modal show={show} onHide={handleClose}>
            <Modal.Header
              closeButton
              style={{ background: "var(--header-background)" }}
            >
              <Modal.Title style={{ color: "var(--secondary" }}>
                Join a Game Room
              </Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ background: "var(--primary-background-dark" }}>
              <FormikForm>
                <Form.Group className="mb-3" controlId="roomId">
                  <Form.Label style={{ color: "var(--secondary" }}>
                    Room ID
                  </Form.Label>
                  <Field 
                  as={Form.Control}
                  placeholder="Enter the room ID" 
                  name="room"
                  value={values.room}
                  type="text"
                  />
                </Form.Group>
                <Button variant="primary" type="submit">
                  Join Game Room
                </Button>
              </FormikForm>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        )}
      </Formik>
    </>
  );
}
