import React, { useState, useEffect } from 'react';
import Navivation from './components/Navigation';
import AnimeDataContext from './Context/AnimeDataContext';
import Home from './home/Home';
import Register from './register/Register';
import AnimeList from './components/AnimeList';
import Login from "./components/Login";
import * as Env from "./environments";
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { sortList } from "./utils";
import Parse from 'parse';
import moment from 'moment';
import './App.css';

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [ratings, setRatings] = useState([]);
  const [descriptions, setDescriptions] = useState({
    "Anime 1": {
      name: "Anime 1",
      episodes: 42,
      status: "已看",
      genre: "恋爱",
      description: "This is a description the anime."
    }
  });


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
      if (typeof document !== 'undefined') document.write(`Error while fetching ParseObjects: ${JSON.stringify(error)}`);
      console.error('Error while fetching ParseObjects', error);
    });
  };

  const submitNewRating = async (newRating) => {
    const RatingsObj = Parse.Object.extend('Ratings');
    const newRatingObj = new RatingsObj();
    console.log(newRating);
    for (const [key, value] of Object.entries(newRating)) {
      newRatingObj.set(key, value)
    }

    newRatingObj.save().then(
      (result) => {
        console.log(result);
        alert("已提交更新！");
        fetchRatings();
      },
      (error) => {
        console.log(error);
        alert("更新失败，请稍后重试。");
      }
    );
  };

  const updateRating = async (id, newRating) => {
    console.log(newRating);
    console.log(id);
    const ratingsObj = Parse.Object.extend('Ratings');
    const query = new Parse.Query(ratingsObj);
    query.get(id).then((object) => {
      for (const [key, value] of Object.entries(newRating)) {
        console.log("here");
        object.set(key, value)
      }
      object.save().then((response) => {
        console.log(response);
        alert("已提交更新！");
        fetchRatings();
      }, (error) => {
        console.log(error);
        alert("更新失败，请稍后重试。");
      });
    });
  };
  
  const deleteAnime = async (id) => {
    console.log(id);
    const ratingsObj = Parse.Object.extend('Ratings');
    const query = new Parse.Query(ratingsObj);
    query.get(id).then((object) => {
      object.destroy().then((response) => {
        console.log(response);
        alert("已删除番剧！");
        fetchRatings();
      }, (error) => {
        console.log(error);
        alert("删除失败，请稍后重试。");
      });
    });
  };

  useEffect(() => {
    fetchRatings();
  }, []);

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

  return (
    <div>
      <div className="App">
        <Navivation />
        <Router basename={process.env.PUBLIC_URL + "/bangumi-ratings"}>
          <Switch>
            <AnimeDataContext.Provider value={{ratings: ratings, descriptions: descriptions}}>
              <Route path="/login">
                <Login />
              </Route>
              <Route exact path="/">
                <AnimeList isLoading={isLoading} loadError={loadError} refresh={fetchRatings} onAnimeSubmit={handleAnimeSubmit} deleteAnime={deleteAnime}/>
              </Route>
              <Route path="/today">

              </Route>
              <Route path="/calendar">

              </Route>
            </AnimeDataContext.Provider>
          </Switch>
        </Router>
      </div>
    </div>
  );
}

export default App;
