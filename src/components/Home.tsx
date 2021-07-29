import React from "react";

//Components Imports
import Header from "./Header";
import Phases from "./Phases";

const Home: React.FC = () => {
  return (
    <div className="home">
      <Header />
      <h2>Board</h2>
      <Phases />
    </div>
  );
};

export default Home;
