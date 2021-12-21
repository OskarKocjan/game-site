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
        value={gameTitle}
        onChange={handleGameSearch}
      />
      <IconButton
        aria-label="delete"
        color="primary"
        style={{ color: "#fff" }}
        onClick={resetInput}
      >
        {" "}
        X
      </IconButton>
    </div>
  );
};

const MainPage = () => {
  const [gameTitle, setGameTitle] = useState("");
  const [pageNubmer, setPageNumber] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [chosenGame, setChosenGame] = useState(null);

  const { userData } = useContext(StoreContext);
  const {
    myGames,
    developers,
    publishers,
    favourites,
    handleDelete,
    containsObject,
  } = useMyGamesInfo(userData.nick);

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
    setGameTitle("");
  };

  return (
    <div className="main-content">
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
        myGameLists={{ myGames, developers, publishers, favourites }}
        deleteFunc={handleDelete}
        contains={containsObject}
      />

      <div className="loading-message">{isLoading && "Loading..."}</div>
      <div className="error-message">
        {isError && "Something went wrong :("}
      </div>
    </div>
  );
};

export default MainPage;
