import { useState, useEffect } from "react";
import moment from 'moment';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { styled } from '@mui/material/styles';

export function useWindowSize() {
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });
  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    // Add event listener
    window.addEventListener("resize", handleResize);
    // Call handler right away so state gets updated with initial window size
    handleResize();
    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty array ensures that effect is only run on mount
  return windowSize;
}

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#fe8a96',
    color: theme.palette.common.black,
    fontSize: 15,
  },
  [`&.${tableCellClasses.body}`]: {
    backgroundColor: theme.palette.common.white,
    color: theme.palette.common.black,
    fontSize: 15,
  },
}));

export const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

// return the user data from the session storage
export const getUser = () => {
  const userStr = sessionStorage.getItem('user');
  if (userStr) return JSON.parse(userStr);
  else return null;
}

// return the token from the session storage
export const getToken = () => {
  return sessionStorage.getItem('token') || null;
}

// remove the token and user from the session storage
export const removeUserSession = () => {
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('user');
}

// set the token and user from the session storage
export const setUserSession = (user, token) => {
  sessionStorage.setItem('token', token);
  sessionStorage.setItem('user', JSON.stringify(user));
}

export function formatEpisodes(tv_episodes) {
  if (tv_episodes === undefined) {
    return "";
  } else {
    return `${tv_episodes} 集`;
  }
}

export function formatDate(start_date, end_date) {
  start_date = moment(start_date);
  end_date = moment(end_date);
  if (!start_date.isValid()) {
    return ""
  } else if (!end_date.isValid()) {
    return `${start_date.format('MM/DD/YY')}至今`;
  } else {
    return `${start_date.format('MM/DD/YY')} 至 ${end_date.format('MM/DD/YY')}`;
  }
}

export function formatTime(time) {
  if (isNaN(time) || time < 0) {
    return "-";
  }
  if (time >= 60) {
    return Math.round(time / 60 * 10) / 10 + " 小时";
  } else {
    return Math.round(time * 10) / 10 + " 分钟";
  }
}

const formatDescription = (description) => {
  if (description !== null && description !== undefined) {
    return description.substring(0, 50) + '......';
  }
}

export function calculateDailyTime(item) {
  const days = moment(item.endDate).diff(moment(item.startDate), 'days') + 1;
  const episodeLength = item.episodeLength === undefined || item.episodeLength === 0 ? 24 : item.episodeLength;
  const totalTime = item.tvEpisodes * episodeLength;
  return totalTime / days;
}

export function translate(word, rated) {
  switch (word) {
    case '名称':
      return 'nameZh';
    case '集数':
    case '预计集数':
      return 'tvEpisodes';
    case '状态':
      return 'status';
    case '分类':
      return 'genre';
    case '剧情':
      return 'story';
    case '作画':
      return 'illustration';
    case '音乐':
      return 'music';
    case '情怀':
      return 'passion';
    case '评分':
      return 'rating';
    case '首次观看日期':
      return rated ? 'endDate' : 'startDate';
    case '观看次数':
      return 'timesWatched';
    case '年份':
      return 'year';
    case '日均时长':
      return 'dailyTime';
    case '排名':
      return 'ranking';
    case '季度':
      return 'season';
    case '开始放送日期':
      return 'startDate';
    case '更新日':
      return 'broadcastDay';
    default:
      return 'unknown';
  }
}

export function sortList(rawList, sortedCol) {
  return rawList.slice().sort((a, b) => {
    const aQuantity = sortedCol === "dailyTime" ? calculateDailyTime(a) : a[sortedCol];
    const bQuantity = sortedCol === "dailyTime" ? calculateDailyTime(b) : b[sortedCol];
    if (sortedCol === "start_date" && typeof sortedCol !== "string") {
      if (!aQuantity.isValid()) {
        return 1;
      } else if (!bQuantity.isValid()) {
        return -1;
      } else {
        return compare(aQuantity, bQuantity);
      }
    } else if (sortedCol === 'rating') {
      return compare(getRating(a), getRating(b))
    } else {
      return compare(aQuantity, bQuantity);
    }
  });
}

function compare(a, b) {
  if (a > b) {
    return -1;
  } else if (a < b) {
    return 1;
  } else {
    return 0;
  }
}

export const weekdayMap = {
  1: '星期一',
  2: '星期二',
  3: '星期三',
  4: '星期四',
  5: '星期五',
  6: '星期六',
  7: '星期日'
}

const daySorter = {
  // "sunday": 0, // << if sunday is first day of week
  "星期一": 1,
  "星期二": 2,
  "星期三": 3,
  "星期四": 4,
  "星期五": 5,
  "星期六": 6,
  "星期日": 7
}

export function sortByDay(a, b) {
  return daySorter[a] - daySorter[b]
}

export function sortSeasons(seasons) {
  seasons.sort((a, b) => {
    const splittedA = a.split('年');
    const splittedB = b.split('年');
    if (parseInt(splittedA[0]) === parseInt(splittedB[0])) {
      return parseInt(splittedA[1]) - parseInt(splittedB[1]);
    } else {
      return parseInt(splittedA[0]) - parseInt(splittedB[0]);
    }
  });
  return seasons;
}

export function getCurrentSeason() {
  const d = new Date();
  const year = d.getFullYear();
  const month = Math.floor(d.getMonth() / 3) * 3 + 1;
  return year + "年" + month + "月";
}

export function getLatestRankings(animes, currentSeason) {
  let rankings = {};
  animes.forEach(anime => {
    const currentSeasonRankings = JSON.parse(JSON.parse(anime.rankings))[currentSeason];
    if (currentSeasonRankings) {
      const dates = Object.keys(currentSeasonRankings);
      const latestRank = currentSeasonRankings[dates.sort()[dates.length - 1]];
      rankings[anime.nameZh] = latestRank;
    }
  });
  return rankings;
}

export function compareSeason(season1, season2) {
  const year1 = parseInt(season1.split("年")[0]);
  const month1 = parseInt(season1.split("年")[1].replace("日", ""));
  const year2 = parseInt(season2.split("年")[0]);
  const month2 = parseInt(season2.split("年")[1].replace("日", ""));
  if (year1 === year2) {
    return month1 - month2;
  } else {
    return year1 - year2;
  }
}

// place an item in list at startIndex to endIndex
export const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

export const parseSeasonSchedules = (seasonSchedules) => {
  return seasonSchedules.map(entry => {
    const newEntry = {};
    for (const [key, value] of Object.entries(entry)) {
      if (key === 'rankings') {
        newEntry[key] = JSON.parse(JSON.parse(value));
      } else {
        newEntry[key] = value;
      }
    }
    return newEntry;
  });
}

export const getRating = (anime) => {
  return anime.story + anime.illustration + anime.music + anime.passion;
}

export const getTodayDate = () => { return moment(new Date()).format("YYYY-MM-DD"); }

export const colSizes = {
    'description': 4,
    'endDate': 2,
    'episodeLength': 1,
    'genre': 2,
    'illusration': 1,
    'music': 1,
    'nameJp': 3,
    'nameZh': 3,
    'passion': 1,
    'startDate': 2,
    'status': 1,
    'story': 1,
    'timesWatch': 1,
    'tvEpisodes': 1,
    'year': 1,
    'rating': 1,
    "watchedDate": 2,
    "dailyTime": 1
}

export function translateEnToZh(word) {
  switch (word) {
    case 'description':
      return "简介";
    case 'bangumiTvRating':
      return "番组计划评分";
    case 'endDate':
      return "结束日期";
    case 'episodeLength':
      return "单集长度";
    case 'genre':
      return "分类";
    case 'illustration':
      return "作画";
    case 'music':
      return "音乐";
    case 'nameJp':
      return "日文名称";
    case 'nameZh':
      return "名称";
    case 'passion':
      return "情怀";
    case 'startDate':
      return "开始日期";
    case 'status':
      return "状态";
    case 'story':
      return "故事";
    case 'timesWatch':
      return "观看次数";
    case 'tvEpisodes':
      return "TV集数";
    case 'year':
      return "年份";
    case 'rating':
      return '评分';
    case 'watchedDate':
      return '首次观看日期';
    case 'dailyTime':
      return '日均时长';
    case 'broadcastDay':
      return '更新日';
    case 'releaseDate':
      return '开播日期';
    case 'season':
      return '季度';
    case 'rankings':
      return '当季排名';
    default:
      return `未知：${word}`
  }
}

export const getItemValue = (item, key) => {
  switch (key) {
    case 'rating':
      return getRating(item).toFixed(1);
    case 'watchedDate':
      return formatDate(item['startDate'], item['endDate']);
    case 'dailyTime':
      return formatTime(calculateDailyTime(item).toFixed(1));
    case 'tvEpisodes':
      return formatEpisodes(item.tvEpisodes);
    case 'description':
      return formatDescription(item.description);
    default:
      return item[key];
  }
}

export const getNewAnimeHeaders = (windowWidth) => {
  if (windowWidth < 400) {
    return ["nameZh"];
  } else if (windowWidth < 600) {
    return ["nameZh", "broadcastDay"];
  } else if (windowWidth < 900) {
    return ["nameZh", "tvEpisodes", "broadcastDay"];
  } else {
    return ["nameZh", "genre", "season", "releaseDate", "broadcastDay", "tvEpisodes", "status"];
  }
}

export const getAnimeHeaders = (windowWidth, rated) => {
  if (windowWidth < 400) {
    return ["nameZh"];
  } else if (windowWidth < 600) {
    return rated ? ["nameZh", "rating"] : ["nameZh", "description"];
  } else if (windowWidth < 900) {
    return rated ? ["nameZh", "tvEpisodes", "rating"] : ["nameZh", "tvEpisodes", "description"];
  } else {
    return rated ?
      ["nameZh", "story", "illustration", "music", "passion", "rating", "watchedDate", "dailyTime"] :
      ["nameZh", "year", "genre", "tvEpisodes", "description"];
  }
}

export const getColNum = (windowWidth) => {
  return 2 + getAnimeHeaders(windowWidth).map(header => colSizes[header]).reduce((partialSum, a) => partialSum + a, 0);
}