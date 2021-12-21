import Axios from "axios";
import React, { useContext, useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { StoreContext } from "../store/StoreProvider";

const GameChangeRateModal = ({ show, chosenRecord, onHide, current, rate }) => {
  const { userData } = useContext(StoreContext);

  return (
    <Modal
      show={show}
      onHide={onHide}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton className="modal-header">
        <Modal.Title id="contained-modal-title-vcenter" className="modal-title">
          {show && chosenRecord}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="modal-body">
        <p>Rate: {rate}</p>
      </Modal.Body>
      <Modal.Footer className="modal-footer">
        <Button onClick={onHide} className="close-button">
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default GameChangeRateModal;
