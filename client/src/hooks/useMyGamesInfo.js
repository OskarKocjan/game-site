import React, { useEffect, useState } from "react";
import Axios from "axios";

const BASE_URL = "http://localhost:8080";

const LIST_TYPE = {
  Games: "Games",
  Devs: "Developers",
  Publishers: "Publishers",
  Favourites: "Favourites",
};

const useMyGamesInfo = (nick, isLogged) => {
  const [myGames, setMyGamesDetails] = useState([]);
  const [developers, setDevelopers] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const [favourites, setFavourites] = useState([]);

  useEffect(() => {
    if (isLogged) {
      Axios.get(`${BASE_URL}/my-games/${nick}`).then((res) => {
        setMyGamesDetails(res.data.games);
        setDevelopers(res.data.developers);
        setPublishers(res.data.publishers);
        setFavourites(res.data.favourites);
      });
    }
  }, []);

  const filterOut = (array, name) => {
    return array.filter((item) => (item.title || item.name) !== name);
  };

  const containsObject = (array, element) => {
    let searchedItem = false;
    array.forEach((item) => {
      if ((item.title || item.name) === element) {
        searchedItem = item;
      }
    });
    return searchedItem;
  };

  const handleDelete = (item, current) => {
    console.log(item, current, nick);
    Axios.post(`${BASE_URL}/delete`, {
      table: current.toLocaleLowerCase(),
      nick: nick,
      name: item.title || item.name,
    }).then((res) => {
      console.log(res);
      const name = res.data.name;
      switch (current) {
        case LIST_TYPE.Games:
          setMyGamesDetails(filterOut(myGames, name));
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
          console.log("nothing");
      }
    });
  };
  return {
    myGames,
    developers,
    publishers,
    favourites,
    handleDelete,
    containsObject,
  };
};
export default useMyGamesInfo;
