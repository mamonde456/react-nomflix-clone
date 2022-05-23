import { AnimatePresence, motion } from "framer-motion";
import { useQuery } from "react-query";
import { Navigate, useLocation, useMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { getSearch, IGetSearch } from "../api";
import { makeImagePath } from "../untils";

const Wrapper = styled.div`
  padding-bottom: 200px;
`;
const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const BoxWrap = styled.div`
  width: 100%;
  padding: 60px;
`;
const Title = styled.h1`
  width: 100%;
  margin-bottom: 20px;
  padding: 10px;
  font-size: 32px;
  padding-top: 100px;
`;
const BoxContainer = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 10px;
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
const InfoWrap = styled.div`
  position: relative;
  height: 200px;
`;

const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  /* opacity: 0; */
  position: absolute;
  width: 100%;
  bottom: 0px;
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

function Search() {
  const navigate = useNavigate();
  const location = useLocation();
  const movieMacth = useMatch(`/search/movie/:id`);
  const tvMacth = useMatch(`/search/tv/:id`);
  const keyword = new URLSearchParams(location.search).get("keyword");
  // console.log(keyword);
  const { data, isLoading } = useQuery<IGetSearch>(["search", keyword], () =>
    getSearch(keyword + "")
  );
  console.log(data?.results);
  const onBoxClicked = (mediaType: string, searchId: number) => {
    if (mediaType === "movie") {
      navigate(`/search/movies/${searchId}`);
    } else if (mediaType === "tv") {
      navigate(`/search/tv/${searchId}`);
    }
  };
  return (
    <Wrapper>
      {isLoading ? (
        <Loader>...Loading</Loader>
      ) : (
        <>
          <BoxWrap>
            <Title>Movie Search Results</Title>
            <BoxContainer>
              {data?.results.map((movie) => (
                <AnimatePresence>
                  {movie.media_type === "movie" && (
                    <Box
                      layoutId={movie.id + ""}
                      key={movie.id}
                      whileHover="hover"
                      initial="normal"
                      variants={BoxVariants}
                      onClick={() => {
                        onBoxClicked(movie.media_type, movie.id);
                      }}
                      transition={{ type: "tween" }}
                      bgPhoto={
                        movie.backdrop_path
                          ? makeImagePath(movie.backdrop_path, "w500")
                          : makeImagePath(movie.poster_path, "w500")
                      }
                    >
                      <InfoWrap>
                        <Info variants={infoVariants}>
                          <h4>{movie.title}</h4>
                        </Info>
                      </InfoWrap>
                    </Box>
                  )}
                </AnimatePresence>
              ))}
            </BoxContainer>
          </BoxWrap>
          <BoxWrap>
            <Title>Tv Search Results</Title>
            <BoxContainer>
              {data?.results.map((tv) => (
                <AnimatePresence>
                  {tv.media_type === "tv" && (
                    <Box
                      layoutId={tv.id + ""}
                      key={tv.id}
                      whileHover="hover"
                      initial="normal"
                      variants={BoxVariants}
                      onClick={() => {
                        onBoxClicked(tv.media_type, tv.id);
                      }}
                      transition={{ type: "tween" }}
                      bgPhoto={makeImagePath(tv.backdrop_path, "w500")}
                    >
                      <InfoWrap>
                        <Info variants={infoVariants}>
                          <h4>{tv.title}</h4>
                        </Info>
                      </InfoWrap>
                    </Box>
                  )}
                </AnimatePresence>
              ))}
            </BoxContainer>
          </BoxWrap>
        </>
      )}
    </Wrapper>
  );
}

export default Search;
