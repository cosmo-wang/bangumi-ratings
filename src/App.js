import React, { useState, useEffect } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import Parse from 'parse';
import * as Env from "./environments";
import Navivation from './components/Navigation';
import AnimeDataContext from './context/AnimeDataContext';
import AnimeList from './components/AnimeList';
import NewAnimeList from './components/NewAnimeList';
import MonthlySummary from './components/MonthlySummary';
import SeasonalSummary from './components/SeasonalSummary';
import Login from "./components/Login";
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthenticationContext } from "./context/AuthenticationContext";
import { getUser, getToken, setUserSession, removeUserSession, parseSeasonSchedules } from "./utils/utils";
import './App.css';

Parse.initialize(Env.APPLICATION_ID, Env.JAVASCRIPT_KEY);
Parse.serverURL = Env.SERVER_URL;

const GET_ALL_DATA = gql`
  query GetAllData {
    getAnimes {
      animeId,
      nameZh,
      nameJp,
      tvEpisodes,
      movies,
      episodeLength,
      status,
      genre,
      year,
      doubanRating,
      doubanLink,
      description,
      startDate,
      endDate,
      timesWatched,
      story,
      illustration,
      music,
      passion
    },
    getSeasonSchedules {
      animeId,
      nameZh,
      nameJp,
      status,
      genre,
      tvEpisodes,
      description,
      season,
      releaseDate,
      broadcastDay,
      rankings
    }
  }
`;

const UPDATE_OR_ADD_ANIME = gql`
  mutation UpdateOrAddAnime(
    $newData: UpdateOrAddAnimeInput!
  ) {
    updateOrAddAnime(newData: $newData) {
      anime {
        animeId,
        nameZh
      }
    }
  }
`;

const DELETE_ANIME = gql`
  mutation DeleteAnime($animeId: Int!) {
    deleteAnime(animeId: $animeId) {
      deletedAnimeNameZh
    }
  }
`;

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

const UPDATE_RANKINGS = gql`
  mutation UpdateRankings(
    $newRankings: UpdateRankingsInput!
  ) {
    updateRankings(newRankings: $newRankings) {
      seasonRankings {
        anime {
          nameZh
        }
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
  const { loading, error, data, refetch } = useQuery(GET_ALL_DATA);
  const [updateOrAddAnime] = useMutation(UPDATE_OR_ADD_ANIME, {
    refetchQueries: [
      GET_ALL_DATA
    ],
    onCompleted(resData) {
      alert(`已提交：${resData.updateOrAddAnime.anime.nameZh}`);
    },
    onError(updateError) {
      console.log(updateError);
      alert("更新失败，请稍后重试。");
    }
  });
  const [deleteAnime] = useMutation(DELETE_ANIME, {
    refetchQueries: [
      GET_ALL_DATA
    ],
    onCompleted(resData) {
      alert(`已删除：${resData.deleteAnime.deletedAnimeNameZh}`);
    },
    onError(updateError) {
      console.log(updateError);
      alert("删除失败，请稍后重试。");
    }
  });
  const [updateOrAddSeasonAnime] = useMutation(UPDATE_OR_ADD_SEASON_ANIME, {
    refetchQueries: [
      GET_ALL_DATA
    ],
    onCompleted(resData) {
      alert(`已提交：${resData.updateOrAddSeasonAnime.anime.nameZh}`);
    },
    onError(updateError) {
      console.log(updateError);
      alert("更新失败，请稍后重试。");
    }
  })
  const [updateRankings] = useMutation(UPDATE_RANKINGS, {
    refetchQueries: [
      GET_ALL_DATA
    ],
    onCompleted(resData) {
      alert("排名已更新！");
    },
    onError(updateError) {
      console.log(updateError);
      alert("更新失败，请稍后重试。");
    }
  })

  useEffect(() => {
    if (user != null && token != null) {
      setAuthenticated(true);
    }
  }, [user, token])

  const handleAnimeSubmit = (newAnimeData) => {
    delete newAnimeData['__typename'];
    updateOrAddAnime({ variables: {newData: newAnimeData}})
  };

  const handleNewAnimeSubmit = (event, animeId) => {
    event.preventDefault();
    const formElements = event.target.elements;
    const newData = {
      "nameZh": formElements.nameZh.value,
      "nameJp": formElements.nameJp.value,
      "tvEpisodes": Number(formElements.tvEpisodes.value),
      "genre": formElements.genre.value,
      "description": formElements.description.value,
      "releaseDate": formElements.releaseDate.value === "" ? null : formElements.releaseDate.value,
      "broadcastDay": formElements.broadcastDay.value,
      "season": formElements.season.value,
      "status": formElements[10].value,
    };
    if (animeId !== null) {
      newData['animeId'] = animeId;
    }
    updateOrAddSeasonAnime({ variables: {newData: newData}})
  };

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
        return <AnimeList
          isLoading={loading}
          loadError={error !== undefined}
          onAnimeSubmit={handleAnimeSubmit}
          deleteAnime={deleteAnime}
          refresh={refetch}
        />;
      case 'NewAnimeList':
        return <NewAnimeList
          isLoading={loading}
          loadError={error !== undefined}
          onAnimeSubmit={handleAnimeSubmit}
          onNewAnimeSubmit={handleNewAnimeSubmit}
          deleteAnime={deleteAnime}
          updateRankings={updateRankings}
          refresh={refetch}
        />
      case 'MonthlySummary':
        return <MonthlySummary />;
      case 'SeasonalSummary':
        return <SeasonalSummary />
      default:
        return <AnimeList
          isLoading={loading}
          loadError={error !== undefined}
          onAnimeSubmit={handleAnimeSubmit}
          deleteAnime={deleteAnime}
          refresh={refetch}
        />;
    }
  }

  return (
    <div>
      <div className="App">
        <AuthenticationContext.Provider value={{ username, password, authenticated, setAuthenticating, handleLogin, handleSignOut, setUsername, setPassword }}>
          <Navivation switchPage={setActivePage}/>
          {authenticating ? <Login /> :
            <AnimeDataContext.Provider value={{
              animes: data === undefined ? [] : data.getAnimes,
              newAnimes: data === undefined ? [] : parseSeasonSchedules(data.getSeasonSchedules)
            }}>
              {mainElement(activePage)}
            </AnimeDataContext.Provider>
          }
        </AuthenticationContext.Provider>
      </div>
    </div>
  );
}

export default App;
