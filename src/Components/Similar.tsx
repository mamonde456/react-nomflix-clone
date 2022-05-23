import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { getSimilar, IGetSimilar } from "../api";
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
const Row = styled(motion.div)`
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(2, 1fr);
  position: absolute;
  left: 20px;
  width: 95%;
`;

const Movie = styled(motion.div)<{ bgPhoto: string }>`
  background-color: white;
  background-image: url(${(props) => props.bgPhoto});
  background-size: cover;
  background-position: center;
  height: 200px;
  font-size: 66px;
  border-radius: 15px;

  cursor: pointer;
  transform-origin: center left;
  &:nth-child(even) {
    transform-origin: center right;
  }
`;

const Title = styled.h3`
  width: 100%;
  height: 50px;
  padding: 10px;
  position: relative;
  left: 15px;
  font-size: 30px;
  font-weight: 700;
`;
const offset = 6;

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

function Similar() {
  const params = useParams();
  const [similarIndex, setSimilarIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);

  const navigate = useNavigate();

  const { data: similarData, isLoading: similarLoading } =
    useQuery<IGetSimilar>("similar", () => getSimilar(params.id + ""));

  const toggleLeaving = () => setLeaving((prev) => !prev);
  const onBoxClicked = (movieId: number) => {
    navigate(`/movies/${movieId}`);
  };

  return (
    <Wrapper>
      {similarLoading ? (
        <Loader>Similar Movies is loading...</Loader>
      ) : (
        <>
          <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
            <Title>Similar Movies</Title>
            <Row transition={{ type: "tween", duration: 1 }} key={similarIndex}>
              {similarData?.results
                .slice(1)
                .slice(offset * similarIndex, offset * similarIndex + offset)
                .map((movie) => (
                  <Movie
                    layoutId={movie.id + ""}
                    key={movie.id}
                    whileHover="hover"
                    initial="normal"
                    variants={BoxVariants}
                    onClick={() => onBoxClicked(movie.id)}
                    transition={{ type: "tween" }}
                    bgPhoto={makeImagePath(movie.backdrop_path, "w500")}
                  ></Movie>
                ))}
            </Row>
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}

export default Similar;
