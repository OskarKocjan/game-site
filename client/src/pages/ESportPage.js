import { getContrastRatio, IconButton } from '@material-ui/core/';
import React, { useState, useEffect } from 'react';
import '../styles/mainPage.scss';
import '../styles/modal.scss';
import egames from '../data/e-sport';
import { Col, Row, Container, Image } from 'react-bootstrap';
import ResultsList from '../components/ResultsList';
import { useHistory } from 'react-router-dom';
import SelectOptionModal from '../components/SelectOptionModal';

const BASE_API_URL_ESPORT = 'https://api.pandascore.co/';

const ESportPage = () => {
  const [games, setGames] = useState([]);
  const [chosenGame, setChosenGame] = useState(null);
  const [showModal, setShowModal] = useState(null);

  const history = useHistory();

  useEffect(() => {
    setGames(egames);
  }, []);

  const handleModalHide = () => {
    setChosenGame(null);
    setShowModal(false);
  };

  const selectGame = (e) => {
    console.log(chosenGame);
  };

  return (
    <div className='main-content'>
      <ResultsList
        games={games}
        isLoading={true}
        handleGameClick={() => {
          setShowModal(true);
        }}
        setChosenGame={setChosenGame}
      />

      <SelectOptionModal
        show={showModal}
        chosenRecord={chosenGame}
        onHide={handleModalHide}
      ></SelectOptionModal>
    </div>
  );
};

export default ESportPage;
