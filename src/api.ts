const API_KEY = "7ddf9cba8020cc2542ed7ffeaa0c1787";
const BASE_PATH = "https://api.themoviedb.org/3";

interface ILatest {
  id: number;
  name: string;
}

interface IMovie {
  adult: boolean;
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
  popularity: number;
  release_date: string;
  original_language: string;
  genre_ids: [number];
}

interface IUp {
  poster_path: string;
  adult: boolean;
  overview: string;
  release_date: string;
  id: number;
  original_language: string;
  title: string;
  backdrop_path: string;
  popularity: number;
  genre_ids: [number];
}
interface ITop {
  poster_path: string;
  adult: boolean;
  overview: string;
  release_date: string;
  id: number;
  original_language: string;
  title: string;
  backdrop_path: string;
  popularity: number;
  genre_ids: [number];
}

interface IPopular {
  poster_path: string;
  adult: boolean;
  overview: string;
  release_date: string;
  id: number;
  original_language: string;
  title: string;
  backdrop_path: string;
  popularity: number;
}

interface ISimilar {
  poster_path: string;
  adult: boolean;
  overview: string;
  release_date: string;
  id: number;
  original_language: string;
  title: string;
  backdrop_path: string;
  popularity: number;
  genre_ids: [number];
}

export interface IGetMoviesLatets {
  adult: boolean;
  backdrop_path: string;
  genres: ILatest[];
  id: number;
  original_language: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  runtime: number;
  tagline: string;
  title: string;
  homepage: string;
}

export interface IGetMoviesResult {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

export interface IGetMoviesTop {
  page: number;
  results: ITop[];
  total_results: number;
  total_pages: number;
}

export interface IGetUpComing {
  results: IUp[];
  dates: {
    maximum: string;
    minimum: string;
  };
  total_pages: number;
  total_results: number;
}

export interface IGetPopular {
  page: number;
  results: IPopular[];
  total_results: number;
  total_pages: number;
}

export interface IGetSimilar {
  page: number;
  results: ISimilar[];

  total_pages: number;
  total_results: number;
}

interface IGenres {
  id: number;
  name: string;
}
export interface IGetDetails {
  adult: boolean;
  backdrop_path: string;
  genres: IGenres[];
  homepage: string;
  id: number;
  title: string;
  vote_average: number;
  overview: string;
  poster_path?: string;
  name: string;
  runtime: number;
  number_of_seasons: number;
  release_date: string;
}
export function getLatest() {
  return fetch(`${BASE_PATH}/movie/latest?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

export function getMovies() {
  return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

export function getTopRated() {
  return fetch(`${BASE_PATH}/movie/top_rated?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

export function getPopular() {
  return fetch(`${BASE_PATH}/movie/popular?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}
export function getUpComing() {
  return fetch(`${BASE_PATH}/movie/upcoming?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

export function getSimilar(moviesId: string) {
  return fetch(
    `${BASE_PATH}/movie/${moviesId}/similar?api_key=${API_KEY}`
  ).then((response) => response.json());
}

// Genres
export function getDetails(moviesId: string) {
  return fetch(`${BASE_PATH}/movie/${moviesId}?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

//tv function
interface ITv {
  poster_path: string;
  vote_average: number;
  id: number;
  backdrop_path: string;
  overview: string;
  first_air_date: string;
  origin_country: [string];
  original_language: string;
  name: string;
  original_name: string;
}
export interface IGetTv {
  page: number;
  results: ITv[];
  total_results: number;
  total_pages: number;
}
interface tvCreated {
  id: number;
  credit_id: string;
  name: string;
  gender: number;
  profile_path: string;
}
interface tvGenres {
  id: number;
  name: string;
}

interface tvSeasons {
  air_date: string;
  episode_count: number;
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  season_number: number;
}

export interface IGetDetailsTv {
  backdrop_path: string;
  created_by: tvCreated[];
  name: string;

  episode_run_time: [number];
  first_air_date: string;
  genres: tvGenres[];
  id: number;
  in_production: boolean;
  languages: [string];
  last_air_date: string;
  overview: string;
  number_of_episodes: number;
  number_of_seasons: number;
  origin_country: [string];
  original_language: string;

  seasons: tvSeasons[];

  tagline: string;
}

export interface IGetSimilarTv {
  page: number;
  results: ISimilar[];
  total_pages: number;
  total_results: number;
}

interface ITopTv {
  poster_path: string;
  adult: boolean;
  overview: string;
  release_date: string;
  id: number;
  original_language: string;
  name: string;
  backdrop_path: string;
  popularity: number;
  genre_ids: [number];
}

interface IPopularTv {
  poster_path: string;
  popularity: number;
  id: number;
  backdrop_path: string;
  vote_average: number;
  overview: string;
  first_air_date: string;
  original_language: string;
  vote_count: number;
  name: string;
}

export interface IGetTopTv {
  page: number;
  results: IPopularTv[];
  total_results: number;
  total_pages: number;
}

export interface IGetPopularTv {
  page: number;
  results: IPopularTv[];
  total_results: number;
  total_pages: number;
}

export function getTv() {
  return fetch(`${BASE_PATH}/tv/airing_today?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

export function getDetailTv(tvId: string) {
  return fetch(`${BASE_PATH}/tv/${tvId}?api_key=${API_KEY}`).then((response) =>
    response.json()
  );
}
export function getSimilarTv(tvId: string) {
  return fetch(`${BASE_PATH}/tv/${tvId}/simila?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}
export function getTopRatedTv() {
  return fetch(`${BASE_PATH}/tv/top_rated?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

export function getPopularTv() {
  return fetch(`${BASE_PATH}/tv/popular?api_key=${API_KEY}`).then((response) =>
    response.json()
  );
}
// search
interface ISearch {
  poster_path: string;
  popularity: number;
  id: number;
  overview: string;
  backdrop_path: string;
  media_type: string;
  genre_ids: [number];
  title: string;
}
export interface IGetSearch {
  results: ISearch[];

  total_results: number;
  total_pages: number;
}
export function getSearch(keyword: string) {
  return fetch(
    `${BASE_PATH}/search/multi?api_key=${API_KEY}&query=${keyword}`
  ).then((response) => response.json());
}
