import React from 'react';

const animeData = {
  ratings: [],
  descriptions: {}
}

const AnimeDataContext = React.createContext(animeData);

export default AnimeDataContext;