// import { useState } from 'react'
// import reactLogo from './assets/react.svg';
// import viteLogo from '/vite.svg';
import "./App.css";
import Button from "@mui/material/Button";
import MainContent from "./components/MainContent";
import Container from "@mui/material/Container";

function App() {
  // const [count, setCount] = useState(0)

  return (
    <>
      <div
      className="container"
        style={{
          display: "flex",
          jusifyContent: "center",
          alignItems: "center",
          flexWrap: "wrap",
          width: "100vw",
        }}
      >
        <Container maxWidth="la">
          <MainContent />
        </Container>
      </div>
    </>
  );
}

export default App;
