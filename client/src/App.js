import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Lobby } from "./pages/Lobby";
import { BlockCode } from "./pages/BlockCode";
import './App.css';


function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Lobby/>}></Route>
          <Route path="/blockcode/:blockcodeId" element={<BlockCode/>}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
