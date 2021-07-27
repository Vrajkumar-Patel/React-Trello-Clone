import React from "react";
import "./App.css";
import Sidebar from "./components/Sidebar";
import Home from "./components/Home";
import { DragDropContext } from "react-beautiful-dnd";
import { useSelector, useDispatch } from 'react-redux'
import { StateType } from "./redux/store";
import { setChangeCardInDifferentPhase, setChangeCardInSamePhase, setDragDestinationData } from "./redux/ListsReducer";

// const MyButton = styled(Button)({
//   background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
//   color: "white",
//   fontWeight: "bold",
//   textTransform: "capitalize",
// });

function App() {

  const dispatch = useDispatch();

  const { lists } = useSelector((state: StateType) => state.lists);
  console.log(lists);
  

  const onDragEnd = (results: any) => {
    const { draggableId, source, destination, type } = results;

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
      const phaseKey = Object.keys(lists).find(key => lists[key].id === source.droppableId )
      dispatch(setChangeCardInSamePhase({
        phaseKey: phaseKey!,
        cardStartIndex: source.index,
        cardEndIndex: destination.index
      }))
    }

    if (
      source.droppableId !== destination.droppableId
    ) {
      const sourcePhaseKey = Object.keys(lists).find(key => lists[key].id === source.droppableId )
      const destinationPhaseKey = Object.keys(lists).find(key => lists[key].id === destination.droppableId )
      dispatch(setChangeCardInDifferentPhase({
        sourcePhaseKey: sourcePhaseKey!,
        destinationPhaseKey: destinationPhaseKey!,
        cardStartIndex: source.index,
        cardEndIndex: destination.index,
      }))
    }
  }

  const onDragUpdate = (results: any) => {
    const { destination, draggableId, source } = results;
    dispatch(setDragDestinationData(destination))
  }

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
