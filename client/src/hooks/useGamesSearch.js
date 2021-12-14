import { useEffect, useState } from "react";
import axios from "axios";

const BASE_API_URL = "https://api.rawg.io/api/games";

const useGamesSearch = (gameName, pageNumber) => {

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [games, setGames] = useState([]);
  const [gamesDetails, setGamesDetails] = useState([])
  const [hasMore, setHasMore] = useState(true);


  const requestForNewGamesDetails = (foundGames) => {

    try {
      foundGames.map( async (game) => {
        const response = await axios.get(`${BASE_API_URL}/${game.slug}?key=${process.env.REACT_APP_API_TOKEN}`)
        setGamesDetails((prevGamesDetails) => {
          return [...new Set([...prevGamesDetails, response.data])];
        });
      })
      }catch(err){
        alert(err)
    }
  }

  useEffect(() => { setGamesDetails([]); }, [gameName]);

  useEffect(  () => {
    setIsLoading(true);
    setIsError(false);

    let cancel;

    axios({
      method: "GET",
      url: `${BASE_API_URL}`,
      params: {
        key: process.env.REACT_APP_API_TOKEN,
        search: gameName,
        page: pageNumber,
      },
      cancelToken: new axios.CancelToken((c) => (cancel = c)),
    })
      .then((res) => {
        const foundGames = res.data.results;
        const nextPage = res.data.next;

        requestForNewGamesDetails(foundGames);
        
        // setGames((prevGames) => {
        //   return [...new Set([...prevGames, ...foundGames])];
        // });
        
        setHasMore(nextPage !== null);
        setIsLoading(false);
      })
      .catch((err) => {
        if (axios.isCancel(err)) return;
        setIsError(true);
      });

    return () => cancel();
  }, [gameName, pageNumber]);


  return { games, gamesDetails ,isLoading, isError, hasMore };
};

export default useGamesSearch;
