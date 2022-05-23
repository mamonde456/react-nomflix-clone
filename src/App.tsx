import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Details from "./Components/Details";
import DetailsTv from "./Components/DetailsTv";
import Header from "./Components/Header";
import Home from "./Routes/Home";
import Movies from "./Routes/Movies";
import Search from "./Routes/Search";
import Tv from "./Routes/Tv";
function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movies" element={<Movies />}>
          <Route path="/movies/:id" element={<Details />} />
        </Route>
        <Route path="/tv" element={<Tv />}>
          <Route path="/tv/:id" element={<DetailsTv />} />
        </Route>
        <Route path="/search" element={<Search />}>
          <Route path="/search/movies/:id" element={<Details />} />
          <Route path="/search/tv/:id" element={<DetailsTv />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
