import React, { useState, useEffect } from 'react';
import * as Env from "./environments";
import Navivation from './components/Navigation';
import AnimeDataContext from './context/AnimeDataContext';
import AnimeList from './components/AnimeList';
import MonthlySummary from './components/MonthlySummary';
import Login from "./components/Login";
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthenticationContext } from "./context/AuthenticationContext";
import { sortList, getUser, getToken, setUserSession, removeUserSession } from "./utils/utils";
import Parse from 'parse';
import moment from 'moment';
import './App.css';

Parse.initialize(Env.APPLICATION_ID, Env.JAVASCRIPT_KEY);
Parse.serverURL = Env.SERVER_URL;

console.log(Parse.serverURL);

function App() {
  // authentication related states
  const [authenticated, setAuthenticated] = useState(false);
  const [authenticating, setAuthenticating] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(getUser());
  const [token, setToken] = useState(getToken());
  // page status related states
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [activePage, setActivePage] = useState("AnimeList")

  // data related states
  const [ratings, setRatings] = useState([]);
  const [summaries, setSummaries] = useState({});

  const fetchRatings = async () => {
    setIsLoading(true);
    const ratingsObj = Parse.Object.extend('Ratings');
    const query = new Parse.Query(ratingsObj);
    query.limit(1000);
    query.find().then((results) => {
      console.log("calling server");
      if (typeof document !== 'undefined'){
        const ratings = results.map((result) => {
          return {
            id: result.id,
            name: result.get("name"),
            year: result.get("year"),
            douban: result.get("douban"),
            tv_episodes: result.get("tv_episodes"),
            movies: result.get("movies"),
            episode_length: result.get("episode_length"),
            status: result.get("status"),
            genre: result.get("genre"),
            description: result.get("description"),
            story: result.get("story"),
            illustration: result.get("illustration"),
            music: result.get("music"),
            passion: result.get("passion"),
            rating: Number((result.get("story") + result.get("illustration") + result.get("music") + result.get("passion")).toFixed(1)),
            start_date: moment(result.get("start_date"), 'YYYY-MM-DD'),
            end_date: moment(result.get("end_date"), 'YYYY-MM-DD'),
            times_watched: result.get("times_watched"),
          }}
        );
        setRatings(sortList(ratings, "start_date"));
        setIsLoading(false);
      }
    }, (error) => {
      setIsLoading(false);
      setLoadError(true);
      console.error('Error while fetching ParseObjects', error);
    });
  };

  const submitNewRating = async (newRating) => {
    const RatingsObj = Parse.Object.extend('Ratings');
    const newRatingObj = new RatingsObj();
    for (const [key, value] of Object.entries(newRating)) {
      newRatingObj.set(key, value)
    }

    newRatingObj.save().then(
      (result) => {
        alert("已提交更新！");
        fetchRatings();
      },
      (error) => {
        alert("更新失败，请稍后重试。");
      }
    );
  };

  const updateRating = async (id, newRating) => {
    const ratingsObj = Parse.Object.extend('Ratings');
    const query = new Parse.Query(ratingsObj);
    query.get(id).then((object) => {
      for (const [key, value] of Object.entries(newRating)) {
        object.set(key, value)
      }
      object.save().then((response) => {
        alert("已提交更新！");
        fetchRatings();
      }, (error) => {
        alert("更新失败，请稍后重试。");
      });
    });
  };
  
  const deleteAnime = async (id) => {
    const ratingsObj = Parse.Object.extend('Ratings');
    const query = new Parse.Query(ratingsObj);
    query.get(id).then((object) => {
      object.destroy().then((response) => {
        alert("已删除番剧！");
        fetchRatings();
      }, (error) => {
        alert("删除失败，请稍后重试。");
      });
    });
  };

  useEffect(() => {
    fetchRatings();
  }, [])

  useEffect(() => {
    const tempSummaries = {};
    ratings.filter((rating) => rating.status === "已看").forEach((bangumi) => {
      let endMonth = moment(bangumi.end_date).format('YYYY-MM');
      if (!(endMonth in tempSummaries)) {
        tempSummaries[endMonth] = {
          bangumi_num: 0,
          tv_episode_num: 0,
          movie_num: 0,
          total_time: 0,
          daily_time: 0,
          bangumis: []
        };
      }
      tempSummaries[endMonth].bangumi_num += 1;
      tempSummaries[endMonth].bangumis.push(bangumi.name);
      tempSummaries[endMonth].tv_episode_num += bangumi.tv_episodes;
      tempSummaries[endMonth].movie_num += bangumi.movies;
      tempSummaries[endMonth].total_time += bangumi.tv_episodes * bangumi.episode_length + bangumi.movies * 90;
    });
    setSummaries(tempSummaries);
  }, [ratings])

  useEffect(() => {
    if (user != null && token != null) {
      setAuthenticated(true);
    }
  }, [user, token])

  const handleAnimeSubmit = (event, id, isNew) => {
    event.preventDefault();
    const formElements = event.target.elements;
    const newRating = {
      "name": formElements.name.value,
      "year": formElements.year.value,
      "douban": Number(formElements.douban.value),
      "tv_episodes": Number(formElements.tv_episodes.value),
      "movies": Number(formElements.movies.value),
      "episode_length": Number(formElements.episode_length.value),
      "status": formElements.status.value,
      "genre": formElements.genre.value,
      "description": formElements.description.value,
      "story": Number(formElements.story.value),
      "illustration": Number(formElements.illustration.value),
      "music": Number(formElements.music.value),
      "passion": Number(formElements.passion.value),
      "start_date": formElements.start_date.value,
      "end_date": formElements.end_date.value,
      "times_watched": Number(formElements.times_watched.value),
    };
    if (isNew) {
      submitNewRating(newRating);
    } else {
      updateRating(id, newRating);
    }
  };

  const handleLogin = (event) => {
    event.preventDefault();
    // Create a new instance of the user class
    Parse.User.logIn(username, password).then((user) => {
        setUserSession(user, user.getSessionToken());
        alert("欢迎，" + user.getUsername());
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
        return <AnimeList isLoading={isLoading} loadError={loadError} refresh={fetchRatings} onAnimeSubmit={handleAnimeSubmit} deleteAnime={deleteAnime}/>;
      case 'MonthlySummary':
        return <MonthlySummary />;
      default:
        return <AnimeList isLoading={isLoading} loadError={loadError} refresh={fetchRatings} onAnimeSubmit={handleAnimeSubmit} deleteAnime={deleteAnime}/>;
    }
  }

  return (
    <div>
      <div className="App">
        <AuthenticationContext.Provider value={{ username, password, authenticated, setAuthenticating, handleLogin, handleSignOut, setUsername, setPassword }}>
          <Navivation switchPage={setActivePage}/>
          {authenticating ? <Login /> :
            <AnimeDataContext.Provider value={{ ratings: ratings, summaries: summaries }}>
              {mainElement(activePage)}
            </AnimeDataContext.Provider>
          }
        </AuthenticationContext.Provider>
      </div>
    </div>
  );
}

export default App;
