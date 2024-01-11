// import React, { useContext, useState, useEffect } from 'react';
// import Axios from 'axios';
// import ResultsList from '../components/ResultsList';
// import TournamentBracketModal from '../components/TournamentBracketsModal';

// const BASE_API_URL_ESPORT = 'https://api.pandascore.co';

// const SelectedEsportPage = () => {
//   const url = window.location.pathname;

//   const [option, setOption] = useState(null);
//   const [chosenGame, setChosenGame] = useState(null);
//   const [optionData, setOptionData] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [chosenRecord, setChosenRecord] = useState(null);

//   useEffect(() => {
//     let arrUrl = url.split('/');
//     setOption(() => {
//       return arrUrl.at(-1);
//     });
//     setChosenGame(() => {
//       return arrUrl.at(-2);
//     });
//   }, []);

//   const handleModalHide = () => {
//     setChosenRecord(null);
//     setShowModal(false);
//   };

//   useEffect(() => {
//     console.log(chosenGame);
//     if (chosenGame) {
//       Axios.get(
//         `${BASE_API_URL_ESPORT}/${chosenGame}/${option}?token=${process.env.REACT_APP_API_TOKEN_ESPORT}`
//       ).then((res) => {
//         console.log(res.data);
//         setOptionData(res.data);
//       });
//     }
//   }, [chosenGame]);

//   console.log(chosenRecord);

//   if (optionData) {
//     return (
//       <div className='main-content'>
//         {' '}
//         <ResultsList
//           games={optionData}
//           isLoading={true}
//           handleGameClick={() => setShowModal(true)}
//           setChosenGame={setChosenRecord}
//         />
//         {chosenRecord && (
//           <TournamentBracketModal
//             show={showModal}
//             onHide={handleModalHide}
//             name={chosenRecord.name}
//             tournamentId={chosenRecord.id}
//           />
//         )}
//       </div>
//     );
//   } else {
//     return <div>Loading</div>;
//   }
// };

// export default SelectedEsportPage;
