import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { getPopular, IGetPopular } from "../api";
import { makeImagePath } from "../untils";

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: black;
  padding-bottom: 200px;
  overflow: hidden;
  h1 {
    width: 350px;
    height: 100px;
    position: absolute;
    left: 50vw;
    margin-left: -175px;
    top: 50vh;
    margin-top: -50px;
    font-size: 48px;
    font-weight: 700;
    z-index: 9;
  }
`;

const BoxWrap = styled.div`
  width: 100%;
  height: 100vh;
`;
const MoviesBox = styled.div`
  width: 300px;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  row-gap: 20px;
  column-gap: 10px;
  float: left;
  margin-left: 10px;
  /* &:nth-child(even) {
    position: relative;
    top: -225px;
  } */
`;

const Overlay = styled.div`
  width: 100vw;
  height: 100vh;
  position: absolute;
  left: 0;
  top: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 2;
`;

const Movie = styled.div<{ bgPhoto: string }>`
  background-image: url(${(props) => props.bgPhoto});
  background-size: cover;
  background-position: center;
  width: 300px;
  height: 450px;
  background-color: red;
  float: left;
  &:nth-child(even) {
    background-color: blue;
    position: relative;
    top: -225px;
  }
`;

function Home() {
  const { data, isLoading } = useQuery<IGetPopular>(
    ["movies", "popular"],
    getPopular
  );
  return (
    <Wrapper>
      <Link to={"/movies"}>
        <h1>Nomflix Start</h1>
      </Link>
      <BoxWrap>
        <MoviesBox>
          {data?.results.map((movie) => (
            <Movie
              key={movie.id}
              bgPhoto={makeImagePath(movie.poster_path, "w500")}
            ></Movie>
          ))}
        </MoviesBox>
      </BoxWrap>
      <Overlay />
    </Wrapper>
  );
}

export default Home;
