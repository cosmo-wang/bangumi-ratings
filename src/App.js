import React, { useState, useEffect } from 'react';
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

  const fetchRatings = async () => {
    setIsLoading(true);
    const ratingsObj = Parse.Object.extend('Ratings');
    const query = new Parse.Query(ratingsObj);
    query.limit(1000);
    query.find().then((results) => {
      console.log("calling server for ratings");
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
      console.error('Error while fetching ratings', error);
    });
  };

  const fetchQuotes = async () => {
    const quotesObj = Parse.Object.extend('Quotes');
    const query = new Parse.Query(quotesObj);
    query.limit(1000);
    query.find().then((results) => {
      console.log("calling server for quotes");
      if (typeof document !== 'undefined'){
        const quotes = results.map((result) => {
          return {
            id: result.id,
            month: result.get("month"),
            content: result.get("content"),
            translation: result.get("translation"),
            person: result.get("person"),
            bangumi: result.get("bangumi"),
          }}
        );
        setQuotes(quotes);
      }
    }, (error) => {
      setLoadError(true);
      console.error('Error while fetching quotes', error);
    });
  }

  const fetchNewAnimes = async () => {
    setIsLoading(true);
    const quotesObj = Parse.Object.extend('NewAnimes');
    const query = new Parse.Query(quotesObj);
    query.limit(1000);
    query.find().then((results) => {
      console.log("calling server for new animes");
      if (typeof document !== 'undefined'){
        const newAnimes = results.map((result) => {
          return {
            id: result.id,
            name: result.get("name"),
            genre: result.get("genre"),
            seasons_ranking: result.get("seasons_ranking"),
            start_date: result.get("start_date"),
            next_episode_day: result.get("next_episode_day"),
            tv_episodes: result.get("tv_episodes"),
            description: result.get("description"),
            season: result.get("season"),
            status: result.get("status"),
          }}
        );
        setNewAnimes(newAnimes);
        setIsLoading(false);
      }
    }, (error) => {
      setIsLoading(false);
      setLoadError(true);
      console.error('Error while fetching new animes', error);
    });
  }

  const submitNewEntry = async (newEntry, databaseName) => {
    const DataObject = Parse.Object.extend(databaseName);
    const query = new Parse.Query(DataObject);
    query.equalTo("name", newEntry.name);
    const results = await query.find();
    if (results.length > 0) {
      alert("番剧《" + newEntry.name + "》已存在！请勿重复添加番剧！")
    } else {
      const newObj = new DataObject();
      for (const [key, value] of Object.entries(newEntry)) {
        newObj.set(key, value)
      }
      newObj.save().then(
        (result) => {
          alert("已提交番剧信息！");
          if (databaseName === "Ratings") {
            fetchRatings();
          } else if (databaseName === "NewAnimes") {
            fetchNewAnimes();
          }
        },
        (error) => {
          alert("更新失败，请稍后重试。");
        }
      );
    }
  };

  const submitNewQuote = async (newQuote) => {
    const QuotesObj = Parse.Object.extend('Quotes');
    const newQuotesObj = new QuotesObj();
    for (const [key, value] of Object.entries(newQuote)) {
      newQuotesObj.set(key, value)
    }
    newQuotesObj.save().then(
      (result) => {
        alert("已添加语录！");
        fetchQuotes();
      },
      (error) => {
        alert("添加失败，请稍后重试。");
      }
    );
  };

  const updateEntry = async (id, newEntry, databaseName) => {
    const obj = Parse.Object.extend(databaseName);
    const query = new Parse.Query(obj);
    query.get(id).then((object) => {
      for (const [key, value] of Object.entries(newEntry)) {
        object.set(key, value)
      }
      object.save().then((response) => {
        alert("已更新番剧信息！");
        if (databaseName === "Ratings") {
          fetchRatings();
        } else if (databaseName === "NewAnimes") {
          fetchNewAnimes();
        }
      }, (error) => {
        alert("更新失败，请稍后重试。");
      });
    });
  };

  const updateQuote = async (id, newQuote) => {
    const QuotesObj = Parse.Object.extend('Quotes');
    const query = new Parse.Query(QuotesObj);
    query.get(id).then((object) => {
      for (const [key, value] of Object.entries(newQuote)) {
        object.set(key, value)
      }
      object.save().then((response) => {
        alert("已更新语录！");
        fetchQuotes();
      }, (error) => {
        alert("更新失败，请稍后重试。");
      });
    });
  };


  const updateNewAnimesRankings = async (ids, newRankings, season) => {
    const obj = Parse.Object.extend("NewAnimes");
    const query = new Parse.Query(obj);
    query.containedIn("objectId", ids);
    query.find().then((results) => {
      results.forEach((result) => {
        result.set("seasons_ranking", newRankings[result.id]);
      })
      Parse.Object.saveAll(results).then((response) => {
        alert("已更新排名！");
        fetchNewAnimes();
      }, (err) => {
        alert("更新排名失败。");
      })
    }, (error) => {
      alert("更新排名失败。");
    });
  }

  const deleteEntry = async (id, databaseName) => {
    const obj = Parse.Object.extend(databaseName);
    const query = new Parse.Query(obj);
    query.get(id).then((object) => {
      object.destroy().then((response) => {
        alert("已删除番剧！");
        if (databaseName === "Ratings") {
          fetchRatings();
        } else if (databaseName === "NewAnimes") {
          fetchNewAnimes();
        }
      }, (error) => {
        alert("删除失败，请稍后重试。");
      });
    });
  };

  const deleteQuote = async (id) => {
    const quotesObj = Parse.Object.extend('Quotes');
    const query = new Parse.Query(quotesObj);
    query.get(id).then((object) => {
      object.destroy().then((response) => {
        alert("已删除语录！");
        fetchQuotes();
      }, (error) => {
        alert("删除失败，请稍后重试。");
      });
    });
  };

  useEffect(() => {
    fetchRatings();
    fetchNewAnimes();
    fetchQuotes();
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
      submitNewEntry(newRating, 'Ratings');
    } else {
      updateEntry(id, newRating, 'Ratings');
    }
  };

  const handleNewAnimeSubmit = (event, id, isNew, newRanking) => {
    event.preventDefault();
    const formElements = event.target.elements;
    const newAnime = {
      "name": formElements.name.value,
      "tv_episodes": Number(formElements.tv_episodes.value),
      "genre": formElements.genre.value,
      "description": formElements.description.value,
      "start_date": formElements.start_date.value,
      "next_episode_day": formElements.next_episode_day.value,
      "season": formElements.season.value,
      "status": formElements.status.value,
    };
    if (isNew) {
      let latestSeason = formElements.season.value.split("，");
      latestSeason = latestSeason[latestSeason.length - 1];
      let newSeasonsRanking = {}
      newSeasonsRanking[latestSeason] = {}
      newSeasonsRanking[latestSeason][moment().format("YYYY-MM-DD")] = newRanking;
      newAnime["seasons_ranking"] = newSeasonsRanking;
      submitNewEntry(newAnime, 'NewAnimes');
    } else {
      updateEntry(id, newAnime, 'NewAnimes');
    }
  };

  const handleQuoteSubmit = (event, month, id, isNew) => {
    event.preventDefault();
    const formElements = event.target.elements;
    const newQuote = {
      "month": month,
      "content": formElements.content.value,
      "translation": formElements.translation.value,
      "person": formElements.person.value,
      "bangumi": formElements.bangumi.value,
    };
    if (isNew) {
      submitNewQuote(newQuote);
    } else {
      updateQuote(id, newQuote);
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
          refresh={fetchRatings}
          onAnimeSubmit={handleAnimeSubmit}
          deleteAnime={deleteEntry}
        />;
      case 'NewAnimeList':
        return <NewAnimeList
          isLoading={isLoading}
          loadError={loadError}
          refresh={fetchNewAnimes}
          onAnimeSubmit={handleAnimeSubmit}
          onNewAnimeSubmit={handleNewAnimeSubmit}
          updateEntry={updateEntry}
          deleteNewAnime={deleteEntry}
          updateNewAnimesRankings={updateNewAnimesRankings}
        />
      case 'MonthlySummary':
        return <MonthlySummary
          onQuoteSubmit={handleQuoteSubmit}
          deleteQuote={deleteQuote}
        />;
      case 'SeasonalSummary':
        return <SeasonalSummary />
      default:
        return <AnimeList
          isLoading={isLoading}
          loadError={loadError}
          refresh={fetchRatings}
          onAnimeSubmit={handleAnimeSubmit}
          deleteAnime={deleteEntry}
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
