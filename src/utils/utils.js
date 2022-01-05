import moment from 'moment';

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

export function formatEpisodes(tv_episodes, movies) {
  if (tv_episodes === undefined || movies === undefined) {
    return "";
  } else if (tv_episodes === 0) {
    return `剧场版×${movies}`;
  } else if (movies === 0) {
    return `${tv_episodes}集`;
  } else {
    return `${tv_episodes}集+剧场版×${movies}`;
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
  if (isNaN(time)) {
    return "-";
  }
  if (time >= 60) {
    return Math.round(time / 60 * 10) / 10 + " 小时";
  } else {
    return Math.round(time * 10) / 10 + " 分钟";
  }
}

export function calculateDailyTime(row) {
  const days = moment(row.endDate).diff(moment(row.startDate), 'days') + 1;
  const episodeLength = row.episodeLength === undefined || row.episodeLength === 0 ? 24 : row.episodeLength;
  const totalTime = row.tvEpisodes * episodeLength + row.movies * 90;
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
    case '豆瓣评分':
      return 'doubanRating';
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

export function parseDoubanPage(pageSrc) {
  const nameZh = pageSrc.split("\n")[5].split(" ")[0];
  const year = pageSrc.split("首播: ")[1].split("-")[0];
  const doubanRating = pageSrc.split("豆瓣评分")[1].split("\n")[1];
  let tvEpisodes = 12;
  try {
    tvEpisodes = parseInt(pageSrc.split("集数: ")[1].split("-")[0]);
  } catch (error) {
    console.error(error);
  }
  let episodeLength = 24;
  try {
    episodeLength = parseInt(pageSrc.split("单集片长: ")[1].split("-")[0]);
  } catch (error) {
    console.error(error);
  }
  const description = pageSrc.split("的剧情简介 · · · · · ·")[1].split("\n\n")[1].trim();
  return {
    nameZh: nameZh,
    year: year,
    doubanRating: doubanRating,
    tvEpisodes: isNaN(tvEpisodes) ? 0 : tvEpisodes,
    episodeLength: isNaN(episodeLength) ? 12 : episodeLength,
    description: description,
  }
}

export function getSeason() {
  const d = new Date();
  const year = d.getFullYear();
  const month = Math.floor(d.getMonth() / 3) * 3 + 1;
  const curSeason = year + "年" + month + "月";
  let preSeason = year + "年" + (month - 3) + "月";
  let nextSeason = year + "年" + (month + 3) + "月";
  if (month === 1) {
    preSeason = (year - 1) + "年10月";
  }
  if (month === 10) {
    nextSeason = (year + 1) + "年1月";
  }
  return [preSeason, curSeason, nextSeason];
}

export function getLatestRankings(newAnimes, currentSeason) {
  let rankings = {};
  newAnimes.forEach(newAnime => {
    const currentSeasonRankings = newAnime.rankings[currentSeason];
    const dates = Object.keys(currentSeasonRankings);
    const latestRank = currentSeasonRankings[dates.sort()[dates.length - 1]];
    rankings[newAnime.nameZh] = latestRank;
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