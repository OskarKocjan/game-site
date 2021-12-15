const createInsertQuery = (table, columns) => {
  let valuesNames = '';
  let columnNames = '';

  columns.forEach((columnName) => {
    valuesNames += '?,';
    columnNames += columnName + ',';
  });

  valuesNames = valuesNames.slice(0, -1);
  columnNames = columnNames.slice(0, -1);

  return `INSERT INTO ${table} (${columnNames}) VALUES (${valuesNames});`;
};

const createUpdateQuery = (
  table,
  valuesToSet,
  conditions,
  conditionsValues,
  logicalOperators = []
) => {
  let valuesToSetNames = '';
  let afterWhereConditions = '';
  valuesToSet.forEach((valueName) => {
    valuesToSetNames += valueName + ' = ? ,';
  });

  valuesToSetNames = valuesToSetNames.slice(0, -1);

  for (let i = 0; i < conditions.length; i++) {
    afterWhereConditions += conditionsValues[i] + ' ' + conditions[i] + ' ? ';
    if (logicalOperators[i]) {
      afterWhereConditions += logicalOperators[i] + ' ';
    }
  }

  return `UPDATE ${table} SET ${valuesToSetNames}WHERE ${afterWhereConditions};`;
};

const createSelectQuery = (
  valuesToSelect,
  table,
  conditionsValues,
  conditions,
  logicalOperators = []
) => {
  let valuesToSelectNames = '';
  let afterWhereConditions = '';
  valuesToSelect.forEach((valueName) => {
    valuesToSelectNames += valueName + ',';
  });

  valuesToSelectNames = valuesToSelectNames.slice(0, -1);

  for (let i = 0; i < conditions.length; i++) {
    afterWhereConditions += conditionsValues[i] + ' ' + conditions[i] + ' ? ';
    if (logicalOperators[i]) {
      afterWhereConditions += logicalOperators[i] + ' ';
    }
  }

  return `SELECT ${valuesToSelectNames} FROM ${table} WHERE ${afterWhereConditions};`;
};

const createDeleteQuery = (
  table,
  conditionsValues,
  conditions,
  logicalOperators = []
) => {
  let afterWhereConditions = '';

  for (let i = 0; i < conditions.length; i++) {
    afterWhereConditions += conditionsValues[i] + ' ' + conditions[i] + ' ? ';
    if (logicalOperators[i]) {
      afterWhereConditions += logicalOperators[i] + ' ';
    }
  }

  return `DELETE FROM ${table} WHERE ${afterWhereConditions};`;
};

module.exports = {
  createInsertQuery,
  createUpdateQuery,
  createSelectQuery,
  createDeleteQuery,
};
