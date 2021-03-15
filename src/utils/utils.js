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
  const days = row.end_date.diff(row.start_date, 'days') + 1;
  const episode_length = row.episode_length === undefined || row.episode_length === 0 ? 24 : row.episode_length;
  const totalTime = row.tv_episodes * episode_length + row.movies * 90;
  return totalTime / days;
}

export function translateHeader(header) {
  switch(header) {
    case '名称':
      return 'name';
    case '集数':
    case '预计集数':
      return 'tv_episodes';
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
      return 'end_date';
    case '观看次数':
      return 'times_watched';
    case '年份':
      return 'year';
    case '豆瓣评分':
      return 'douban';
    case '日均时长':
      return 'daily_time';
    case '排名':
      return 'ranking';
    case '季度':
      return 'season';
    case '开始放送日期':
      return 'start_date';
    case '更新日':
      return 'next_episode_day';
    default:
      return 'unknown';
  }
}

export function sortList(rawList, sortedCol) {
  return rawList.slice().sort((a, b) => {
    const aQuantity = sortedCol === "daily_time" ? calculateDailyTime(a) : a[sortedCol];
    const bQuantity = sortedCol === "daily_time" ? calculateDailyTime(b) : b[sortedCol];
    if (sortedCol === "start_date") {
      if (!aQuantity.isValid()) {
        return 1;
      } else if (!bQuantity.isValid()) {
        return -1;
      } else {
        return compare(aQuantity, bQuantity);
      }
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
  const name = pageSrc.split("\n")[5].split(" ")[0];
  const year = pageSrc.split("首播: ")[1].split("-")[0];
  const douban = pageSrc.split("豆瓣评分")[1].split("\n")[1];
  let tv_episodes = 12;
  try {
    tv_episodes = parseInt(pageSrc.split("集数: ")[1].split("-")[0]);
  } catch (error) {
    console.error(error);
  }
  let episode_length = 24;
  try {
    episode_length = parseInt(pageSrc.split("单集片长: ")[1].split("-")[0]);
  } catch (error) {
    console.error(error);
  }
  const description = pageSrc.split("的剧情简介 · · · · · ·")[1].split("\n\n")[1].trim();
  return {
    name: name,
    year: year,
    douban: douban,
    tv_episodes: isNaN(tv_episodes) ? 0 : tv_episodes,
    episode_length: isNaN(episode_length) ? 12: episode_length,
    description: description,
  }
}

export function getSeason() {
  const d = new Date();
  const year = d.getFullYear();
  const month = Math.floor(d.getMonth()/3) + 1;
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