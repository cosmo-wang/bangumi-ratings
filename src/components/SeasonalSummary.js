import React, { useState, useContext, useEffect } from 'react';
import AnimeDataContext from '../context/AnimeDataContext';
import '../App.css';
import './SeasonalSummary.css';

export default function SeasonalSummary(props) {
  const { newAnimes } = useContext(AnimeDataContext);

  const [summaryData, setSummaryData] = useState({});


  const formatRankingData = (data) => {
    const res = [];
    for (const [date, ranking] of Object.entries(data)) {
      res.push({
        x: new Date(date),
        y: ranking
      });
    }
    return res;
  }
  
  useEffect(() => {
    const tempData = {};
    newAnimes.forEach(newAnime => {
      const rankings = newAnime["seasons_ranking"];

      for (const [season, seasonRankings] of Object.entries(rankings)) {
        if (tempData[season] === undefined) {
          tempData[season] = [];
        }
        tempData[season].push({
          label: newAnime.name,
          data: formatRankingData(seasonRankings)
        })
      }
    });
    setSummaryData(tempData);
  }, [newAnimes]);

  console.log(summaryData["2021年4月"]);

  return <div className="summaries">
    
    
  </div>
}