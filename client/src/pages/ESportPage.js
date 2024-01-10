import React, { useState, useEffect } from "react";
import "../styles/mainPage.scss";
import "../styles/modal.scss";
import egames from "../data/e-sport";
import ResultsList from "../components/ResultsList";
import SelectOptionModal from "../components/SelectOptionModal";

const BASE_API_URL_ESPORT = "https://api.pandascore.co/";

const ESportPage = () => {
  const [games, setGames] = useState([]);
  const [chosenGame, setChosenGame] = useState(null);
  const [showModal, setShowModal] = useState(null);

  useEffect(() => {
    setGames(egames);
  }, []);

  const handleModalHide = () => {
    setChosenGame(null);
    setShowModal(false);
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
