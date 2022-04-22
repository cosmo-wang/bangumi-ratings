import React from 'react';
import { formatEpisodes, getRating, formatDate, formatTime, calculateDailyTime } from "../utils/utils";
import './AnimeCard.css';

const coverUrl = 'https://lain.bgm.tv/pic/cover/l/d9/f5/326895_S66Uq.jpg';

function AnimeCard(props) {
  const anime = props.anime;
  console.log(anime);
  return <div className='entry-card'>
    <img className='main-pic' src={coverUrl} />
    <div className='title'>
      <div className='title-zh'>{anime.nameZh} ({anime.year})</div>
      <div className='title-jp sub-info'>{anime.nameJp}</div>
    </div>
    <div className='ratings sub-info'>
      <div className='rating'>
        <div className='rating-label'>我的评分：</div>
        <div className='rating-number'>{getRating(anime).toFixed(1)}</div>
        <div className='my-rating-breakdown'>（作画：<span className='rating-number'>{anime.illustration}</span> 剧情：<span className='rating-number'>{anime.story}</span> 音乐：<span className='rating-number'>{anime.music}</span> 情怀：<span className='rating-number'>{anime.passion}</span>）</div>
      </div>
      <div className='rating sub-info'>
        <div className='rating-label'>豆瓣评分：</div>
        <div className='rating-number'>{anime.doubanRating}</div>
      </div>
    </div>
    <div className='info sub-info'>{anime.genre} ｜ {formatEpisodes(anime.tvEpisodes, anime.movies)} ｜ 单集 {anime.episodeLength} 分钟 ｜ {formatDate(anime)} ｜ 日均 {formatTime(calculateDailyTime(anime))}</div>
    <div className='description sub-info'>{anime.description ? anime.description : '暂无简介'}</div>
  </div>; 
}

export default AnimeCard;
