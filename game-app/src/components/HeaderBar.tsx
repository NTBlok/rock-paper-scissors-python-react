import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import RegisterModal from "./RegisterModal";
import LoginModal from "./LoginModal";
import styled from "styled-components";
import "../App.css";
import axios from "axios";
import { toast } from "react-toastify";

export const StyledBrand = styled(Navbar.Brand)`
  color: var(--primary-base);
  pointer-events: none !important;
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

export interface HeaderBarProps {
  showRegisterModal: boolean;
  setShowRegisterModal: (value: boolean | ((val: boolean) => boolean)) => void;
  showLoginModal: boolean;
  setShowLoginModal: (value: boolean | ((val: boolean) => boolean)) => void;
  token: string | null;
  removeToken: () => void;
  setToken: (props: string) => void;
  username: string | null;
  setUsername: (value: null | string | ((val: string |  null) => null | string)) => void;
}

export default function HeaderBar({
  showRegisterModal,
  setShowRegisterModal,
  showLoginModal,
  setShowLoginModal,
  token,
  removeToken,
  setToken,
  username,
  setUsername,
}: HeaderBarProps) {
  const logoutFetch = async () => {
    await axios
      .request({
        method: "POST",
        url: "http://localhost:5000/logout",
      })
      .then(function (response) {
        if (response.data.msg) {
          setUsername(null);
          removeToken();
          toast(response.data.msg);
        }
      });
  };

  const handleLogout = () => {
    logoutFetch();
  };

  const handleRegister = () => {
    setShowRegisterModal(true);
  };

  const handleLogin = () => {
    setShowLoginModal(true);
  };

  function stringAvatar(username: string) {
    return `${username[0].toUpperCase()}`;
  }

  return (
    <>
      <Navbar bg="dark" variant="light">
        <Container>
          <Row style={{ width: "100%" }}>
            <Col sm={8}>
              <StyledBrand style={{ borderBottom: "solid" }}>
                ROCK - PAPER - SCISSORS
              </StyledBrand>
            </Col>
            <Col sm={4}>
              <ButtonGroup style={{ float: "right" }}>
                {username ? (
                  <StyledAvatar>{stringAvatar(username)}</StyledAvatar>
                ) : null}

                <Button onClick={handleLogout}>Logout</Button>
                <Button onClick={handleLogin}>Login</Button>
                <Button onClick={handleRegister}>Register</Button>
              </ButtonGroup>
            </Col>
            <LoginModal
              show={showLoginModal}
              setShow={setShowLoginModal}
              setToken={setToken}
              setUsername={setUsername}
            ></LoginModal>
            <RegisterModal
              show={showRegisterModal}
              setShow={setShowRegisterModal}
              setShowLoginModal={setShowLoginModal}
            ></RegisterModal>
          </Row>
        </Container>
      </Navbar>
    </>
  );
}
