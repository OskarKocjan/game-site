import React, { useEffect, useContext, useState } from 'react';
import gameImg from '../assets/game-pad.png';
import '../styles/myGames.scss';
import Axios from 'axios';
import { StoreContext } from '../store/StoreProvider';

const LIST_TYPE = {
  Games: 'Games',
  Devs: 'Developers',
  Publishers: 'Publishers',
  Favourites: 'Favourites',
};

const BASE_URL = 'http://localhost:8080';

const MyGamesPage = () => {
  const [games, setGamesDetails] = useState([]);
  const [developers, setDevelopers] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const [current, setCurrent] = useState('Games');
  const [favourites, setFavourites] = useState([]);

  const { userData } = useContext(StoreContext);

  useEffect(() => {
    Axios.get(`${BASE_URL}/my-games/${userData.nick}`).then((res) => {
      setGamesDetails(res.data.games);
      setDevelopers(res.data.developers);
      setPublishers(res.data.publishers);
      setFavourites(res.data.favourites);
    });
  }, []);

  const handleDelete = (item) => {
    console.log(item, current, userData.nick);
    Axios.post(`${BASE_URL}/delete`, {
      table: current.toLocaleLowerCase(),
      nick: userData.nick,
      name: item.title || item.name,
    }).then((res) => {
      console.log(res);
      const name = res.data.name;
      switch (current) {
        case LIST_TYPE.Games:
          setGamesDetails(filterOut(games, name));
          break;
        case LIST_TYPE.Devs:
          setDevelopers(filterOut(developers, name));
          break;
        case LIST_TYPE.Publishers:
          setPublishers(filterOut(publishers, name));
          break;
        case LIST_TYPE.Favourites:
          setFavourites(filterOut(favourites, name));
          break;
        default:
          console.log('nothing');
      }
    });
  };

  const filterOut = (array, name) => {
    return array.filter((item) => (item.title || item.name) !== name);
  };

  const listResult = (result) => {
    return result.map((item, idx) => {
      return (
        <div className='results-top-bar'>
          <p className='results-game-num'>{idx}</p>
          <p className='results-game-miniature'>
            <button
              className='btn'
              onClick={() => {
                handleDelete(item);
              }}
            >
              x
            </button>
            <img src={item.image} alt='Game Miniature' />
          </p>
          <p className='results-title'>{item.title || item.name}</p>
          <p className='results-game-status'>{item.status || item.slug}</p>
          <p className='results-game-rate'>{item.rate}</p>
        </div>
      );
    });
  };

  const render = () => {
    switch (current) {
      case LIST_TYPE.Games:
        return listResult(games);
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

  return (
    <div className='my-games-page-container'>
      <div className='my-games-content'>
        <div className='content-header'>
          <div className='content-text'>
            <p>Favourites</p>
          </div>

          <nav className='my-games-menu-list'>
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

        <div className='chosen-section'>
          <p>Games</p>
        </div>

        <div className='my-games-result'>
          <div className='results-top-bar'>
            <p className='results-game-num'>#</p>
            <p className='results-game-miniature'>Minature</p>
            <p className='results-title'>
              {current === LIST_TYPE.Games || current === LIST_TYPE.Favourites
                ? 'Title'
                : 'Name'}
            </p>
            <p className='results-game-status'>
              {current === LIST_TYPE.Games || current === LIST_TYPE.Favourites
                ? 'Status'
                : 'Slug'}
            </p>
            <p className='results-game-rate'>Rate</p>
          </div>
          {render()}
        </div>
      </div>
    </div>
  );
};

export default MyGamesPage;
