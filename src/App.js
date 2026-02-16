import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_ANIMES } from './gql/AnimeQueries';
import Navivation from './components/Navigation';
import AnimeList from './components/AnimeList';
import MonthlySummary from './components/MonthlySummary';
import SeasonalSummary from './components/SeasonalSummary';
import 'bootstrap/dist/css/bootstrap.min.css';
import AnimeDataContext from './context/AnimeDataContext';
import { WindowSizeContext } from "./context/WindowSizeContext";
import { useWindowSize } from "./utils/utils";
import './App.css';

function App() {
  // page status related states
  const [activePage, setActivePage] = useState("AnimeList")

  const { loading, error, data, refetch } = useQuery(GET_ANIMES);

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
          <Navivation switchPage={setActivePage} />
          <AnimeDataContext.Provider value={{
            animes: data === undefined ? [] : data.getAnimes
          }}>
            {mainElement(activePage)}
          </AnimeDataContext.Provider>
        </WindowSizeContext.Provider>
      </div>
    </div>
  );
}

export default App;
