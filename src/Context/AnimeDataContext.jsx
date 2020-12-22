import React from 'react';

const animeData = {
  ratings: [],
  summaries: {}
}

const AnimeDataContext = React.createContext(animeData);

export default AnimeDataContext;