import React from 'react';

const animeData = {
  ratings: [],
  newAnimes: [],
  monthlySummaries: {}
}

const AnimeDataContext = React.createContext(animeData);

export default AnimeDataContext;