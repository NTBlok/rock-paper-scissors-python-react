import React, { useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { Formik, Field, Form as FormikForm } from "formik";
import { useNavigate } from "react-router-dom";
import "../App.css";
import axios from "axios";
import { toast } from "react-toastify";
import { INACTIVE, ACTIVE } from "../common/Constants";
import socket from "../socket";


interface CreateRoomModalProps {
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
  setPlayer1Status: (
    value: string | ((val: string ) => string)
  ) => void;
  isConnected: boolean;
  setIsConnected: (value: boolean | ((val: boolean) => boolean)) => void;
}

export default function CreateRoomModal({
  token,
  show,
  setShow,
  username,
  playerN,
  setPlayerN,
  setPlayer1,
  setPlayer1Status,
  isConnected,
  setIsConnected
}: CreateRoomModalProps) {
  const navigate = useNavigate();

  const roomFetch = async (values: { username: string; opponent: string; }) => {
    await axios
      .request({
        method: "POST",
        url: "http://localhost:5000/room",
        headers: {
          Authorization: 'Bearer ' + token
        },
        data: values
      })
      .then(function (response) {
        if (response.data.room > 0) {
          setPlayerN("1");
          setPlayer1(values.username);
          socket.emit("join-player-1", {roomId: response.data.room});
          navigate(`/game-room/${response.data.room}`);
        };
      })
      .catch(function (error) {
        console.error(error);
        toast('Error creating room.')
      })
  };

  const handleClose = () => {
    setShow(false);
  };

  useEffect(() => {
    socket.on("connect", () => {
      setIsConnected(true);
      console.log("Client connected");
    });
    
    socket.on("joined-player-1", (roomSocket) => {
      setPlayer1Status(ACTIVE);
    })

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

  }, []);

  return (
    <>
      <Formik
        initialValues={{ username: username, opponent: "player" }}
        onSubmit={(values) => {
          roomFetch(values);
        }}
      >
        {({ values }) => (
          <Modal show={show} onHide={handleClose}>
            <Modal.Header
              closeButton
              style={{ background: "var(--header-background)" }}
            >
              <Modal.Title style={{ color: "var(--primary" }}>
                Create a Game Room
              </Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ background: "var(--primary-background-dark" }}>
              <FormikForm>
                <div className="mb-3">
                  <Field
                    as={Form.Check}
                    inline
                    checked={values.opponent === "player"}
                    label="Player vs Player"
                    name="opponent"
                    value="player"
                    type="radio"
                    id="inline-radio-player"
                    style={{color: "var(--text-light)"}}
                  />
                  <Field
                    as={Form.Check}
                    inline
                    label="Computer vs Player"
                    name="opponent"
                    value="computer"
                    type="radio"
                    id="inline-radio-computer"
                    style={{color: "var(--text-light)"}}
                  />
                </div>
                <Button variant="primary" type="submit">
                  Create Game Room
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
