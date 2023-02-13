import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { Formik, Field, Form as FormikForm } from "formik";
import axios from "axios";
import { toast } from "react-toastify";

interface RegisterModalProps {
  show: boolean;
  setShow: (value: boolean | ((val: boolean) => boolean)) => void;
  setShowLoginModal: (value: boolean | ((val: boolean) => boolean)) => void;
}

export default function RegisterModal({ show, setShow, setShowLoginModal }: RegisterModalProps) {

  const registerFetch = async (values:{username:string; password: string;}) => {
      await axios
        .request({
          method: 'POST',
          url: 'http://localhost:5000/register',
          data: values
        })
      .then(function (response) {
        if (response.data.user > 0) { 
          toast(response.data.message + " Please login.");
          setShow(false);
          setShowLoginModal(true);
        };
      })
      .catch(function (error) {
        console.error(error);
        toast('Error registering.')
      });
  }
  
  const handleClose = () => {
    setShow(false);
  };

  return (
    <>
      <Formik
        initialValues={{ username: "", password: "" }}
        onSubmit={(values) => {
          registerFetch(values);
        }}
      >
        {({
          values
        }) => (
          <Modal show={show} onHide={handleClose}>
            <Modal.Header
              closeButton
              style={{ background: "var(--header-background)" }}
            >
              <Modal.Title style={{ color: "var(--primary" }}>
                Register
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
                    placeholder="Enter a username"
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
                    placeholder="Enter a password"
                    value={values.password}
                    type="password"
                  />
                </Form.Group>
                <Button type="submit" variant="primary">
                Register
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
