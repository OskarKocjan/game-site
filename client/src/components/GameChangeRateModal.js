import axios from "axios";
import Axios from "axios";
import React, { useContext, useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { StoreContext } from "../store/StoreProvider";

const BASE_URL = "http://localhost:8080";

const GameChangeRateModal = ({
  show,
  chosenRecord,
  onHide,
  current,
  rate,
  changeScore,
}) => {
  const { userData } = useContext(StoreContext);
  const [rateTochange, setRateTochange] = useState(rate);
  console.log(current);
  useEffect(() => {
    setRateTochange(rate);
  }, [rate]);

  const handleChangeScore = () => {
    onHide();
    Axios.post(`${BASE_URL}/change_score`, {
      tableName: current.toLowerCase(),
      newRate: rateTochange,
      name: chosenRecord,
      nick: userData.nick,
    }).then((res) => {
      let { newRate, name } = res.data;
      changeScore(name, newRate);
    });
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="l"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton className="modal-header">
        <Modal.Title id="contained-modal-title-vcenter" className="modal-title">
          {show && chosenRecord}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="modal-body">
        <div className="change-rating">
          <img
            src="https://img.rawpixel.com/s3fs-private/rawpixel_images/website_content/icons-mint-individual-81_2.jpg?w=1000&dpr=1&fit=default&crop=default&q=65&vib=3&con=3&usm=15&bg=F4F4F3&ixlib=js-2.2.1&s=7a6bc3c6c3975085365c7f1fca7757b7"
            alt="star"
          />{" "}
          <span>{rateTochange}</span>
          <select
            id="add_anime_score"
            name="add_anime[score]"
            class="inputtext"
            value={rateTochange}
            onChange={(e) => {
              setRateTochange(parseFloat(e.target.value));
            }}
          >
            <option value={rateTochange}>Change score</option>{" "}
            <option value="5.0">(5.0) The Best</option>{" "}
            <option value="4.5">(4.5) Masterpiece</option>{" "}
            <option value="4.0">(4.0) Great</option>{" "}
            <option value="3.5">(3.5) Very Good</option>{" "}
            <option value="3.0">(3.0) Good</option>{" "}
            <option value="2.5">(2.5) Fine</option>{" "}
            <option value="2.0">(2.0) Average</option>{" "}
            <option value="1.5">(1.5) Bad</option>{" "}
            <option value="1.0">(1.0) Very Bad</option>{" "}
            <option value="0.5">(0.5) Horrible</option>{" "}
            <option value="0.0">(0) Appalling</option>
          </select>
        </div>
      </Modal.Body>
      <Modal.Footer className="modal-footer">
        <Button onClick={onHide} className="close-button">
          Close
        </Button>
        <Button
          className="btn btn-primary"
          onClick={() => {
            handleChangeScore();
          }}
        >
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default GameChangeRateModal;
