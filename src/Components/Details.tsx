import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { getDetails, IGetDetails } from "../api";
import { makeImagePath } from "../untils";
import Similar from "./Similar";
const Wrapper = styled.div`
  padding-bottom: 200px;
`;

const BigCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 400px;
  border-radius: 15px 15px 0px 0px;
`;

const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  padding: 20px;
  font-size: 46px;

  font-weight: 700;
`;

const BigIconWrap = styled.div`
  width: 100%;
  height: 50px;
  position: absolute;
  top: 340px;
`;

const BigPlayBtn = styled.div`
  width: 120px;
  height: 50px;
  position: absolute;
  top: 0px;
  left: 20px;
  border: solid 1px rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  gap: 20px;
  span {
    font-size: 20px;
    font-weight: 700;
    padding: 10px;
  }
`;

const BigPlayIcon = styled.svg`
  position: relative;
  top: 0px;
  left: 15px;
  width: 25px;
  height: 25px;
  fill: white;
`;

const IconWrap = styled.div`
  width: 180px;
  position: absolute;
  top: 5px;
  left: 160px;
  fill: white;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const BigIcon = styled.svg`
  width: 40px;
  margin-right: 10px;
  &:last-child {
    position: relative;
    left: 400px;
  }
`;

const BigOverview = styled.div`
  padding: 20px;
  height: 200px;
  margin-bottom: 20px;
  position: relative;
  top: 0px;
  color: ${(props) => props.theme.white.lighter};
  span {
    font-size: 12px;
    color: rgb(126, 236, 126);
    font-weight: 700;
    margin-right: 10px;
    float: left;
  }
  p {
    font-size: 28px;
    font-weight: 700;
    margin-bottom: 10px;
  }
`;

const Genres = styled.div`
  width: 100%;
  margin-top: 10px;
  padding: 10px;
`;

const Genre = styled.span`
  color: rgb(139, 120, 120) !important;
`;

const RunTime = styled.p`
  width: 100%;
  height: 20px;
  margin: 20px 0px 0px 0px;
  span {
    color: white;
    font-size: 18px;
    &:first-child {
    }
  }
`;

interface RouteParams {
  movieId: string;
  tvId: string;
}
const Details = () => {
  let params = useParams();
  const { data: detailsData, isLoading: detailsLoading } =
    useQuery<IGetDetails>("details", () => getDetails(params.id + ""));
  console.log(params.id);
  const time = detailsData?.runtime;
  const timeHour = time && Math.floor(time / 60);
  const timeMinutes = time && time % 60;
  return (
    <Wrapper>
      {detailsData && (
        <>
          <BigCover
            style={{
              backgroundImage: detailsData?.backdrop_path
                ? `linear-gradient(to top, black, transparent), url(${makeImagePath(
                    detailsData?.backdrop_path,
                    "w500"
                  )})`
                : "no poster",
            }}
          />
          <BigTitle>{detailsData?.title}</BigTitle>
          <BigIconWrap>
            <BigPlayBtn>
              <BigPlayIcon
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 384 512"
              >
                <path d="M361 215C375.3 223.8 384 239.3 384 256C384 272.7 375.3 288.2 361 296.1L73.03 472.1C58.21 482 39.66 482.4 24.52 473.9C9.377 465.4 0 449.4 0 432V80C0 62.64 9.377 46.63 24.52 38.13C39.66 29.64 58.21 29.99 73.03 39.04L361 215z" />
              </BigPlayIcon>
              <span>Play</span>
            </BigPlayBtn>
            <IconWrap>
              <BigIcon xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                <path d="M200 344V280H136C122.7 280 112 269.3 112 256C112 242.7 122.7 232 136 232H200V168C200 154.7 210.7 144 224 144C237.3 144 248 154.7 248 168V232H312C325.3 232 336 242.7 336 256C336 269.3 325.3 280 312 280H248V344C248 357.3 237.3 368 224 368C210.7 368 200 357.3 200 344zM0 96C0 60.65 28.65 32 64 32H384C419.3 32 448 60.65 448 96V416C448 451.3 419.3 480 384 480H64C28.65 480 0 451.3 0 416V96zM48 96V416C48 424.8 55.16 432 64 432H384C392.8 432 400 424.8 400 416V96C400 87.16 392.8 80 384 80H64C55.16 80 48 87.16 48 96z" />
              </BigIcon>
              <BigIcon xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path d="M96 191.1H32c-17.67 0-32 14.33-32 31.1v223.1c0 17.67 14.33 31.1 32 31.1h64c17.67 0 32-14.33 32-31.1V223.1C128 206.3 113.7 191.1 96 191.1zM512 227c0-36.89-30.05-66.92-66.97-66.92h-99.86C354.7 135.1 360 113.5 360 100.8c0-33.8-26.2-68.78-70.06-68.78c-46.61 0-59.36 32.44-69.61 58.5c-31.66 80.5-60.33 66.39-60.33 93.47c0 12.84 10.36 23.99 24.02 23.99c5.256 0 10.55-1.721 14.97-5.26c76.76-61.37 57.97-122.7 90.95-122.7c16.08 0 22.06 12.75 22.06 20.79c0 7.404-7.594 39.55-25.55 71.59c-2.046 3.646-3.066 7.686-3.066 11.72c0 13.92 11.43 23.1 24 23.1h137.6C455.5 208.1 464 216.6 464 227c0 9.809-7.766 18.03-17.67 18.71c-12.66 .8593-22.36 11.4-22.36 23.94c0 15.47 11.39 15.95 11.39 28.91c0 25.37-35.03 12.34-35.03 42.15c0 11.22 6.392 13.03 6.392 22.25c0 22.66-29.77 13.76-29.77 40.64c0 4.515 1.11 5.961 1.11 9.456c0 10.45-8.516 18.95-18.97 18.95h-52.53c-25.62 0-51.02-8.466-71.5-23.81l-36.66-27.51c-4.315-3.245-9.37-4.811-14.38-4.811c-13.85 0-24.03 11.38-24.03 24.04c0 7.287 3.312 14.42 9.596 19.13l36.67 27.52C235 468.1 270.6 480 306.6 480h52.53c35.33 0 64.36-27.49 66.8-62.2c17.77-12.23 28.83-32.51 28.83-54.83c0-3.046-.2187-6.107-.6406-9.122c17.84-12.15 29.28-32.58 29.28-55.28c0-5.311-.6406-10.54-1.875-15.64C499.9 270.1 512 250.2 512 227z" />
              </BigIcon>
              <BigIcon xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path d="M244 84L255.1 96L267.1 84.02C300.6 51.37 347 36.51 392.6 44.1C461.5 55.58 512 115.2 512 185.1V190.9C512 232.4 494.8 272.1 464.4 300.4L283.7 469.1C276.2 476.1 266.3 480 256 480C245.7 480 235.8 476.1 228.3 469.1L47.59 300.4C17.23 272.1 0 232.4 0 190.9V185.1C0 115.2 50.52 55.58 119.4 44.1C164.1 36.51 211.4 51.37 244 84C243.1 84 244 84.01 244 84L244 84zM255.1 163.9L210.1 117.1C188.4 96.28 157.6 86.4 127.3 91.44C81.55 99.07 48 138.7 48 185.1V190.9C48 219.1 59.71 246.1 80.34 265.3L256 429.3L431.7 265.3C452.3 246.1 464 219.1 464 190.9V185.1C464 138.7 430.4 99.07 384.7 91.44C354.4 86.4 323.6 96.28 301.9 117.1L255.1 163.9z" />
              </BigIcon>
              <BigIcon xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                <path d="M301.2 34.85c-11.5-5.188-25.02-3.122-34.44 5.253L131.8 160H48c-26.51 0-48 21.49-48 47.1v95.1c0 26.51 21.49 47.1 48 47.1h83.84l134.9 119.9c5.984 5.312 13.58 8.094 21.26 8.094c4.438 0 8.972-.9375 13.17-2.844c11.5-5.156 18.82-16.56 18.82-29.16V64C319.1 51.41 312.7 40 301.2 34.85zM513.9 255.1l47.03-47.03c9.375-9.375 9.375-24.56 0-33.94s-24.56-9.375-33.94 0L480 222.1L432.1 175c-9.375-9.375-24.56-9.375-33.94 0s-9.375 24.56 0 33.94l47.03 47.03l-47.03 47.03c-9.375 9.375-9.375 24.56 0 33.94c9.373 9.373 24.56 9.381 33.94 0L480 289.9l47.03 47.03c9.373 9.373 24.56 9.381 33.94 0c9.375-9.375 9.375-24.56 0-33.94L513.9 255.1z" />
              </BigIcon>
            </IconWrap>
          </BigIconWrap>

          <BigOverview>
            {detailsData?.release_date.slice(0, 4) === "2022" ? (
              <>
                <span>New</span>
                <p>{detailsData?.release_date.slice(0, 4)}</p>
              </>
            ) : (
              <p>{detailsData?.release_date.slice(0, 4)}</p>
            )}
            {detailsData?.overview}
            <RunTime>
              <span>runtime: </span>
              <span>{`${timeHour}H ${timeMinutes}M`}</span>
            </RunTime>
            <Genres>
              {detailsData?.genres.map((n) => (
                <Genre key={n.id}>{n.name}</Genre>
              ))}
            </Genres>
          </BigOverview>
        </>
      )}
      <Similar />
    </Wrapper>
  );
};

export default Details;
