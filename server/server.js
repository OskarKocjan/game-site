const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const PORT = 8080 || process.env.PORT;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

/* local db */

const db = mysql.createConnection({
  host: process.env.LOCAL_DB_HOST,
  user: process.env.LOCAL_DB_USER,
  password: process.env.LOCAL_DB_PASSWORD,
  database: process.env.LOCAL_DB_NAME,
  multipleStatements: true,
});

/* remote db */
// const db = mysql.createConnection({
//   host: process.env.REMOTE_DB_HOST,
//   user: process.env.REMOTE_DB_USER,
//   password: process.env.REMOTE_DB_PASSWORD,
//   database: process.env.REMOTE_DB_NAME,
// });

// connect to the database
db.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log('Connected !');
  }
});

// endpoint responsible for user registration
app.post('/register', (req, res) => {
  console.log(req.body);

  const { email, nick, password } = req.body;

  const queryNick = 'SELECT * FROM users WHERE nick = ?';

  const queryEmail = 'SELECT * FROM users WHERE email = ?';

  const queryReg = 'INSERT INTO users (nick, email, password) VALUES (?,?,?)';

  db.query(queryNick, [nick], (errNick, resultNick) => {
    if (errNick) {
      res.send({ err: errNick });
    }
    if (resultNick.length > 0) {
      res.send({ message: 'Username already exists!' });
    } else {
      db.query(queryEmail, [email], (errEmail, resultEmail) => {
        if (errEmail) {
          res.send({ err: errEmail });
        }

        if (resultEmail.length > 0) {
          res.send({ message: 'Email already used!' });
        } else {
          bcrypt.hash(password, 10, (err, hashedPassword) => {
            console.log(password, hashedPassword);
            console.log(err);
            db.query(
              queryReg,
              [nick, email, hashedPassword],
              (errReg, resultReg) => {
                console.log(errReg);
                console.log(resultReg);
                res.send({ message: 'Succesfull registration!' });
              }
            );
          });
        }
      });
    }
  });
});

// endpoint responsible for user login
app.post('/login', (req, response) => {
  const { email, password } = req.body;

  const query = 'SELECT * FROM users WHERE email = ?';

  db.query(query, [email, password], (err, result) => {
    if (err) {
      res.send({ err: err });
      return;
    }

    bcrypt.compare(password, result[0].password, (err, res) => {
      if (res) {
        const id = result[0].id;
        const nick = result[0].nick;
        const token = jwt.sign({ id, nick }, process.env.JWT_SECRET_KEY, {
          expiresIn: 60 * 60 * 24,
        });

        response.send({
          auth: true,
          token: token,
          isLogged: true,
          nick: result[0].nick,
        });
      } else {
        response.send({
          auth: false,
          isLogged: false,
          message: 'Wrong username or password',
        });
      }
    });
  });
});

// endpoint responsible for adding game to user
app.post('/add_game', (req, res) => {
  console.log(req.body);
  const {
    gameImage,
    title,
    status,
    rate,
    nick,
    tableName,
    namePubOrDev,
    imagePubOrDev,
    slug,
  } = req.body;

  let finalName = title;
  let finalImg = gameImage;
  let finalStatus = status;

  const queryId = 'SELECT id FROM users WHERE nick = ?';

  let checkIfExist = 'SELECT * FROM Games WHERE users_id = ? AND title = ?';

  let insertGameQuery =
    'INSERT INTO Games (image, title, status, rate, users_id) VALUES (?,?,?,?,?)';

  if (tableName !== 'Games' && tableName !== 'favourites') {
    finalName = namePubOrDev;
    finalImg = imagePubOrDev;
    finalStatus = slug;

    checkIfExist = `SELECT * FROM ${tableName} WHERE users_id = ? AND name = ?`;

    insertGameQuery = `INSERT INTO ${tableName} (image, name, slug, rate, users_id) VALUES (?,?,?,?,?)`;
  } else if (tableName === 'favourites') {
    checkIfExist = 'SELECT * FROM favourites WHERE users_id = ? AND title = ?';
    insertGameQuery =
      'INSERT INTO favourites (image, title, status, rate, users_id) VALUES (?,?,?,?,?)';
  }
  db.query(queryId, [nick], (errId, resultId) => {
    db.query(
      checkIfExist,
      [resultId[0].id, finalName],
      (errCheck, resultCheck) => {
        if (resultCheck.length > 0) {
          console.log('Game already added');
          res.send();
        } else {
          db.query(
            insertGameQuery,
            [finalImg, finalName, finalStatus, rate, resultId[0].id],
            (errInsert, resultInsert) => {
              console.log(errInsert);
              console.log(resultInsert);
              res.send();
            }
          );
        }
      }
    );
  });
});

app.post('/delete', (req, res) => {
  const { table, id, name } = req.body;

  let deleteQuery = 'DELETE FROM Games WHERE title = ? and users_id = ?';
  if (table === 'favourites') {
    let deleteQuery = 'DELETE FROM favourites WHERE title = ? and users_id = ?';
  } else if (table === 'developers') {
    let deleteQuery = 'DELETE FROM developers WHERE name = ? and users_id = ?';
  } else if (table === 'publishers') {
    let deleteQuery = 'DELETE FROM developers WHERE name = ? and users_id = ?';
  }

  db.query(deleteQuery, [name, id], (errDelete, resultDelete) => {
    console.log(errInsert);
    console.log(resultInsert);
    res.send();
  });
});

// middleware for jwt authentication
const authenticate = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.status(401);

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) return res.status(403);

    req.user = user;
    next();
  });
};

// endpoint responsible for user auth after page refresh
app.get('/check/auth', authenticate, (req, res) => {
  res.send(req.user);
});

// endpoint responsible for getting user data
app.get('/user/:userNick', (req, res) => {
  const nick = req.params.userNick;
  const query = 'SELECT * FROM users WHERE nick = ?';
  db.query(query, [nick], (err, result) => {
    res.send(result);
  });
});

// endpoint responsible for getting user data
app.put('/user/:userNick', (req, res) => {
  const nick = req.params.userNick;
  const { nickToChange, userDescription, newPassword } = req.body;

  let query;
  let criteriaArray;

  if (Boolean(newPassword)) {
    query =
      'UPDATE users SET nick = ?, description = ?, password = ? WHERE nick = ?';

    bcrypt.hash(newPassword, 10, (err, newHashedPassword) => {
      db.query(
        query,
        [nickToChange, userDescription, newHashedPassword, nick],
        (errReg, resultReg) => {
          console.log(errReg);
          console.log(resultReg);
          res.status(204);
        }
      );
    });
  } else {
    query = 'UPDATE users SET nick = ?, description = ? WHERE nick = ?';
    criteriaArray = [nickToChange, userDescription, nick];

    db.query(query, criteriaArray, (err, result) => {
      if (err) {
        console.log(err);
        res.status(500);
      }
      if (result.changedRows === 0) {
        res.status(200).send({ message: 'User up to date' });
      } else {
        res.status(204).send({
          message: 'User succesfully updated',
          nick: nickToChange,
        });
      }
    });
  }
});

// endpoint responsible for checking if nick to be changed is not already used
app.get('/change/nick/:userNick', (req, res) => {
  const nick = req.params.userNick;
  const query = 'SELECT * FROM users WHERE nick = ?';
  db.query(query, [nick], (err, result) => {
    res.send(!Boolean(result.length));
  });
});

// endpoint responsible for checking while changing password if given old one is prope
app.post('/change/password/', (req, response) => {
  const { nick, oldPassword } = req.body;

  const query = 'SELECT * FROM users WHERE nick = ?';

  db.query(query, [nick], (err, result) => {
    if (err) {
      res.send({ err: err });
      return;
    }

    bcrypt.compare(oldPassword, result[0].password, (err, res) => {
      if (res) {
        response.send(true);
      } else {
        response.send(false);
      }
    });
  });
});

app.get('/my-games/:userNick', (req, res) => {
  const nick = req.params.userNick;
  const queryId = 'SELECT id FROM users WHERE nick = ?';

  const gamesQuery =
    'SELECT image, title, status, rate FROM Games WHERE users_id = ?;';
  const developersQuery =
    'SELECT image, name, slug, rate FROM developers WHERE users_id = ?;';
  const publishersQuery =
    'SELECT image, name, slug, rate FROM publishers WHERE users_id = ?;';

  const favouritesQuery =
    'SELECT image, title, status, rate FROM favourites WHERE users_id = ?';

  db.query(queryId, [nick], (errId, resultId) => {
    const whereArray = [
      resultId[0].id,
      resultId[0].id,
      resultId[0].id,
      resultId[0].id,
    ];

    db.query(
      gamesQuery + developersQuery + publishersQuery + favouritesQuery,
      whereArray,
      (error, results) => {
        if (error) {
          throw new Error();
        }

        res.send({
          games: results[0],
          developers: results[1],
          publishers: results[2],
          favourites: results[3],
        });
      }
    );
  });
});

// server listening on given PORT
app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`);
});
