import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_ANIMES } from './gql/AnimeQueries';
import Navivation from './components/Navigation';
import AnimeList from './components/AnimeList';
import MonthlySummary from './components/MonthlySummary';
import SeasonalSummary from './components/SeasonalSummary';
import Login from "./components/Login";
import 'bootstrap/dist/css/bootstrap.min.css';
import AnimeDataContext from './context/AnimeDataContext';
import { AuthenticationContext } from "./context/AuthenticationContext";
import { WindowSizeContext } from "./context/WindowSizeContext";
import { getUser, getToken, removeUserSession, useWindowSize } from "./utils/utils";
import './App.css';

function App() {
  // authentication related states
  const [authenticated, setAuthenticated] = useState(false);
  const [authenticating, setAuthenticating] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(getUser());
  const [token, setToken] = useState(getToken());

  // page status related states
  const [activePage, setActivePage] = useState("AnimeList")

  const { loading, error, data, refetch } = useQuery(GET_ANIMES);

  useEffect(() => {
    if (user != null && token != null) {
      setAuthenticated(true);
    }
  }, [user, token])

  const handleLogin = (event) => {
    event.preventDefault();
    fetch(`https://bangumi-ratings-server.com/authenticate?username=${username}&password=${password}`)
      .then(response => {
        const status = response.status;
        if (status === 200) {
          setAuthenticating(false);
          setAuthenticated(true);
        } else {
          alert("登录失败，请重试。");
        }
      })
      .catch(err => alert(err));
  }

  const handleSignOut = () => {
    setUser(null);
    setToken(null);
    removeUserSession();
    setAuthenticated(false);
  }

  const mainElement = (activePage) => {
    switch (activePage) {
      case 'AnimeList':
        return <AnimeList animesLoading={loading} loadError={error} refetchAnimes={refetch} />;
      case 'MonthlySummary':
        return <MonthlySummary />;
      case 'SeasonalSummary':
        return <SeasonalSummary />
      case 'GameList':
        return <></>;
      default:
        return <AnimeList />;
    }
  }

  return (
    <div>
      <div className="App">
        <WindowSizeContext.Provider value={{ windowSize: useWindowSize() }}>
          <AuthenticationContext.Provider value={{ username, password, authenticated, setAuthenticating, handleLogin, handleSignOut, setUsername, setPassword }}>
            <Navivation switchPage={setActivePage} />
            {authenticating ? <Login /> :
              <AnimeDataContext.Provider value={{
                animes: data === undefined ? [] : data.getAnimes
              }}>
                {mainElement(activePage)}
              </AnimeDataContext.Provider>
            }
          </AuthenticationContext.Provider>
        </WindowSizeContext.Provider>
      </div>
    </div>
  );
}

export default App;
