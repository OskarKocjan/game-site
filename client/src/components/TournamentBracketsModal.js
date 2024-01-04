import React, { useContext, useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import '../styles/modal.scss';
import Axios from 'axios';
import { DateTime } from 'luxon';
import { Bracket, RoundProps } from 'react-brackets';

const BASE_API_URL_ESPORT = 'https://api.pandascore.co';

const TournamentBracketModal = ({ show, name, onHide, tournamentId }) => {
  const [data, setData] = useState(null);
  const [binaryTree, setBinaryTree] = useState(null);
  var binToArr = [];

  useEffect(() => {
    name &&
      Axios.get(
        `${BASE_API_URL_ESPORT}/tournaments/${tournamentId}/brackets?token=${process.env.REACT_APP_API_TOKEN_ESPORT}`
      ).then((res) => {
        setData(res.data);
        setBinaryTree(formatAsTree(res.data));
      });
  }, [name]);

  const sortInReverseChronologicalOrder = (matches) => {
    return matches.sort((matchA, matchB) => {
      return (
        DateTime.fromISO(matchB.scheduled_at).toMillis() -
        DateTime.fromISO(matchA.scheduled_at).toMillis()
      );
    });
  };

  const formatAsTree = (matches) => {
    // Sort matches for easier Finals access
    const orderedMatches = sortInReverseChronologicalOrder(matches);

    const findMatchById = (matchId) =>
      orderedMatches.find(({ id }) => id === matchId);

    const buildMatchTree = (match, previousType) => {
      if (!match) {
        return {};
      }
      const treeNode = {
        id: match.id,
        name: match.name,
        type: previousType,
      };
      // If the node represents a match loser, we should not continue building this branch
      // Because the match already appears in the winner bracket
      if (treeNode.type !== 'loser') {
        if (match.previous_matches.length) {
          treeNode.prevLeft = buildMatchTree(
            findMatchById(match.previous_matches[0].match_id),
            match.previous_matches[0].type
          );
        }
        if (match.previous_matches.length === 2) {
          treeNode.prevRight = buildMatchTree(
            findMatchById(match.previous_matches[1].match_id),
            match.previous_matches[1].type
          );
        }
      }
      return treeNode;
    };

    return buildMatchTree(orderedMatches[0]);
  };

  console.log('----------------------');
  console.log(binaryTree);
  console.log(data);
  console.log('----------------------');

  const fromTreeToBrackets = (i, treeNode) => {
    if (treeNode) {
      const { titleName, team1, team2 } = stringToArrBracket(treeNode.name);
      let objToAdd = {};
      if (!binToArr[i]) {
        binToArr = [
          ...binToArr,
          {
            title: titleName,
            seeds: [
              {
                id: treeNode.id,
                date: new Date().toDateString(),
                teams: [{ name: team1 }, { name: team2 }],
              },
            ],
          },
        ];
      } else {
        console.log('eloooooooooo');
        binToArr[i].seeds.push({
          id: treeNode.id,
          date: new Date().toDateString(),
          teams: [{ name: team1 }, { name: team2 }],
        });
      }
      i += 1;
      fromTreeToBrackets(i, treeNode.prevLeft);
      fromTreeToBrackets(i, treeNode.prevRight);
    }
  };

  const stringToArrBracket = (str) => {
    let arr1 = str.split(':');
    let arr2 = arr1[1].split('vs');
    const retObj = { titleName: arr1[0], team1: arr2[0], team2: arr2[1] };
    return retObj;
  };

  fromTreeToBrackets(1, binaryTree);
  console.log('$$$$$$$$$$$$$');
  console.log(binToArr);
  console.log('$$$$$$$$$$$$$');

  const Component = () => {
    return <Bracket rounds={binToArr} />;
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      size='xl'
      aria-labelledby='contained-modal-title-vcenter'
      centered
    >
      <Modal.Header closeButton className='modal-header'>
        <Modal.Title id='contained-modal-title-vcenter' className='modal-title'>
          {show && 'name'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className='modal-body-esport'>
        <Component></Component>
      </Modal.Body>
      <Modal.Footer className='modal-footer'>
        <Button onClick={onHide} className='close-button'>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TournamentBracketModal;
