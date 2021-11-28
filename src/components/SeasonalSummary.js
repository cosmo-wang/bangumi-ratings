import React, { useState, useContext, useEffect } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import AnimeDataContext from '../context/AnimeDataContext';
import { compareSeason } from '../utils/utils';
import '../App.css';
import './SeasonalSummary.css';

export default function SeasonalSummary(props) {
  const { newAnimes } = useContext(AnimeDataContext);

  const [summaryData, setSummaryData] = useState([]);


  const formatRankingData = (data) => {
    const res = [];
    for (const [date, ranking] of Object.entries(data)) {
      res.push([new Date(date).valueOf(), ranking]);
    }
    return res;
  }
  
  useEffect(() => {
    const tempData = {};
    newAnimes.forEach(newAnime => {
      const rankings = newAnime["seasons_ranking"];

      for (const [season, seasonRankings] of Object.entries(rankings)) {
        if (tempData[season] === undefined) {
          tempData[season] = {
            chart: {
              height: 600,
              borderRadius: 10
            },
            title: {
              text: season
            },
            xAxis: {
              type: 'datetime',
              labels: {
                format: '{value:%Y-%b-%e}'
              },
              title: {
                text: '日期'
              }
            },
            yAxis: {
              title: {
                text: '排名'
              },
              tickInterval: 1,
              min: 1,
              reversed: true
            },
            series: []
          };
        }
        tempData[season].series.push({
          name: newAnime.name,
          data: formatRankingData(seasonRankings)
        })
      }
    });
    const newSummaryData = Array.from(Object.values(tempData));
    newSummaryData.sort((e1, e2) => { return -compareSeason(e1.title.text, e2.title.text)});
    setSummaryData(newSummaryData);
  }, [newAnimes]);

  return <div className="summaries seasonal-summaries">
    {summaryData.map((data, index) =>
      <div className="summary-chart" key={index}>
        <HighchartsReact
          highcharts={Highcharts}
          options={data}
        />
      </div>
    )}
  </div>
}