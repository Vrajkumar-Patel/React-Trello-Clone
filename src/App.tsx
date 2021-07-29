import React from "react";
import "./App.css";

// Dependencies Imports
import { DragDropContext } from "react-beautiful-dnd";
import { useSelector, useDispatch } from "react-redux";

// Components Imports
import {
  setChangeCardInDifferentPhase,
  setChangeCardInSamePhase,
  setDragDestinationData,
} from "./redux/ListsReducer";
import { StateType } from "./redux/store";
import Sidebar from "./components/Sidebar";
import Home from "./components/Home";


function App() {
  const dispatch = useDispatch();

  const { lists } = useSelector((state: StateType) => state.lists);
  console.log(lists);

  const onDragEnd = (results: any) => {
    const { source, destination } = results;

    if (!destination) {
      return;
    }

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    if (
      source.droppableId === destination.droppableId &&
      source.index !== destination.index
    ) {
      const phaseKey = Object.keys(lists).find(
        (key) => lists[key].id === source.droppableId
      );
      dispatch(
        setChangeCardInSamePhase({
          phaseKey: phaseKey!,
          cardStartIndex: source.index,
          cardEndIndex: destination.index,
        })
      );
    }

    if (source.droppableId !== destination.droppableId) {
      const sourcePhaseKey = Object.keys(lists).find(
        (key) => lists[key].id === source.droppableId
      );
      const destinationPhaseKey = Object.keys(lists).find(
        (key) => lists[key].id === destination.droppableId
      );
      dispatch(
        setChangeCardInDifferentPhase({
          sourcePhaseKey: sourcePhaseKey!,
          destinationPhaseKey: destinationPhaseKey!,
          cardStartIndex: source.index,
          cardEndIndex: destination.index,
        })
      );
    }
  };

  const onDragUpdate = (results: any) => {
    const { destination, draggableId, source } = results;
    dispatch(setDragDestinationData(destination));
  };

  return (
    <DragDropContext onDragEnd={onDragEnd} onDragUpdate={onDragUpdate}>
      <div className="app">
        <Sidebar />
        <Home />
      </div>
    </DragDropContext>
  );
}

export default App;
