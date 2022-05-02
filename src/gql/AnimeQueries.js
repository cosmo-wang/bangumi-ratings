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
      rankings
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
