import { motion, AnimatePresence, useViewportScroll } from "framer-motion";
import { useState } from "react";
import { useQuery } from "react-query";
import { useMatch, useNavigate, PathMatch, useParams } from "react-router-dom";
import styled from "styled-components";
import {
  getDetails,
  getLatest,
  getMovies,
  getTopRated,
  getUpComing,
  IGetDetails,
  IGetMoviesLatets,
  IGetMoviesResult,
  IGetMoviesTop,
  IGetUpComing,
} from "../api";
import Details from "../Components/Details";
import { makeImagePath } from "../untils";
import useWindowDimensions from "../useWindowDimensions";

const Wrapper = styled.div`
  padding-bottom: 200px;
`;
const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ bgPhoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgPhoto});
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 68px;
  margin-bottom: 20px;
`;

const Overview = styled.p`
  font-size: 30px;
  width: 50%;
`;
const SliderWrap = styled.div`
  position: relative;
`;

const Slider = styled.div`
  position: relative;
  top: -100px;
`;

const SliderTitle = styled.h3`
  padding: 10px 20px;
  position: absolute;
  bottom: 100px;
  left: 0px;
  color: white;
  font-size: 32px;
  font-weight: 700;
`;

const Row = styled(motion.div)`
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  left: 0px;
  width: 100%;
`;

const Box = styled(motion.div)<{ bgPhoto: string }>`
  background-color: white;
  background-image: url(${(props) => props.bgPhoto});
  background-size: cover;
  background-position: center;
  height: 200px;
  font-size: 66px;
  border-radius: 15px;
  cursor: pointer;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

const NextBtn = styled(motion.div)`
  width: 100px;
  height: 200px;
  background-color: rgba(0, 0, 0, 0.8);
  position: absolute;
  right: 0;
  display: flex;
  align-items: center;
  opacity: 0;
`;
const PrevBtn = styled(motion.div)`
  width: 100px;
  height: 200px;
  background-color: rgba(0, 0, 0, 0.8);
  position: absolute;
  left: 0;
  display: flex;
  align-items: center;
  opacity: 0;
`;
const BtnSvg = styled(motion.svg)`
  padding: 40px;
  fill: white;
`;
const InfoWrap = styled.div`
  position: relative;
  height: 200px;
`;

const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: -80px;
  border-radius: 0px 0px 10px 10px;
  height: auto;
  display: none;
  z-index: 1;

  h4 {
    padding-top: 20px;
    margin-bottom: 10px;
    font-size: 18px;
    font-weight: 700;
    text-align: center;
    color: white;
  }
`;

const IconWrap = styled.div`
  width: 100%;
  height: 40px;
  gap: 20px;
  padding-left: 10px;
  display: flex;
  align-items: center;
`;

const InfoIcon = styled.svg`
  width: 30px;
  height: 30px;
  fill: white;
  display: block;
  &:last-child {
    margin-left: 90px;
  }
`;
const InfoText = styled.p`
  padding: 10px;
  font-size: 12px;
  text-transform: uppercase;
  float: left;
`;

const LatestWrap = styled.div`
  position: relative;
  top: 900px;
  background-color: red;
`;

const LatestImg = styled.div<{ bgPhoto: string }>`
  background-image: url(${(props) => props.bgPhoto});
  background-size: cover;
  background-position: center;
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  /* opacity: 0; */
  z-index: 2;
`;

const BigMovie = styled(motion.div)`
  position: absolute;
  width: 40vw;
  height: 150vh;
  padding-bottom: 20px;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 15px;
  /* overflow: hidden; */
  background-color: ${(props) => props.theme.black.lighter};
  z-index: 2;
`;

const BoxVariants = {
  narmal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -50,
    transition: {
      delay: 0.5,
      duration: 0.3,
      type: "tween",
    },
  },
};

const infoVariants = {
  hover: {
    display: "block",
    opacity: 1,
    transition: {
      delay: 0.5,
      duration: 0.3,
      type: "tween",
    },
  },
};

const offset = 6;

function Movies() {
  //windowRisize
  const width = useWindowDimensions();
  const params = useParams();
  //useState
  const [index, setIndex] = useState(0);
  const [topIndex, setTopIndex] = useState(0);
  const [upIndex, setUpIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [back, setBack] = useState(false);
  //slider
  const liVar = {
    entry: (back: boolean) => ({
      x: back ? -width - 5 : width + 5,
      opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (back: boolean) => ({ x: back ? width + 5 : -width - 5, opacity: 0 }),
  };

  const navigate = useNavigate();
  const bigMovieMatch: PathMatch<string> | null = useMatch("/movies/:id");
  const { scrollY } = useViewportScroll();

  // useQuery<get data>
  const { data: latestData, isLoading: latestLoading } =
    useQuery<IGetMoviesLatets>(["movies", "latest"], getLatest);
  const { data: moviesData, isLoading: moviesLoading } =
    useQuery<IGetMoviesResult>(["movies", "nowPlaying"], getMovies);
  const { data: topData, isLoading: topLoading } = useQuery<IGetMoviesTop>(
    ["movies", "topRated"],
    getTopRated
  );
  const { data: upData, isLoading: upLoading } = useQuery<IGetUpComing>(
    ["movies", "upComing"],
    getUpComing
  );
  const { data: detailsData, isLoading: genreLoading } = useQuery<IGetDetails>(
    ["movies", "details"],
    () => getDetails(params.id + "")
  );

  const incraseIndex = (name: number) => {
    if (moviesData) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = moviesData?.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      const result = name >= 0;
      if (result) {
        setBack(false);
        setIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
      } else {
        setBack(true);
        setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
      }
    }
  };

  const topMoviesIndex = (name: number) => {
    if (topData) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = topData?.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      const result = +name >= 0;
      if (result) {
        setBack(false);
        setTopIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
      } else {
        setBack(true);
        setTopIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
      }
    }
  };

  const upComingIndex = (name: number) => {
    if (upData) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = upData?.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      const result = +name >= 0;
      if (result) {
        setBack(false);
        setUpIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
      } else {
        setBack(true);
        setUpIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
      }
    }
  };

  const toggleLeaving = () => setLeaving((prev) => !prev);
  const onBoxClicked = (movieId: number) => {
    navigate(`/movies/${movieId}`);
  };
  const onOverlayClick = () => navigate(`/movies`);
  const clickedMovie =
    bigMovieMatch?.params.id &&
    moviesData?.results.find(
      (movie) => movie.id === Number(bigMovieMatch.params.id)
    );

  return (
    <Wrapper>
      {moviesLoading && upLoading && topLoading ? (
        <Loader>Movies is Loading...</Loader>
      ) : (
        <>
          <Banner
            bgPhoto={makeImagePath(moviesData?.results[0].backdrop_path || "")}
          >
            <Title>{moviesData?.results[0].title}</Title>
            <Overview>{moviesData?.results[0].overview}</Overview>
          </Banner>
          <SliderWrap>
            <SliderTitle>Now Playing</SliderTitle>
            <Slider>
              <AnimatePresence
                custom={back}
                initial={false}
                onExitComplete={toggleLeaving}
              >
                <Row
                  variants={liVar}
                  initial="entry"
                  animate="center"
                  exit="exit"
                  transition={{ type: "tween", duration: 1 }}
                  key={index}
                  custom={back}
                >
                  {moviesData?.results
                    .slice(1)
                    .slice(offset * index, offset * index + offset)
                    .map((movie) => (
                      <Box
                        layoutId={movie.id + ""}
                        key={movie.id}
                        whileHover="hover"
                        initial="normal"
                        variants={BoxVariants}
                        onClick={() => onBoxClicked(movie.id)}
                        transition={{ type: "tween" }}
                        bgPhoto={makeImagePath(movie.backdrop_path, "w500")}
                      >
                        <InfoWrap>
                          <Info variants={infoVariants}>
                            <IconWrap>
                              <InfoIcon
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 512 512"
                              >
                                <path d="M188.3 147.1C195.8 142.8 205.1 142.1 212.5 147.5L356.5 235.5C363.6 239.9 368 247.6 368 256C368 264.4 363.6 272.1 356.5 276.5L212.5 364.5C205.1 369 195.8 369.2 188.3 364.9C180.7 360.7 176 352.7 176 344V167.1C176 159.3 180.7 151.3 188.3 147.1V147.1zM512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256zM256 48C141.1 48 48 141.1 48 256C48 370.9 141.1 464 256 464C370.9 464 464 370.9 464 256C464 141.1 370.9 48 256 48z" />
                              </InfoIcon>
                              <InfoIcon
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 512 512"
                              >
                                <path d="M96 191.1H32c-17.67 0-32 14.33-32 31.1v223.1c0 17.67 14.33 31.1 32 31.1h64c17.67 0 32-14.33 32-31.1V223.1C128 206.3 113.7 191.1 96 191.1zM512 227c0-36.89-30.05-66.92-66.97-66.92h-99.86C354.7 135.1 360 113.5 360 100.8c0-33.8-26.2-68.78-70.06-68.78c-46.61 0-59.36 32.44-69.61 58.5c-31.66 80.5-60.33 66.39-60.33 93.47c0 12.84 10.36 23.99 24.02 23.99c5.256 0 10.55-1.721 14.97-5.26c76.76-61.37 57.97-122.7 90.95-122.7c16.08 0 22.06 12.75 22.06 20.79c0 7.404-7.594 39.55-25.55 71.59c-2.046 3.646-3.066 7.686-3.066 11.72c0 13.92 11.43 23.1 24 23.1h137.6C455.5 208.1 464 216.6 464 227c0 9.809-7.766 18.03-17.67 18.71c-12.66 .8593-22.36 11.4-22.36 23.94c0 15.47 11.39 15.95 11.39 28.91c0 25.37-35.03 12.34-35.03 42.15c0 11.22 6.392 13.03 6.392 22.25c0 22.66-29.77 13.76-29.77 40.64c0 4.515 1.11 5.961 1.11 9.456c0 10.45-8.516 18.95-18.97 18.95h-52.53c-25.62 0-51.02-8.466-71.5-23.81l-36.66-27.51c-4.315-3.245-9.37-4.811-14.38-4.811c-13.85 0-24.03 11.38-24.03 24.04c0 7.287 3.312 14.42 9.596 19.13l36.67 27.52C235 468.1 270.6 480 306.6 480h52.53c35.33 0 64.36-27.49 66.8-62.2c17.77-12.23 28.83-32.51 28.83-54.83c0-3.046-.2187-6.107-.6406-9.122c17.84-12.15 29.28-32.58 29.28-55.28c0-5.311-.6406-10.54-1.875-15.64C499.9 270.1 512 250.2 512 227z" />
                              </InfoIcon>
                              <InfoIcon
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 512 512"
                              >
                                <path d="M0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256zM256 368C269.3 368 280 357.3 280 344V280H344C357.3 280 368 269.3 368 256C368 242.7 357.3 232 344 232H280V168C280 154.7 269.3 144 256 144C242.7 144 232 154.7 232 168V232H168C154.7 232 144 242.7 144 256C144 269.3 154.7 280 168 280H232V344C232 357.3 242.7 368 256 368z" />
                              </InfoIcon>
                              <InfoIcon
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 512 512"
                              >
                                <path d="M244 84L255.1 96L267.1 84.02C300.6 51.37 347 36.51 392.6 44.1C461.5 55.58 512 115.2 512 185.1V190.9C512 232.4 494.8 272.1 464.4 300.4L283.7 469.1C276.2 476.1 266.3 480 256 480C245.7 480 235.8 476.1 228.3 469.1L47.59 300.4C17.23 272.1 0 232.4 0 190.9V185.1C0 115.2 50.52 55.58 119.4 44.1C164.1 36.51 211.4 51.37 244 84C243.1 84 244 84.01 244 84L244 84zM255.1 163.9L210.1 117.1C188.4 96.28 157.6 86.4 127.3 91.44C81.55 99.07 48 138.7 48 185.1V190.9C48 219.1 59.71 246.1 80.34 265.3L256 429.3L431.7 265.3C452.3 246.1 464 219.1 464 190.9V185.1C464 138.7 430.4 99.07 384.7 91.44C354.4 86.4 323.6 96.28 301.9 117.1L255.1 163.9z" />
                              </InfoIcon>
                            </IconWrap>
                            <h4>{movie.title}</h4>

                            <InfoText>
                              {movie.adult
                                ? "청소년관람불가"
                                : "청소년관람가능"}
                            </InfoText>
                            <InfoText>{movie.original_language}</InfoText>
                            <InfoText>{movie.release_date}</InfoText>
                          </Info>
                        </InfoWrap>
                      </Box>
                    ))}
                </Row>
              </AnimatePresence>
              <PrevBtn
                whileHover={{ opacity: 1, transition: { duration: 1 } }}
                onClick={() => incraseIndex(-1)}
              >
                <BtnSvg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 320 512"
                >
                  <path d="M224 480c-8.188 0-16.38-3.125-22.62-9.375l-192-192c-12.5-12.5-12.5-32.75 0-45.25l192-192c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25L77.25 256l169.4 169.4c12.5 12.5 12.5 32.75 0 45.25C240.4 476.9 232.2 480 224 480z" />
                </BtnSvg>
              </PrevBtn>
              <NextBtn
                whileHover={{ opacity: 1, transition: { duration: 1 } }}
                onClick={() => incraseIndex(0)}
              >
                <BtnSvg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 320 512"
                >
                  <path d="M96 480c-8.188 0-16.38-3.125-22.62-9.375c-12.5-12.5-12.5-32.75 0-45.25L242.8 256L73.38 86.63c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0l192 192c12.5 12.5 12.5 32.75 0 45.25l-192 192C112.4 476.9 104.2 480 96 480z" />
                </BtnSvg>
              </NextBtn>
            </Slider>
          </SliderWrap>
          <SliderWrap style={{ top: "300px" }}>
            <SliderTitle>Top Rated</SliderTitle>
            <Slider>
              <AnimatePresence
                custom={back}
                initial={false}
                onExitComplete={toggleLeaving}
              >
                <Row
                  variants={liVar}
                  initial="entry"
                  animate="center"
                  exit="exit"
                  transition={{ type: "tween", duration: 1 }}
                  key={topIndex}
                  custom={back}
                >
                  {topData?.results
                    .slice(1)
                    .slice(offset * topIndex, offset * topIndex + offset)
                    .map((movie) => (
                      <Box
                        layoutId={movie.id + ""}
                        key={movie.id}
                        whileHover="hover"
                        initial="normal"
                        variants={BoxVariants}
                        onClick={() => onBoxClicked(movie.id)}
                        transition={{ type: "tween" }}
                        bgPhoto={makeImagePath(movie.backdrop_path, "w500")}
                      >
                        <InfoWrap>
                          <Info variants={infoVariants}>
                            <IconWrap>
                              <InfoIcon
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 512 512"
                              >
                                <path d="M188.3 147.1C195.8 142.8 205.1 142.1 212.5 147.5L356.5 235.5C363.6 239.9 368 247.6 368 256C368 264.4 363.6 272.1 356.5 276.5L212.5 364.5C205.1 369 195.8 369.2 188.3 364.9C180.7 360.7 176 352.7 176 344V167.1C176 159.3 180.7 151.3 188.3 147.1V147.1zM512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256zM256 48C141.1 48 48 141.1 48 256C48 370.9 141.1 464 256 464C370.9 464 464 370.9 464 256C464 141.1 370.9 48 256 48z" />
                              </InfoIcon>
                              <InfoIcon
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 512 512"
                              >
                                <path d="M96 191.1H32c-17.67 0-32 14.33-32 31.1v223.1c0 17.67 14.33 31.1 32 31.1h64c17.67 0 32-14.33 32-31.1V223.1C128 206.3 113.7 191.1 96 191.1zM512 227c0-36.89-30.05-66.92-66.97-66.92h-99.86C354.7 135.1 360 113.5 360 100.8c0-33.8-26.2-68.78-70.06-68.78c-46.61 0-59.36 32.44-69.61 58.5c-31.66 80.5-60.33 66.39-60.33 93.47c0 12.84 10.36 23.99 24.02 23.99c5.256 0 10.55-1.721 14.97-5.26c76.76-61.37 57.97-122.7 90.95-122.7c16.08 0 22.06 12.75 22.06 20.79c0 7.404-7.594 39.55-25.55 71.59c-2.046 3.646-3.066 7.686-3.066 11.72c0 13.92 11.43 23.1 24 23.1h137.6C455.5 208.1 464 216.6 464 227c0 9.809-7.766 18.03-17.67 18.71c-12.66 .8593-22.36 11.4-22.36 23.94c0 15.47 11.39 15.95 11.39 28.91c0 25.37-35.03 12.34-35.03 42.15c0 11.22 6.392 13.03 6.392 22.25c0 22.66-29.77 13.76-29.77 40.64c0 4.515 1.11 5.961 1.11 9.456c0 10.45-8.516 18.95-18.97 18.95h-52.53c-25.62 0-51.02-8.466-71.5-23.81l-36.66-27.51c-4.315-3.245-9.37-4.811-14.38-4.811c-13.85 0-24.03 11.38-24.03 24.04c0 7.287 3.312 14.42 9.596 19.13l36.67 27.52C235 468.1 270.6 480 306.6 480h52.53c35.33 0 64.36-27.49 66.8-62.2c17.77-12.23 28.83-32.51 28.83-54.83c0-3.046-.2187-6.107-.6406-9.122c17.84-12.15 29.28-32.58 29.28-55.28c0-5.311-.6406-10.54-1.875-15.64C499.9 270.1 512 250.2 512 227z" />
                              </InfoIcon>
                              <InfoIcon
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 512 512"
                              >
                                <path d="M0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256zM256 368C269.3 368 280 357.3 280 344V280H344C357.3 280 368 269.3 368 256C368 242.7 357.3 232 344 232H280V168C280 154.7 269.3 144 256 144C242.7 144 232 154.7 232 168V232H168C154.7 232 144 242.7 144 256C144 269.3 154.7 280 168 280H232V344C232 357.3 242.7 368 256 368z" />
                              </InfoIcon>
                              <InfoIcon
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 512 512"
                              >
                                <path d="M244 84L255.1 96L267.1 84.02C300.6 51.37 347 36.51 392.6 44.1C461.5 55.58 512 115.2 512 185.1V190.9C512 232.4 494.8 272.1 464.4 300.4L283.7 469.1C276.2 476.1 266.3 480 256 480C245.7 480 235.8 476.1 228.3 469.1L47.59 300.4C17.23 272.1 0 232.4 0 190.9V185.1C0 115.2 50.52 55.58 119.4 44.1C164.1 36.51 211.4 51.37 244 84C243.1 84 244 84.01 244 84L244 84zM255.1 163.9L210.1 117.1C188.4 96.28 157.6 86.4 127.3 91.44C81.55 99.07 48 138.7 48 185.1V190.9C48 219.1 59.71 246.1 80.34 265.3L256 429.3L431.7 265.3C452.3 246.1 464 219.1 464 190.9V185.1C464 138.7 430.4 99.07 384.7 91.44C354.4 86.4 323.6 96.28 301.9 117.1L255.1 163.9z" />
                              </InfoIcon>
                            </IconWrap>
                            <h4>{movie.title}</h4>

                            <InfoText>
                              {movie.adult
                                ? "청소년관람불가"
                                : "청소년관람가능"}
                            </InfoText>
                            <InfoText>{movie.original_language}</InfoText>
                            <InfoText>{movie.release_date}</InfoText>
                          </Info>
                        </InfoWrap>
                      </Box>
                    ))}
                </Row>
              </AnimatePresence>
              <PrevBtn
                whileHover={{ opacity: 1, transition: { duration: 1 } }}
                onClick={() => topMoviesIndex(-1)}
              >
                <BtnSvg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 320 512"
                >
                  <path d="M224 480c-8.188 0-16.38-3.125-22.62-9.375l-192-192c-12.5-12.5-12.5-32.75 0-45.25l192-192c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25L77.25 256l169.4 169.4c12.5 12.5 12.5 32.75 0 45.25C240.4 476.9 232.2 480 224 480z" />
                </BtnSvg>
              </PrevBtn>
              <NextBtn
                whileHover={{ opacity: 1, transition: { duration: 1 } }}
                onClick={() => topMoviesIndex(0)}
              >
                <BtnSvg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 320 512"
                >
                  <path d="M96 480c-8.188 0-16.38-3.125-22.62-9.375c-12.5-12.5-12.5-32.75 0-45.25L242.8 256L73.38 86.63c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0l192 192c12.5 12.5 12.5 32.75 0 45.25l-192 192C112.4 476.9 104.2 480 96 480z" />
                </BtnSvg>
              </NextBtn>
            </Slider>
          </SliderWrap>
          <SliderWrap style={{ top: "600px" }}>
            <SliderTitle>Up-Coming</SliderTitle>
            <Slider>
              <AnimatePresence
                custom={back}
                initial={false}
                onExitComplete={toggleLeaving}
              >
                <Row
                  variants={liVar}
                  initial="entry"
                  animate="center"
                  exit="exit"
                  transition={{ type: "tween", duration: 1 }}
                  key={upIndex}
                  custom={back}
                >
                  {upData?.results
                    .slice(1)
                    .slice(offset * upIndex, offset * upIndex + offset)
                    .map((movie) => (
                      <Box
                        layoutId={movie.id + ""}
                        key={movie.id}
                        whileHover="hover"
                        initial="normal"
                        variants={BoxVariants}
                        onClick={() => onBoxClicked(movie.id)}
                        transition={{ type: "tween" }}
                        bgPhoto={makeImagePath(movie.backdrop_path, "w500")}
                      >
                        <InfoWrap>
                          <Info variants={infoVariants}>
                            <IconWrap>
                              <InfoIcon
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 512 512"
                              >
                                <path d="M188.3 147.1C195.8 142.8 205.1 142.1 212.5 147.5L356.5 235.5C363.6 239.9 368 247.6 368 256C368 264.4 363.6 272.1 356.5 276.5L212.5 364.5C205.1 369 195.8 369.2 188.3 364.9C180.7 360.7 176 352.7 176 344V167.1C176 159.3 180.7 151.3 188.3 147.1V147.1zM512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256zM256 48C141.1 48 48 141.1 48 256C48 370.9 141.1 464 256 464C370.9 464 464 370.9 464 256C464 141.1 370.9 48 256 48z" />
                              </InfoIcon>
                              <InfoIcon
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 512 512"
                              >
                                <path d="M96 191.1H32c-17.67 0-32 14.33-32 31.1v223.1c0 17.67 14.33 31.1 32 31.1h64c17.67 0 32-14.33 32-31.1V223.1C128 206.3 113.7 191.1 96 191.1zM512 227c0-36.89-30.05-66.92-66.97-66.92h-99.86C354.7 135.1 360 113.5 360 100.8c0-33.8-26.2-68.78-70.06-68.78c-46.61 0-59.36 32.44-69.61 58.5c-31.66 80.5-60.33 66.39-60.33 93.47c0 12.84 10.36 23.99 24.02 23.99c5.256 0 10.55-1.721 14.97-5.26c76.76-61.37 57.97-122.7 90.95-122.7c16.08 0 22.06 12.75 22.06 20.79c0 7.404-7.594 39.55-25.55 71.59c-2.046 3.646-3.066 7.686-3.066 11.72c0 13.92 11.43 23.1 24 23.1h137.6C455.5 208.1 464 216.6 464 227c0 9.809-7.766 18.03-17.67 18.71c-12.66 .8593-22.36 11.4-22.36 23.94c0 15.47 11.39 15.95 11.39 28.91c0 25.37-35.03 12.34-35.03 42.15c0 11.22 6.392 13.03 6.392 22.25c0 22.66-29.77 13.76-29.77 40.64c0 4.515 1.11 5.961 1.11 9.456c0 10.45-8.516 18.95-18.97 18.95h-52.53c-25.62 0-51.02-8.466-71.5-23.81l-36.66-27.51c-4.315-3.245-9.37-4.811-14.38-4.811c-13.85 0-24.03 11.38-24.03 24.04c0 7.287 3.312 14.42 9.596 19.13l36.67 27.52C235 468.1 270.6 480 306.6 480h52.53c35.33 0 64.36-27.49 66.8-62.2c17.77-12.23 28.83-32.51 28.83-54.83c0-3.046-.2187-6.107-.6406-9.122c17.84-12.15 29.28-32.58 29.28-55.28c0-5.311-.6406-10.54-1.875-15.64C499.9 270.1 512 250.2 512 227z" />
                              </InfoIcon>
                              <InfoIcon
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 512 512"
                              >
                                <path d="M0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256zM256 368C269.3 368 280 357.3 280 344V280H344C357.3 280 368 269.3 368 256C368 242.7 357.3 232 344 232H280V168C280 154.7 269.3 144 256 144C242.7 144 232 154.7 232 168V232H168C154.7 232 144 242.7 144 256C144 269.3 154.7 280 168 280H232V344C232 357.3 242.7 368 256 368z" />
                              </InfoIcon>
                              <InfoIcon
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 512 512"
                              >
                                <path d="M244 84L255.1 96L267.1 84.02C300.6 51.37 347 36.51 392.6 44.1C461.5 55.58 512 115.2 512 185.1V190.9C512 232.4 494.8 272.1 464.4 300.4L283.7 469.1C276.2 476.1 266.3 480 256 480C245.7 480 235.8 476.1 228.3 469.1L47.59 300.4C17.23 272.1 0 232.4 0 190.9V185.1C0 115.2 50.52 55.58 119.4 44.1C164.1 36.51 211.4 51.37 244 84C243.1 84 244 84.01 244 84L244 84zM255.1 163.9L210.1 117.1C188.4 96.28 157.6 86.4 127.3 91.44C81.55 99.07 48 138.7 48 185.1V190.9C48 219.1 59.71 246.1 80.34 265.3L256 429.3L431.7 265.3C452.3 246.1 464 219.1 464 190.9V185.1C464 138.7 430.4 99.07 384.7 91.44C354.4 86.4 323.6 96.28 301.9 117.1L255.1 163.9z" />
                              </InfoIcon>
                            </IconWrap>
                            <h4>{movie.title}</h4>

                            <InfoText>
                              {movie.adult
                                ? "청소년관람불가"
                                : "청소년관람가능"}
                            </InfoText>
                            <InfoText>{movie.original_language}</InfoText>
                            <InfoText>{movie.release_date}</InfoText>
                          </Info>
                        </InfoWrap>
                      </Box>
                    ))}
                </Row>
              </AnimatePresence>
              <PrevBtn
                whileHover={{ opacity: 1, transition: { duration: 1 } }}
                onClick={() => upComingIndex(-1)}
              >
                <BtnSvg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 320 512"
                >
                  <path d="M224 480c-8.188 0-16.38-3.125-22.62-9.375l-192-192c-12.5-12.5-12.5-32.75 0-45.25l192-192c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25L77.25 256l169.4 169.4c12.5 12.5 12.5 32.75 0 45.25C240.4 476.9 232.2 480 224 480z" />
                </BtnSvg>
              </PrevBtn>
              <NextBtn
                whileHover={{ opacity: 1, transition: { duration: 1 } }}
                onClick={() => upComingIndex(0)}
              >
                <BtnSvg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 320 512"
                >
                  <path d="M96 480c-8.188 0-16.38-3.125-22.62-9.375c-12.5-12.5-12.5-32.75 0-45.25L242.8 256L73.38 86.63c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0l192 192c12.5 12.5 12.5 32.75 0 45.25l-192 192C112.4 476.9 104.2 480 96 480z" />
                </BtnSvg>
              </NextBtn>
            </Slider>
          </SliderWrap>
          <LatestWrap></LatestWrap>
          <AnimatePresence>
            {bigMovieMatch ? (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
                <BigMovie
                  layoutId={bigMovieMatch.params.id}
                  style={{
                    top: scrollY.get() + 100,
                  }}
                >
                  <Details></Details>
                </BigMovie>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}

export default Movies;
