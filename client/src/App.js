import React, { useContext, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import MainPage from './pages/MainPage';
import LoginPage from './pages/LoginPage';
import ErrorPage from './pages/ErrorPage';
import Menu from './components/Menu';
import ESportPage from './pages/ESportPage';
import MyGamesPage from './pages/MyGamesPage';
import ProfilePage from './pages/ProfilePage';
import { StoreContext } from './store/StoreProvider';

function App() {
  const { userData } = useContext(StoreContext);

  return (
    <Router>
      <div className='App'>
        <Menu />
        <Switch>
          <Route path='/' exact component={MainPage} />
          <Route path={`/my-games/${userData.nick}`} component={MyGamesPage} />
          <Route
            path={`/edit/profile/${userData.nick}`}
            component={ProfilePage}
          />
          <Route path={`/e-sport`} component={ESportPage} />
          <Route path='/' exact component={MainPage} />
          {userData && userData.isLogged && userData.auth ? (
            <Redirect to='/' />
          ) : (
            <Route path='/login' component={LoginPage} />
          )}
          <Route component={ErrorPage} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
