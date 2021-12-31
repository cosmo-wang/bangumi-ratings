import React from 'react';
import { AiOutlineSearch } from "react-icons/ai";
import './Description.css';

export default function Description(props) {
  const description = props.description;
  return description === undefined || description === null ? 
    <p>暂无简介</p> :
    <div className="description">
      <div>
        <h1>
          {description.nameZh}
          <a href={"https://www.douban.com/search?q=" + description.nameZh} target="_blank" rel="noopener noreferrer">
            <AiOutlineSearch className="icon clickable" />
          </a>
        </h1>
        <p>日文名称：{description.nameJp}</p>
        <p>豆瓣评分：{description.doubanRating}</p>
        <p>年份：{description.year}</p>
        <p>分类：{description.genre}</p>
        <p>集数：{description.episodes}</p>
        <p>单集片长：{description.episodeLength}</p>
        <p>简介：{description.description}</p>
      </div>
    </div>;
}