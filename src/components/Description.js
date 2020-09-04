import React from 'react';
import './Description.css';

export default function Description(props) {
  const description = props.description;
  return description === undefined || description === null ? 
    <p>暂无简介</p> :
    <div className="description">
      <img className="cover" src={`${process.env.PUBLIC_URL}/covers/${description.name}.jpg`} alt={description.name} />
      <div>
        <h1>{description.name}</h1>
        <p>豆瓣评分：{description.douban}</p>
        <p>年份：{description.year}</p>
        <p>分类：{description.genre}</p>
        <p>集数：{description.episodes}</p>
        <p>单集片长：{description.episode_length}</p>
        <p>简介：{description.description}</p>
      </div>
    </div>;
}