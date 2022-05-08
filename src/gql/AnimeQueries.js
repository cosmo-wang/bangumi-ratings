import { gql } from '@apollo/client';

export const GET_ANIMES = gql`
  query GetAnimes {
    getAnimes {
      id,
      nameZh,
      nameJp,
      coverUrl,
      tvEpisodes,
      movies,
      episodeLength,
      genre,
      year,
      doubanRating,
      bangumiTvRating,
      doubanLink,
      bangumiTvLink,
      description,
      season,
      releaseDate,
      broadcastDay,
      status,
      startDate,
      endDate,
      timesWatched,
      story,
      illustration,
      music,
      passion,
      rankings,
      dmhySearchTerms,
      dmhyTags,
      delayedWeeks
    }
  }
`;

export const GET_DOWNLOAD_LINK = gql`
  query GetDownloadLink($id: Int!) {
    getDownloadLink(id: $id){
      resList {
        name
        pageUrl
        magnetUrl
      },
      msg
    }
  }
`;

export const SEARCH_LINKS = gql`
query SearchLinks($searchTerm: String!) {
  searchBangumiTv(searchTerm: $searchTerm) {
    name
    type
    url
  },
  searchDouban(searchTerm: $searchTerm) {
    name
    type
    url
  }
}
`;

export const GET_ANIME_INFO = gql`
query GetAnimeInfo($bangumiTvUrl: String!, $doubanUrl: String!) {
  getAnimeInfo(bangumiTvUrl: $bangumiTvUrl, doubanUrl: $doubanUrl) {
    nameZh,
    nameJp,
    coverUrl,
    tvEpisodes,
    episodeLength,
    doubanRating,
    bangumiTvRating,
    genre,
    year,
    doubanLink,
    bangumiTvLink,
    description,
    season,
    releaseDate,
    broadcastDay
  }
}
`;

export const ADD_ANIME = gql`
  mutation AddAnime(
    $newData: UpdateOrAddAnimeInput!
  ) {
    addAnime(newData: $newData) {
      anime {
        id,
        nameZh
      }
    }
  }
`;

export const UPDATE_ANIME = gql`
  mutation UpdateAnime(
    $newData: UpdateOrAddAnimeInput!
  ) {
    updateAnime(newData: $newData) {
      anime {
        id,
        nameZh
      }
    }
  }
`;

export const DELETE_ANIME = gql`
  mutation DeleteAnime($id: Int!) {
    deleteAnime(id: $id) {
      deletedAnimeNameZh
    }
  }
`;


export const UPDATE_RANKINGS = gql`
  mutation UpdateRankings(
    $newRankings: UpdateRankingsInput!
  ) {
    updateRankings(newRankings: $newRankings) {
      seasonRankings {
        anime {
          nameZh
        }
      }
    }
  }
`;
