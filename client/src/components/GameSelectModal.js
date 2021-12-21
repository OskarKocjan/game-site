import Axios from "axios";
import React, { useContext, useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { StoreContext } from "../store/StoreProvider";
import "../styles/modal.scss";
// import { userData } from '../pages/LoginPage';

const BASE_URL = "http://localhost:8080";

const GameSelectModal = ({
  show,
  chosenGame,
  onHide,
  myGameLists,
  deleteFunc,
  contains,
}) => {
  console.log(myGameLists);

  const [devStatus, setDevStatus] = useState(true);
  const [publisherStatus, setPublisherStatus] = useState(true);
  const [devStatusText, setDevStatusText] = useState("none");
  const [publisherStatusText, setPublisherStatusText] = useState("none");

  useEffect(() => {
    setDevStatus(true);
    setPublisherStatus(true);
    setDevStatusText("none");
    setPublisherStatusText("none");
  }, [chosenGame]);

  const { userData } = useContext(StoreContext);
  const handleAdding = (table, name, image) => {
    Axios.post(`${BASE_URL}/add_game`, {
      img: image,
      title: name,
      status: "Played",
      rate: chosenGame.rating,
      nick: userData.nick,
      tableName: table,
      slug: name.replace(/\s/g, "-").toLowerCase(),
    }).then((res) => {
      console.log("handle Adding ");
      console.log(res.data);
      let tableNameGames;
      let objToPush = {};
      const { img, title, finalStatus, rate, tableName } = res.data;
      if (tableName === "games") tableNameGames = "myGames";

      if (tableName === "games" || tableName === "favourites") {
        objToPush = {
          image: img,
          title: title,
          status: finalStatus,
          rate: rate,
        };
      } else {
        objToPush = {
          image: img,
          name: title,
          slug: finalStatus,
          rate: rate,
        };
      }

      myGameLists[tableNameGames || tableName].push(objToPush);
    });
  };

  const addOrRemove = (table, name, image) => {
    let tableName;
    let item;
    if (table === "games") tableName = "myGames";
    console.log(table);
    if ((item = contains(myGameLists[tableName || table], name))) {
      deleteFunc(item, table[0].toUpperCase() + table.slice(1));
    } else {
      handleAdding(table, name, image);
    }
  };

  const changeState = (option) => {
    if (option === "dev") {
      setDevStatus(!devStatus);
      if (devStatus) {
        setDevStatusText("block");
      } else {
        setDevStatusText("none");
      }
    } else {
      setPublisherStatus(!publisherStatus);
      if (publisherStatus) {
        setPublisherStatusText("block");
      } else {
        setPublisherStatusText("none");
      }
    }
  };

  const ListOfprops = (props) => {
    return (
      <>
        {chosenGame[props].map((p) => (
          <li key={p.name}>{p.name}</li>
        ))}
      </>
    );
  };

  const ListOfpropsToSend = (props) => {
    return (
      <>
        {chosenGame[props].map((p) => (
          <li
            className="add_p"
            key={p.name}
            onClick={() => addOrRemove(props, p.name, p.image_background)}
          >
            {p.name}
          </li>
        ))}
      </>
    );
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="xl"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton className="modal-header">
        <Modal.Title id="contained-modal-title-vcenter" className="modal-title">
          {show && chosenGame.name}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="modal-body">
        {show && (
          <div className="content">
            <div className="row">
              <div className="col-3">
                <img
                  src={chosenGame.background_image}
                  alt=""
                  className="modal-img"
                />
                {userData.isLogged && (
                  <>
                    <p
                      className="add_p"
                      onClick={() =>
                        addOrRemove(
                          "games",
                          chosenGame.name,
                          chosenGame.background_image
                        )
                      }
                    >
                      {contains(myGameLists.myGames, chosenGame.name)
                        ? "Remove game from list"
                        : "Add to game list"}
                    </p>

                    <p className="add_p" onClick={() => changeState("dev")}>
                      Add to developer list
                    </p>
                    <div style={{ display: devStatusText }}>
                      {ListOfpropsToSend("developers")}
                    </div>
                    <p className="add_p" onClick={() => changeState("pub")}>
                      Add to publisher list
                    </p>
                    <div style={{ display: publisherStatusText }}>
                      {ListOfpropsToSend("publishers")}
                    </div>
                    <p
                      className="add_p"
                      onClick={() =>
                        addOrRemove(
                          "favourites",
                          chosenGame.name,
                          chosenGame.background_image
                        )
                      }
                    >
                      {contains(myGameLists.favourites, chosenGame.name)
                        ? "Remove game from favourites"
                        : "Add to game favourites"}
                    </p>
                  </>
                )}
                <p className="score">Score</p>
                <p className="p_rating">
                  <img
                    src="https://img.rawpixel.com/s3fs-private/rawpixel_images/website_content/icons-mint-individual-81_2.jpg?w=1000&dpr=1&fit=default&crop=default&q=65&vib=3&con=3&usm=15&bg=F4F4F3&ixlib=js-2.2.1&s=7a6bc3c6c3975085365c7f1fca7757b7"
                    alt="star"
                  />{" "}
                  {chosenGame.rating}
                </p>
              </div>
              <div className="col-9">
                <h4>Description</h4>
                <p>{chosenGame.description_raw}</p>
                <h4>Genres</h4>
                {ListOfprops("genres")}
                <h4>Developers</h4>
                {ListOfprops("developers")}
                <h4>Publishers</h4>
                {ListOfprops("publishers")}
                <h4>Released data</h4>
                <p>{chosenGame.released}</p>
                <h4>Available platforms</h4>
                {chosenGame.parent_platforms.map((p) => (
                  <li key={p.platform.name}>{p.platform.name}</li>
                ))}

                {chosenGame.website && (
                  <>
                    <h4>Website</h4>
                    <a href={chosenGame.website}> {chosenGame.website}</a>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal.Body>

      <Modal.Footer className="modal-footer">
        <Button onClick={onHide} className="close-button">
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default GameSelectModal;
