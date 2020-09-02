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
    return `${start_date.format('YYYY-MM-DD')}至今`;
  } else {
    return `${start_date.format('YYYY-MM-DD')} 至 ${end_date.format('YYYY-MM-DD')}`;
  }
}

export function translateHeader(header) {
  switch(header) {
    case '名称':
      return 'name';
    case '集数':
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
      return 'start_date';
    case '观看次数':
      return 'times_watched';
    default:
      return 'unknown';
  }
}

export function sortList(rawList, sortedCol) {
  return rawList.slice().sort((a, b) => {
    if (sortedCol === "start_date") {
      if (!a[sortedCol].isValid()) {
        return 1;
      } else if (!b[sortedCol].isValid()) {
        return -1;
      } else {
        return compare(a[sortedCol], b[sortedCol]);
      }
    } else {
      return compare(a[sortedCol], b[sortedCol]);
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