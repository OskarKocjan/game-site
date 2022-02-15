import eSportGameNames from '../data/e-sport';

const getAllNamesFromEsport = (what) => {
  let finalResult = [];

  eSportGameNames.forEach((element) => {
    finalResult.push(element[what]);
  });

  return finalResult;
};

const getAllNamesFromEsportString = (what) => {
  let finalResult = '(';
  let startArr = getAllNamesFromEsport(what);
  startArr.forEach((element) => {
    finalResult += element + '|';
  });
  finalResult = finalResult.slice(0, -1);
  finalResult += ')';

  return finalResult;
};

export { getAllNamesFromEsport, getAllNamesFromEsportString };
