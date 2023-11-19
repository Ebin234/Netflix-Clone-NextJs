import { TMDB_BASE_URL } from "./constants";

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

export const getTrendingMedias = async (type) => {
  try {
    const res = await fetch(
      `${TMDB_BASE_URL}/trending/${type}/day?api_key=${TMDB_API_KEY}&language=en-US`,
      {
        method: "GET",
      }
    );

    const data = await res.json();
    return data?.results;
  } catch (error) {
    console.error(error);
  }
};

export const getTopratedMedias = async (type) => {
  try {
    const res = await fetch(
      `${TMDB_BASE_URL}/${type}/top_rated?api_key=${TMDB_API_KEY}&language=en-US`,
      {
        method: "GET",
      }
    );

    const data = await res.json();
    return data?.results;
  } catch (error) {
    console.error(error);
  }
};

export const getPopularMedias = async (type) => {
  try {
    const res = await fetch(
      `${TMDB_BASE_URL}/${type}/popular?api_key=${TMDB_API_KEY}&language=en-US`,
      {
        method: "GET",
      }
    );

    const data = await res.json();
    return data?.results;
  } catch (error) {
    console.error(error);
  }
};

export const getTvorMoviesByGenre = async (type, id) => {
  try {
    const res = await fetch(
      `${TMDB_BASE_URL}/discover/${type}?api_key=${TMDB_API_KEY}&language=en-US&include_adult=false&sort_by=popularity.desc&with_genres=${id}`,
      {
        method: "GET",
      }
    );

    const data = await res.json();
    return data?.results;
  } catch (error) {
    console.error(error);
  }
};

export const getTvorMoviesVideosByID = async (type, id) => {
  try {
    const res = await fetch(
      `${TMDB_BASE_URL}/${type}/${id}/videos?api_key=${TMDB_API_KEY}&language=en-US&append_to_response=videos`,
      {
        method: "GET",
      }
    );

    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};

export const getTvorMovieSearchResults = async (type, query) => {
  try {
    const res = await fetch(
      `${TMDB_BASE_URL}/search/${type}?api_key=${TMDB_API_KEY}&include_adult=false&language=en-US&query=${query}`,
      {
        method: "GET",
      }
    );

    const data = await res.json();
    return data?.results;
  } catch (error) {
    console.error(error);
  }
};

export const getTvorMoviesDetailsByID = async (type, id) => {
  try {
    const res = await fetch(
      `${TMDB_BASE_URL}/${type}/${id}?api_key=${TMDB_API_KEY}&language=en-US&append_to_response=videos`,
      {
        method: "GET",
      }
    );

    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};

export const getSimilarTvorMovies = async (type, id) => {
  try {
    const res = await fetch(
      `${TMDB_BASE_URL}/${type}/${id}/similar?api_key=${TMDB_API_KEY}&language=en-US`,
      {
        method: "GET",
      }
    );

    const data = await res.json();
    return data?.results;
  } catch (error) {
    console.error(error);
  }
};

export const getAllFavorites = async (uid, accountID) => {
  try {
    const res = await fetch(
      `/api/favorites/get-all-favorites?id=${uid}&accountID=${accountID}`,
      {
        method: "GET",
      }
    );

    const data = await res.json();
    return data?.data;
  } catch (error) {
    console.error(error);
  }
};
