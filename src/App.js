import React, { useState, useEffect } from 'react';
import * as Env from "./environments";
import Navivation from './components/Navigation';
import AnimeDataContext from './context/AnimeDataContext';
import AnimeList from './components/AnimeList';
import NewAnimeList from './components/NewAnimeList';
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
  const [newAnimes, setNewAnimes] = useState([]);
  const [summaries, setSummaries] = useState({});
  const [quotes, setQuotes] = useState([]);

  const fetchRatingsPostgres = async () => {
    console.log("calling postgres server for ratings");
    setIsLoading(true);
    fetch("http://localhost:3001/ratings")
        .then(res => res.json())
        .then(
            (result) => {
                result.forEach(rating => {
                    rating.start_date = moment(rating.start_date, 'YYYY-MM-DD')
                    rating.end_date = moment(rating.end_date, 'YYYY-MM-DD')
                })
                setRatings(sortList(result, "start_date"));
                setIsLoading(false);
            },
            (error) => {
                setIsLoading(false);
                setLoadError(true);
                console.error('Error while fetching ratings', error);
            })
  }

  const fetchQuotesPostgres = async () => {
    console.log("calling postgres server for quotes");
    fetch("http://localhost:3001/quotes")
        .then(res => res.json())
        .then(
            (result) => {
                setQuotes(result);
            },
            (error) => {
                setLoadError(true);
                console.error('Error while fetching quotes', error);
            })
  }

  const fetchNewAnimesPostgres = async () => {
    console.log("calling postgres server for new animes");
    setIsLoading(true);
    fetch("http://localhost:3001/new_animes")
        .then(res => res.json())
        .then(
            (result) => {
                setNewAnimes(result);
                setIsLoading(false);
            },
            (error) => {
                setIsLoading(false);
                setLoadError(true);
                console.error('Error while fetching new animes', error);
            })
  }

  const submitAnimePostgres = async (animeData, isOldAnime) => {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(animeData)
    };
    fetch(`http://localhost:3001/add_anime?type=${isOldAnime ? 'old' : 'new'}`, requestOptions)
        .then(res => {
            if (res.status === 400) {
                alert("番剧《" + animeData.name + "》已存在！请勿重复添加番剧！")
            } else if (!res.ok) {
                alert("更新失败，请稍后重试。");
            } else {
                alert("已提交番剧信息！");
                if (isOldAnime) {
                    fetchRatingsPostgres();
                } else {
                    fetchNewAnimesPostgres();
                }
            }
        })
  }

  const submitQuotePostgres = async (newQuote) => {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newQuote)
    };
    fetch('http://localhost:3001/add_quote', requestOptions)
        .then(res => {
            if (res.ok) {
                alert("已添加语录！");
                fetchQuotesPostgres();
            } else {
                alert("添加失败，请稍后重试。");
            }
        })
  }

  const updateAnimePostgres = async (id, animeData, isOldAnime) => {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(animeData)
    };
    fetch(`http://localhost:3001/update_anime?id=${id}&type=${isOldAnime ? 'old' : 'new'}`, requestOptions)
        .then(res => {
            if (res.ok) {
                alert("已更新番剧信息！");
                if (isOldAnime) {
                    fetchRatingsPostgres();
                } else {
                    fetchNewAnimesPostgres();
                }
            } else {
                alert("更新失败，请稍后重试。");
            }
        })
  }

  const updateQuotePostgres = async (id, quoteData) => {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quoteData)
    };
    fetch(`http://localhost:3001/update_quote?id=${id}`, requestOptions)
        .then(res => {
            if (res.ok) {
                alert("已更新语录！");
                fetchQuotesPostgres();
            } else {
                alert("更新失败，请稍后重试。");
            }
        })
  }

  const updateNewAnimesRankingsPostgres = async (newRankings) => {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRankings)
    };
    fetch(`http://localhost:3001/update_rankings`, requestOptions)
        .then(res => {
            if (res.ok) {
                alert("已更新排名！");
                fetchNewAnimesPostgres();
            } else {
                alert("更新排名失败。");
            }
        })
  }

  const deleteAnimePostgres = async (id, isOldAnime) => {
    fetch(`http://localhost:3001/anime?id=${id}&type=${isOldAnime ? 'old' : 'new'}`, {
        method: 'DELETE',
        mode: 'cors'
    }).then(res => {
        if (res.ok) {
            alert("已删除番剧！");
            if (isOldAnime) {
                fetchRatingsPostgres();
            } else {
                fetchNewAnimesPostgres();
            }
        } else {
            alert("删除失败，请稍后重试。");
        }
    })
  }

  const deleteQuotePostgres = async (id) => {
    fetch(`http://localhost:3001/quote?id=${id}`, {
        method: 'DELETE',
        mode: 'cors'
    }).then(res => {
        if (res.ok) {
            alert("已删除语录！");
            fetchQuotesPostgres();
        } else {
            alert("删除失败，请稍后重试。");
        }
    })
  }

  useEffect(() => {
    fetchRatingsPostgres();
    fetchNewAnimesPostgres();
    fetchQuotesPostgres();
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
          bangumis: [],
          quotes: [],
        };
      }
      tempSummaries[endMonth].bangumi_num += 1;
      tempSummaries[endMonth].bangumis.push(bangumi.name);
      tempSummaries[endMonth].tv_episode_num += bangumi.tv_episodes;
      tempSummaries[endMonth].movie_num += bangumi.movies;
      tempSummaries[endMonth].total_time += bangumi.tv_episodes * bangumi.episode_length + bangumi.movies * 90;
    });
    quotes.forEach((quote) => {
      let month = moment(quote.month).format('YYYY-MM');
      if (month in tempSummaries) {
        tempSummaries[month].quotes.push(quote);
      }
    });
    setSummaries(tempSummaries);
  }, [ratings, quotes])

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
      "douban_ratings": Number(formElements.douban_ratings.value),
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
      submitAnimePostgres(newRating, true);
    } else {
      updateAnimePostgres(id, newRating, true);
    }
  };

  const handleNewAnimeSubmit = (event, id, isNew) => {
    event.preventDefault();
    const formElements = event.target.elements;
    const newAnime = {
      "name": formElements.name.value,
      "tv_episodes": Number(formElements.tv_episodes.value),
      "genre": formElements.genre.value,
      "description": formElements.description.value,
      "release_date": formElements.release_date.value,
      "broadcast_day": formElements.broadcast_day.value,
      "seasons": formElements.seasons.value,
      "status": formElements.status.value,
    };
    if (isNew) {
      submitAnimePostgres(newAnime, false);
    } else {
      updateAnimePostgres(id, newAnime, false);
    }
  };

  const handleQuoteSubmit = (event, month, id, isNew) => {
    event.preventDefault();
    const formElements = event.target.elements;
    const newQuote = {
      "month": month,
      "content": formElements.content.value,
      "zh_translations": formElements.zh_translations.value,
      "person": formElements.person.value,
      "anime_name": formElements.anime_name.value,
    };
    if (isNew) {
        submitQuotePostgres(newQuote);
    } else {
        updateQuotePostgres(id, newQuote);
    }
  }

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
        return <AnimeList
          isLoading={isLoading}
          loadError={loadError}
          refresh={fetchRatingsPostgres}
          onAnimeSubmit={handleAnimeSubmit}
          deleteAnime={deleteAnimePostgres}
        />;
      case 'NewAnimeList':
        return <NewAnimeList
          isLoading={isLoading}
          loadError={loadError}
          refresh={fetchNewAnimesPostgres}
          onAnimeSubmit={handleAnimeSubmit}
          onNewAnimeSubmit={handleNewAnimeSubmit}
          updateEntry={updateAnimePostgres}
          deleteNewAnime={deleteAnimePostgres}
          updateNewAnimesRankings={updateNewAnimesRankingsPostgres}
        />
      case 'MonthlySummary':
        return <MonthlySummary
          onQuoteSubmit={handleQuoteSubmit}
          deleteQuote={deleteQuotePostgres}
        />;
      default:
        return <AnimeList
          isLoading={isLoading}
          loadError={loadError}
          refresh={fetchRatingsPostgres}
          onAnimeSubmit={handleAnimeSubmit}
          deleteAnime={deleteAnimePostgres}
        />;
    }
  }

  return (
    <div>
      <div className="App">
        <AuthenticationContext.Provider value={{ username, password, authenticated, setAuthenticating, handleLogin, handleSignOut, setUsername, setPassword }}>
          <Navivation switchPage={setActivePage}/>
          {authenticating ? <Login /> :
            <AnimeDataContext.Provider value={{ ratings: ratings, monthlySummaries: summaries, newAnimes: newAnimes }}>
              {mainElement(activePage)}
            </AnimeDataContext.Provider>
          }
        </AuthenticationContext.Provider>
      </div>
    </div>
  );
}

export default App;
