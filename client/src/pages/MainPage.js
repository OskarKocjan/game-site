<<<<<<< HEAD
import { IconButton } from '@material-ui/core/';
import React, { useState, useRef, useCallback } from 'react';
import '../styles/mainPage.scss';
import '../styles/modal.scss';
import ResultsList from '../components/ResultsList';
import useGamesSearch from '../hooks/useGamesSearch';
import GameSelectModal from '../components/GameSelectModal';

const SearchInput = ({ gameTitle, handleGameSearch, resetInput }) => {
  return (
    <div className='search-bar-container'>
      <input
        className='search-bar'
        type='text'
        placeholder='Enter a game title...'
=======
import { IconButton } from "@material-ui/core/";
import React, { useState, useRef, useCallback, useContext } from "react";
import "../styles/mainPage.scss";
import "../styles/modal.scss";
import ResultsList from "../components/ResultsList";
import useGamesSearch from "../hooks/useGamesSearch";
import GameSelectModal from "../components/GameSelectModal";
import { StoreContext } from "../store/StoreProvider";
import useMyGamesInfo from "../hooks/useMyGamesInfo";

const SearchInput = ({ gameTitle, handleGameSearch, resetInput }) => {
  return (
    <div className="search-bar-container">
      <input
        className="search-bar"
        type="text"
        placeholder="Enter a game title..."
>>>>>>> b5bbabfe476bc05641b59fef4ec8da78140ba3a3
        value={gameTitle}
        onChange={handleGameSearch}
      />
      <IconButton
<<<<<<< HEAD
        aria-label='delete'
        color='primary'
        style={{ color: '#fff' }}
        onClick={resetInput}
      >
        {' '}
=======
        aria-label="delete"
        color="primary"
        style={{ color: "#fff" }}
        onClick={resetInput}
      >
        {" "}
>>>>>>> b5bbabfe476bc05641b59fef4ec8da78140ba3a3
        X
      </IconButton>
    </div>
  );
};

const MainPage = () => {
<<<<<<< HEAD
  const [gameTitle, setGameTitle] = useState('');
=======
  const [gameTitle, setGameTitle] = useState("");
>>>>>>> b5bbabfe476bc05641b59fef4ec8da78140ba3a3
  const [pageNubmer, setPageNumber] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [chosenGame, setChosenGame] = useState(null);

<<<<<<< HEAD
=======
  const { userData } = useContext(StoreContext);
  const {
    myGames,
    developers,
    publishers,
    favourites,
    handleDelete,
    containsObject,
  } = useMyGamesInfo(userData.nick, userData.isLogged);

>>>>>>> b5bbabfe476bc05641b59fef4ec8da78140ba3a3
  const { games, gamesDetails, isLoading, isError, hasMore } = useGamesSearch(
    gameTitle,
    pageNubmer
  );

  const observer = useRef();

  const lastGameElementRef = useCallback(
    (node) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNumber((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore]
  );

  const handleGameSearch = (e) => {
    setGameTitle(e.target.value);
    setPageNumber(1);
  };

  const handleModalHide = () => {
    setChosenGame(null);
    setShowModal(false);
  };

  const resetInput = () => {
<<<<<<< HEAD
    setGameTitle('');
  };

  return (
    <div className='main-content'>
=======
    setGameTitle("");
  };

  return (
    <div className="main-content">
>>>>>>> b5bbabfe476bc05641b59fef4ec8da78140ba3a3
      <SearchInput
        gameTitle={gameTitle}
        handleGameSearch={handleGameSearch}
        resetInput={resetInput}
      />

      <ResultsList
        games={gamesDetails}
        isLoading={isLoading}
        lastGameElementRef={lastGameElementRef}
        handleGameClick={() => setShowModal(true)}
        setChosenGame={setChosenGame}
      />

      <GameSelectModal
        show={showModal}
        chosenGame={chosenGame}
        onHide={handleModalHide}
<<<<<<< HEAD
      />

      <div className='loading-message'>{isLoading && 'Loading...'}</div>
      <div className='error-message'>
        {isError && 'Something went wrong :('}
=======
        myGameLists={{ myGames, developers, publishers, favourites }}
        deleteFunc={handleDelete}
        contains={containsObject}
      />

      <div className="loading-message">{isLoading && "Loading..."}</div>
      <div className="error-message">
        {isError && "Something went wrong :("}
>>>>>>> b5bbabfe476bc05641b59fef4ec8da78140ba3a3
      </div>
    </div>
  );
};

export default MainPage;
