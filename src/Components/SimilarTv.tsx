import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { getSimilarTv, IGetSimilar, IGetSimilarTv } from "../api";
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

const Tv = styled(motion.div)<{ bgPhoto: string }>`
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

function SimilarTv() {
  const params = useParams();
  const [similarIndex, setSimilarIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);

  const navigate = useNavigate();

  const { data: similarData, isLoading: similarLoading } =
    useQuery<IGetSimilarTv>("similar", () => getSimilarTv(params.id + ""));
  console.log(similarData);
  const toggleLeaving = () => setLeaving((prev) => !prev);
  const onBoxClicked = (TvId: number) => {
    navigate(`/tv/${TvId}`);
  };

  return (
    <Wrapper>
      {similarLoading ? (
        <Loader>Similar Tv is loading...</Loader>
      ) : (
        <>
          <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
            <Title>Similar Tv</Title>
            <Row transition={{ type: "tween", duration: 1 }} key={similarIndex}>
              {similarData?.results
                .slice(1)
                .slice(offset * similarIndex, offset * similarIndex + offset)
                .map((tv) => (
                  <Tv
                    layoutId={tv.id + ""}
                    key={tv.id}
                    whileHover="hover"
                    initial="normal"
                    variants={BoxVariants}
                    onClick={() => onBoxClicked(tv.id)}
                    transition={{ type: "tween" }}
                    bgPhoto={makeImagePath(tv.backdrop_path, "w500")}
                  ></Tv>
                ))}
            </Row>
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}

export default SimilarTv;
