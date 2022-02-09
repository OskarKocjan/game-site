import { IconButton } from '@material-ui/core/';
import React, { useState, useEffect } from 'react';
import '../styles/mainPage.scss';
import '../styles/modal.scss';
import egames from '../data/e-sport';
import { Col, Row, Container, Image } from 'react-bootstrap';
import ResultsList from '../components/ResultsList';

const BASE_API_URL_ESPORT = 'https://api.pandascore.co/';

const ESportPage = () => {
  const [games, setGames] = useState([]);

  useEffect(() => {
    setGames(egames);
  }, []);

  return (
    <div className='main-content'>
      <ResultsList games={games} />;
    </div>
  );
};

export default ESportPage;
