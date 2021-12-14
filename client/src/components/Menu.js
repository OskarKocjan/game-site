import React, { useContext } from 'react';
import '../styles/navMenu.scss';
import kite from '../assets/kite.png';
import { NavLink } from 'react-router-dom';
import { StoreContext } from '../store/StoreProvider';

const Logo = () => {
  return (
    <div className='site-logo'>
      <NavLink className='logo-link' to='/' exact>
        <span className='logo-text' style={{ textDecoration: 'none' }}>
          GamesKite
        </span>
        <img src={kite} className='logo-img' alt="kite-logo-image"/>
      </NavLink>
    </div>
  );
};

const LoginButton = ({ isUserLogged }) => {
  const setLoginButtonValue = isUserLogged ? 'Log out' : 'Login';
  const { setUserData, setUserJWT } = useContext(StoreContext);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUserData({ auth: false, nick: '', isLogged: false });
    setUserJWT(null);
  };

  if (!isUserLogged) {
    return (
      <NavLink className='logo-link' to='/login'>
        <div className='menu-button'>
          <span>{setLoginButtonValue}</span>
        </div>
      </NavLink>
    );
  } else {
    return (
      <button className='menu-button' onClick={handleLogout}>
        <span>{setLoginButtonValue}</span>
      </button>
    );
  }
};

const MenuButton = ({ innerText, route }) => {
  return (
    <NavLink className='logo-link' to={route}>
      <div className='menu-button'>
        <span>{innerText}</span>
      </div>
    </NavLink>
  );
};

const Menu = () => {
  const { userData } = useContext(StoreContext);

  return (
    <nav className='menu'>
      <Logo />
      <div className='menu-btns-wrapper'>
        {userData && userData.isLogged && userData.auth && (
          <>
            <MenuButton
              innerText='MyGames'
              route={`/my-games/${userData.nick}`}
            />
            <MenuButton
              innerText='Profile'
              route={`/edit/profile/${userData.nick}`}
            />
          </>
        )}
        <LoginButton isUserLogged={userData.isLogged} />
      </div>
    </nav>
  );
};

export default Menu;
