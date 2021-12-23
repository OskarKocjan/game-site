import React, { useEffect, useContext, useState } from "react";
import gameImg from "../assets/game-pad.png";
import "../styles/myGames.scss";
import "../styles/modal.scss";
import Axios from "axios";
import { StoreContext } from "../store/StoreProvider";
import useMyGamesInfo from "../hooks/useMyGamesInfo";
import GameChangeRateModal from "../components/GameChangeRateModal";

const LIST_TYPE = {
  Games: "Games",
  Devs: "Developers",
  Publishers: "Publishers",
  Favourites: "Favourites",
};

const BASE_URL = "http://localhost:8080";

const MyGamesPage = () => {
  const { userData } = useContext(StoreContext);
  const { myGames, developers, publishers, favourites, handleDelete } =
    useMyGamesInfo(userData.nick, userData.isLogged);

  console.log(myGames);
  console.log(developers);

  useEffect(() => {
    console.log("game title changed");
  }, [myGames, developers, publishers, favourites]);
  const [current, setCurrent] = useState("Games");
  const [chosenRecord, setChosenRecord] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currRate, setCurrRate] = useState(0);

  const handleModalHide = () => {
    setChosenRecord(null);
    setCurrRate(0);
    setShowModal(false);
  };

  const prepareModal = (name, rate) => {
    setShowModal(true);
    setCurrRate(rate);
    setChosenRecord(name);
  };

  const findAndReplaceScore = (arr, title, score) => {
    let name;

    arr.forEach((element) => {
      name = element.title || element.name;
      if (name === title) {
        element.rate = score;
      }
    });
  };

  const changeScore = (title, score) => {
    switch (current) {
      case LIST_TYPE.Games:
        findAndReplaceScore(myGames, title, score);
      case LIST_TYPE.Devs:
        findAndReplaceScore(developers, title, score);
      case LIST_TYPE.Publishers:
        findAndReplaceScore(publishers, title, score);
      case LIST_TYPE.Favourites:
        findAndReplaceScore(favourites, title, score);
      default:
        return false;
    }
  };

  const listResult = (result) => {
    return result.map((item, idx) => {
      return (
        <div className="results-top-bar">
          <p className="results-game-num">{idx}</p>
          <p className="results-game-miniature">
            <button
              className="btn"
              onClick={() => {
                handleDelete(item, current);
              }}
            >
              x
            </button>
            <img src={item.image} alt="Game Miniature" />
          </p>
          <p className="results-title">{item.title || item.name}</p>
          <p className="results-game-status">{item.status || item.slug}</p>
          <p
            className="results-game-rate"
            onClick={() => prepareModal(item.title || item.name, item.rate)}
          >
            {item.rate}
          </p>
        </div>
      );
    });
  };

  const render = () => {
    switch (current) {
      case LIST_TYPE.Games:
        return listResult(myGames);
      case LIST_TYPE.Devs:
        return listResult(developers);
      case LIST_TYPE.Publishers:
        return listResult(publishers);
      case LIST_TYPE.Favourites:
        return listResult(favourites);
      default:
        return [];
    }
  };
  console.log(showModal);

  return (
    <div className="my-games-page-container">
      <GameChangeRateModal
        show={showModal}
        chosenRecord={chosenRecord}
        onHide={handleModalHide}
        current={current}
        rate={currRate}
        changeScore={changeScore}
      ></GameChangeRateModal>
      <div className="my-games-content">
        <div className="content-header">
          <div className="content-text">
            <p>Favourites</p>
          </div>

          <nav className="my-games-menu-list">
            <ul>
              <li onClick={(e) => setCurrent(e.target.innerText)}>
                {LIST_TYPE.Games}
              </li>
              <li onClick={(e) => setCurrent(e.target.innerText)}>
                {LIST_TYPE.Devs}
              </li>
              <li onClick={(e) => setCurrent(e.target.innerText)}>
                {LIST_TYPE.Publishers}
              </li>
              <li onClick={(e) => setCurrent(e.target.innerText)}>
                {LIST_TYPE.Favourites}
              </li>
            </ul>
          </nav>
        </div>

        <div className="chosen-section">
          <p>Games</p>
        </div>

        <div className="my-games-result">
          <div className="results-top-bar">
            <p className="results-game-num">#</p>
            <p className="results-game-miniature">Minature</p>
            <p className="results-title">
              {current === LIST_TYPE.Games || current === LIST_TYPE.Favourites
                ? "Title"
                : "Name"}
            </p>
            <p className="results-game-status">
              {current === LIST_TYPE.Games || current === LIST_TYPE.Favourites
                ? "Status"
                : "Slug"}
            </p>
            <p className="results-game-rate">Rate</p>
          </div>
          {render()}
        </div>
      </div>
    </div>
  );
};

export default MyGamesPage;
