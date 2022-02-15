import React, { useContext, useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import '../styles/modal.scss';

const SelectOptionModal = ({ show, chosenRecord, onHide }) => {
  const options = ['players', 'info', 'teams', 'leagues'];

  return (
    <Modal
      show={show}
      onHide={onHide}
      size='l'
      aria-labelledby='contained-modal-title-vcenter'
      centered
    >
      <Modal.Header closeButton className='modal-header'>
        <Modal.Title id='contained-modal-title-vcenter' className='modal-title'>
          {show && chosenRecord.name}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className='modal-body'>
        <div className='option-btns'>
          {show &&
            options.map((element) => {
              return (
                <NavLink
                  to={`/e-sport/${chosenRecord.slug}/${element}`}
                  onClick={onHide}
                  className='option-btn'
                >
                  {element}
                </NavLink>
              );
            })}
        </div>
      </Modal.Body>
      <Modal.Footer className='modal-footer'>
        <Button onClick={onHide} className='close-button'>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SelectOptionModal;
