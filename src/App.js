import React, { useState, useEffect } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import Parse from 'parse';
import * as Env from "./environments";
import Navivation from './components/Navigation';
import List from './components/List';
import AnimeList from './components/AnimeList';
import MonthlySummary from './components/MonthlySummary';
import SeasonalSummary from './components/SeasonalSummary';
import Login from "./components/Login";
import 'bootstrap/dist/css/bootstrap.min.css';
import AnimeDataContext from './context/AnimeDataContext';
import { AuthenticationContext } from "./context/AuthenticationContext";
import { WindowSizeContext } from "./context/WindowSizeContext";
import { getUser, getToken, setUserSession, removeUserSession, parseSeasonSchedules, useWindowSize } from "./utils/utils";
import './App.css';

Parse.initialize(Env.APPLICATION_ID, Env.JAVASCRIPT_KEY);
Parse.serverURL = Env.SERVER_URL;




const UPDATE_OR_ADD_SEASON_ANIME = gql`
  mutation UpdateOrAddSeasonAnime(
    $newData: UpdateOrAddSeasonAnimeInput!
  ) {
    updateOrAddSeasonAnime(newData: $newData) {
      anime {
        animeId,
        nameZh
      }
    }
  }
`;


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

  // data related states
  

  useEffect(() => {
    if (user != null && token != null) {
      setAuthenticated(true);
    }
  }, [user, token])

  

  // const handleNewAnimeSubmit = (event, id) => {
  //   event.preventDefault();
  //   const formElements = event.target.elements;
  //   const newData = {
  //     "nameZh": formElements.nameZh.value,
  //     "nameJp": formElements.nameJp.value,
  //     "tvEpisodes": Number(formElements.tvEpisodes.value),
  //     "genre": formElements.genre.value,
  //     "description": formElements.description.value,
  //     "releaseDate": formElements.releaseDate.value === "" ? null : formElements.releaseDate.value,
  //     "broadcastDay": formElements.broadcastDay.value,
  //     "season": formElements.season.value,
  //     "status": formElements[10].value,
  //   };
  //   if (id !== null) {
  //     newData['id'] = id;
  //   }
  //   updateOrAddSeasonAnime({ variables: {newData: newData}})
  // };

  const handleLogin = (event) => {
    event.preventDefault();
    // Create a new instance of the user class
    Parse.User.logIn(username, password).then((user) => {
        setUserSession(user, user.getSessionToken());
        setAuthenticating(false);
        setAuthenticated(true);
    }).catch(function(error){
        alert(error.message);
    });
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
        return <AnimeList />;
      // case 'NewAnimeList':
      //   return <NewAnimeList
      //     isLoading={loading}
      //     loadError={error !== undefined}
      //     onAnimeSubmit={handleAnimeSubmit}
      //     onNewAnimeSubmit={handleNewAnimeSubmit}
      //     deleteAnime={deleteAnime}
      //     updateRankings={updateRankings}
      //     refresh={refetch}
      //   />
      case 'MonthlySummary':
        return <MonthlySummary />;
      case 'SeasonalSummary':
        return <SeasonalSummary />
      case 'GameList':
        return <List />
      default:
        return <AnimeList />;
    }
  }

  return (
    <div>
      <div className="App">
        <WindowSizeContext.Provider value={{windowSize: useWindowSize()}}>
          <AuthenticationContext.Provider value={{ username, password, authenticated, setAuthenticating, handleLogin, handleSignOut, setUsername, setPassword }}>
            <Navivation switchPage={setActivePage}/>
            {authenticating ? <Login /> :
              <AnimeDataContext.Provider value={{
                // animes: data === undefined ? [] : data.getAnimes,
                // newAnimes: data === undefined ? [] : parseSeasonSchedules(data.getSeasonSchedules)
                newAnimes: []
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
