import React from "react";
import Phase from "./Phase";
import { useSelector } from "react-redux";
import { StateType } from "../redux/store";

const Phases: React.FC = () => {
  const { lists } = useSelector((state: StateType) => state.lists);

  return (
    <div className="phases">
      {Object.entries(lists).map((phase, index) => (
        <Phase phaseKey={phase[0]} phaseValue={phase[1]} key={phase[1].id} />
      ))}
    </div>
  );
};

export default Phases;
