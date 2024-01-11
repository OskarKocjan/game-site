import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage";
import LoginPage from "./pages/LoginPage";
import ErrorPage from "./pages/ErrorPage";
import Menu from "./components/Menu";
import ESportPage from "./pages/ESportPage";
import MyGamesPage from "./pages/MyGamesPage";
import ProfilePage from "./pages/ProfilePage";
import { StoreContext } from "./store/StoreProvider";

const App = () => {
  const { userData } = useContext(StoreContext);

  return (
    <Router>
      <div className='App'>
        <Menu />
        <Routes>
          <Route path='/' exact='true' element={<MainPage />} />
          <Route
            path={`/my-games/${userData.nick}`}
            element={<MyGamesPage />}
          />
          <Route
            path={`/edit/profile/${userData.nick}`}
            element={<ProfilePage />}
          />
          {/* <Route
            path={`/e-sport/${getAllNamesFromEsportString(
              "slug"
            )}/(players|teams|leagues|info)`}
            element={<SelectedESportPage />}
          /> */}
          <Route path={`/e-sport`} element={<ESportPage />} />
          <Route path='/' exact='true' element={<MainPage />} />
          {userData && userData.isLogged && userData.auth ? (
            <Route path='/' exact='true' element={<MainPage />} />
          ) : (
            <Route path='/login' element={<LoginPage />} />
          )}
          <Route element={<ErrorPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
