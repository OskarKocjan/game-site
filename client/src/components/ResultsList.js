import React from 'react';
import { Col, Row, Container, Image } from 'react-bootstrap';
import defaultIcon from '../assets/game-pad.png';

const ResultsList = (props) => {
  const listOfGames = getGamesGrid(props);

  return (
    <div className='games-results-list'>
      {listOfGames.length === 0 && !props.isLoading ? (
        <div className='no-results-found'>No games found</div>
      ) : (
        <Container fluid>{listOfGames}</Container>
      )}
    </div>
  );
};

export default ResultsList;

const getGamesGrid = ({
  games,
  lastGameElementRef,
  handleGameClick,
  setChosenGame,
}) => {
  const gamesRows = games.map((game, idx) => {
    const miniature =
      game.image_url || game.img || game.background_image || defaultIcon;

    if (games.length === idx + 1) {
      return (
        <Col
          xl={3}
          lg={6}
          md={6}
          sm={6}
          className='games-col'
          key={game + idx}
          ref={lastGameElementRef}
          onClick={() => {
            setChosenGame(game);
            handleGameClick();
          }}
        >
          <div className='inner-col-wrapper'>
            <Image src={miniature} className='game-miniature' />
            <div className='game-title'>
              <h5>{game.name}</h5>
            </div>
          </div>
        </Col>
      );
    }

    return (
      <Col
        xl={3}
        lg={6}
        md={6}
        sm={6}
        className='games-col'
        key={game + idx}
        onClick={() => {
          setChosenGame(game);
          handleGameClick();
        }}
      >
        <div className='inner-col-wrapper'>
          <Image src={miniature} className='game-miniature' />
          <div className='game-title'>
            <h5>{game.name}</h5>
          </div>
        </div>
      </Col>
    );
  });

  let result = [];
  let row = [];

  for (let idx = 0; idx < gamesRows.length + 1; idx++) {
    if (idx !== 0 && idx % 4 === 0) {
      result.push(<Row key={`row no.${idx}`}>{row}</Row>);
      row = [];
    }

    row.push(gamesRows[idx]);
  }
  return result;
};
