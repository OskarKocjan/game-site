import React, { useContext, useState, useEffect } from "react";
import { StoreContext } from "../store/StoreProvider";
import "../styles/profilePage.scss";
import * as Yup from "yup";
import { ErrorMessage, Formik } from "formik";
import Axios from "axios";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const BASE_URL = "https://game-site-api.vercel.app";

export default function ProfilePage() {
  const navigate = useNavigate();
  const { userData, setUserData, setUserJWT } = useContext(StoreContext);
  const [isModal, setIsModal] = useState(false);

  const [userDescription, setUserDescription] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [nickToChange, setNickToChange] = useState("");

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [passwordsErr, setPasswordsErr] = useState("");
  const [newNickErr, setNewNickErr] = useState("");

  useEffect(() => {
    setNickToChange(userData.nick);
    const fetchUserData = async () => {
      const { data } = await Axios.get(`${BASE_URL}/user/${userData.nick}`);
      const user = data[0];
      setUserDescription(user.description === null ? "" : user.description);
      setUserEmail(user.email);
      setNickToChange(user.nick);
    };
    fetchUserData();
  }, []);

  const validateUserData = async () => {
    // new nick validation
    if (
      nickToChange.length > 2 &&
      nickToChange.length < 30 &&
      nickToChange !== userData.nick
    ) {
      const res = await Axios.get(`${BASE_URL}/change/nick/${nickToChange}`);

      if (!res.data) {
        setNewNickErr("Given nick is already in use.");
        return false;
      }
    }

    // if old password is not empty
    if (Boolean(oldPassword) || Boolean(newPassword)) {
      try {
        const res = await Axios.post(`${BASE_URL}/change/password/`, {
          nick: userData.nick,
          oldPassword,
        });

        const isOldPasswordValid = res.data;

        if (!isOldPasswordValid) {
          setPasswordsErr("Old password in not correct");
          return false;
        }

        const isNewPasswordValid = Boolean(
          newPassword.match(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/
          )
        );

        if (isOldPasswordValid && newPassword !== oldPassword) {
          if (!isNewPasswordValid) {
            setPasswordsErr(
              "New password must containt at least one special character and case letter"
            );
            return false;
          }
        } else {
          setPasswordsErr("Passwords cannot be the same");
          return false;
        }
      } catch (err) {
        console.log(err);
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const profileFormIsValid = await validateUserData();

    if (profileFormIsValid) {
      setPasswordsErr("");
      setNewNickErr("");
      setIsModal(true);
    }
  };

  const handleSaveChanges = async () => {
    if (
      userData.nick !== nickToChange ||
      userData.description !== userDescription
    ) {
      const newUserData = {
        nickToChange,
        userDescription,
        newPassword,
      };

      setIsModal(false);
      localStorage.removeItem("token");
      setUserData({ auth: false, nick: "", isLogged: false });
      setUserJWT(null);
      setIsModal(false);

      navigate("/login");

      await Axios.put(`${BASE_URL}/user/${userData.nick}`, newUserData);
    }
  };

  return (
    <div className='profile-page-container'>
      <div className='profile-wrapper'>
        <h1 className='user-nick'>{`${userData.nick}'s profile`}</h1>

        <Form noValidate>
          <Form.Group as={Row} className='mb-3' controlId='formPlaintextEmail'>
            <Form.Label column md='3'>
              Registered on email:
            </Form.Label>
            <Col sm='5'>
              <Form.Control plaintext readOnly defaultValue={userEmail} />
            </Col>
          </Form.Group>

          <Form.Group className='mb-3' controlId='exampleForm.ControlTextarea1'>
            <Form.Label>Description</Form.Label>
            <Form.Control
              as='textarea'
              rows={5}
              style={{ resize: "none" }}
              placeholder='Tell something about you...'
              value={userDescription}
              onChange={(e) => setUserDescription(e.target.value)}
            />
          </Form.Group>

          <Form.Group className='mb-3' controlId='exampleForm.ControlInput1'>
            <Form.Label>Current nickname</Form.Label>
            <Form.Control
              type='text'
              value={nickToChange}
              onChange={(e) => setNickToChange(e.target.value)}
            />
            <p>{newNickErr}</p>
          </Form.Group>

          <Form.Group>
            <Form.Label>Old password</Form.Label>
            <Form.Control
              type='password'
              placeholder='Old password...'
              onChange={(e) => setOldPassword(e.target.value)}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>New password</Form.Label>
            <Form.Control
              type='password'
              placeholder='New password...'
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <p>{passwordsErr}</p>
          </Form.Group>
        </Form>

        <div className='submit-profile-change-wrapper'>
          <button
            variant='primary'
            type='submit'
            onClick={(e) => handleSubmit(e)}
          >
            Save
          </button>
        </div>
      </div>

      <Modal show={isModal} onHide={() => setIsModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Warning</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>Are you sure you want to save changes ?</p>
        </Modal.Body>

        <Modal.Footer>
          <Button variant='primary' onClick={() => handleSaveChanges()}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
