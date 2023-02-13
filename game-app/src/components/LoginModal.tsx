import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { toast } from "react-toastify";
import { Formik, Field, Form as FormikForm } from "formik";
import axios from "axios";

interface LoginModalProps {
  show: boolean;
  setShow: (value: boolean | ((val: boolean) => boolean)) => void;
  setToken:  (props: string) => void;
  setUsername: (value: null | string | ((val: string |  null) => null | string)) => void;
}

export default function RegisterModal({ show, setShow, setToken, setUsername }: LoginModalProps) {
  
  const loginFetch = async (values: {
    username: string;
    password: string;
  }) => {
    await axios
      .request({
        method: 'POST',
        url: 'http://localhost:5000/login',
        data: values
      })
      .then(function (response) {
        setToken(response.data.token);
        setUsername(values.username);
        toast(response.data.message);
        setShow(false);
      })
      .catch(function (error) {
        console.error(error);
        toast('Error logging in.')
      })
  };

  const handleClose = () => {
    setShow(false);
  };

  return (
    <>
      <Formik
        initialValues={{ username: "", password: "" }}
        onSubmit={(values) => {
          loginFetch(values);
        }}
      >
        {({ values }) => (
          <Modal show={show} onHide={handleClose}>
            <Modal.Header
              closeButton
              style={{ background: "var(--header-background)" }}
            >
              <Modal.Title style={{ color: "var(--primary" }}>
                Login
              </Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ background: "var(--primary-background-dark" }}>
              <FormikForm>
                <Form.Group className="mb-3" controlId="formName">
                  <Form.Label style={{ color: "var(--primary-base" }}>
                    Username
                  </Form.Label>
                  <Field
                    as={Form.Control}
                    name="username"
                    placeholder="Enter your username"
                    value={values.username}
                    type="text"
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formName">
                  <Form.Label style={{ color: "var(--primary-base" }}>
                    Password
                  </Form.Label>
                  <Field
                    as={Form.Control}
                    name="password"
                    placeholder="Enter your password"
                    value={values.password}
                    type="password"
                  />
                </Form.Group>
                <Button variant="primary" type="submit">
                  Submit
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
