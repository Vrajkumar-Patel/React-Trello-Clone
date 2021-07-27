import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ListState, ListType, CardType } from "../types";
import { stringify, v4 as uuid } from "uuid";
import cardImage1 from "../assets/abstract1.jpg";
import cardImage2 from "../assets/abstract2.jpg";

const initialState: ListState = {
  dragDestinationData: {},
  lists: {
    start: {
      id: uuid(),
      title: "Start",
      cards: [
        {
          id: uuid(),
          title: "Task ",
          description: "Hello World",
          cardImage: cardImage1,
          tags: [{id: uuid(), name:'ReactJS'}]
        },
        {
          id: uuid(),
          title: "Task 0",
          description:
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum soluta assumenda eligendi, repellat inventore exercitationem quas odit. Adipisci magni fugit temporibus, voluptatum, repellat, tempora magnam alias iusto quam dolor nisi. Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum soluta assumenda eligendi, repellat inventore exercitationem quas odit. Adipisci magni fugit temporibus, voluptatum, repellat, tempora magnam alias iusto quam dolor nisi. Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum soluta assumenda eligendi, repellat inventore exercitationem quas odit. Adipisci magni fugit temporibus, voluptatum, repellat, tempora magnam alias iusto quam dolor nisi. ",
            tags: [{id: uuid(), name:'ReactJS'}]
        },
        {
          id: uuid(),
          title: "Task 1",
          description: "Hello World 1",
          tags: [{id: uuid(), name:'ReactJS'}],
        },
        {
          id: uuid(),
          title: "Task 2",
          description: "Hello World 2",
          tags: [{id: uuid(), name:'ReactJS'}],
        },
        {
          id: uuid(),
          title: "Task 3",
          description: "Hello World 3",
          tags: [{id: uuid(), name:'ReactJS'}],
        },
        {
          id: uuid(),
          title: "Task 4",
          description: "Hello World 4",
          tags: [{id: uuid(), name:'ReactJS'}],
        },
        {
          id: uuid(),
          title: "Task 5",
          description: "Hello World 5",
          tags: [{id: uuid(), name:'ReactJS'}],
        },
      ],
    },
    "in process": {
      id: uuid(),
      title: "In Process",
      cards: [
        {
          id: uuid(),
          title: "Task 6",
          description: "Hello World 6",
          tags: [{id: uuid(), name:'ReactJS'}],
        },
        {
          id: uuid(),
          title: "Task 7",
          description: "Hello World 7",
          tags: [{id: uuid(), name:'ReactJS'}],
        },
        {
          id: uuid(),
          title: "Task 8",
          description: "Hello World 8",
          tags: [{id: uuid(), name:'ReactJS'}],
        },
        {
          id: uuid(),
          title: "Task 9",
          description: "Hello World 9",
          tags: [{id: uuid(), name:'ReactJS'}],
        },
        {
          id: uuid(),
          title: "Task 10",
          description: "Hello World 10",
          tags: [{id: uuid(), name:'ReactJS'}],
        },
        {
          id: uuid(),
          title: "Task 11",
          description: "Hello World 11",
          // tags: [{id: uuid(), name:'ReactJS'}],
        },
      ],
    },
    finished: {
      id: uuid(),
      title: "Finished",
      cards: [
        {
          id: uuid(),
          title: "Task 12",
          description: "Hello World 12",
          tags: [{id: uuid(), name:'ReactJS'}],
          cardImage: cardImage2,
        },
        {
          id: uuid(),
          title: "Task 13",
          description: "Hello World 13",
          tags: [{id: uuid(), name:'ReactJS'}],
        },
        {
          id: uuid(),
          title: "Task 14",
          description: "Hello World 14",
          tags: [{id: uuid(), name:'ReactJS'}],
        },
        {
          id: uuid(),
          title: "Task 15",
          description: "Hello World 15",
          tags: [{id: uuid(), name:'ReactJS'}],
        },
        {
          id: uuid(),
          title: "Task 16",
          description: "Hello World 16",
          tags: [{id: uuid(), name:'ReactJS'}],
        },
        {
          id: uuid(),
          title: "Task 17",
          description: "Hello World 17",
          tags: [{id: uuid(), name:'ReactJS'}],
        },
      ],
    },
  },
};

// for (const key in initialState) {
//   let newo = initialState.lists[key];
// }

export const ListsSlice = createSlice({
  name: "lists",
  initialState,
  reducers: {
    setChangeCardInSamePhase: (
      state,
      action: PayloadAction<{
        phaseKey: string;
        cardStartIndex: number;
        cardEndIndex: number;
      }>
    ) => {
      if (state.lists) {
        const movedCard: CardType = state.lists[
          action.payload.phaseKey
        ].cards.find((card, index) => index === action.payload.cardStartIndex)!;
        state.lists[action.payload.phaseKey].cards.splice(
          action.payload.cardStartIndex,
          1
        );
        state.lists[action.payload.phaseKey].cards.splice(
          action.payload.cardEndIndex,
          0,
          movedCard
        );
      }
    },
    setDragDestinationData: (
      state,
      action: PayloadAction<{
        droppableId: string;
        index: number;
      }>
    ) => {
      state.dragDestinationData = action.payload;
    },
    setChangeCardInDifferentPhase: (
      state,
      action: PayloadAction<{
        sourcePhaseKey: string;
        destinationPhaseKey: string;
        cardStartIndex: number;
        cardEndIndex: number;
      }>
    ) => {
      if (state.lists) {
        const movedCard: CardType = state.lists[
          action.payload.sourcePhaseKey
        ].cards.find((card, index) => index === action.payload.cardStartIndex)!;
        state.lists[action.payload.sourcePhaseKey].cards.splice(
          action.payload.cardStartIndex,
          1
        );
        state.lists[action.payload.destinationPhaseKey].cards.splice(
          action.payload.cardEndIndex,
          0,
          movedCard
        );
      }
    },
    setAddCard: (
      state,
      action: PayloadAction<{
        phaseKey: string;
        cardDetails: CardType;
      }>
    ) => {
      if (state.lists) {
        const newCardsArray = [...state.lists[action.payload.phaseKey].cards, action.payload.cardDetails]
        state.lists[action.payload.phaseKey].cards = newCardsArray;
        console.log(state.lists[action.payload.phaseKey].cards);  
      }
    },
    setEditCard: (
      state,
      action: PayloadAction<{
        phaseKey: string;
        cardIndex: number;
        cardDetails: CardType;
      }>
    ) => {
      if (state.lists) {
        state.lists[action.payload.phaseKey].cards.splice(action.payload.cardIndex, 1, action.payload.cardDetails)
      }
    },
    setDeleteCard: (
      state,
      action: PayloadAction<{
        phaseKey: string;
      cardId: string | number
      }>
    ) => {
      const newCardsArray = [...state.lists[action.payload.phaseKey].cards.filter((card) => card.id !== action.payload.cardId)]
      state.lists[action.payload.phaseKey].cards = newCardsArray;
    }
  },
});

export const {
  setChangeCardInSamePhase,
  setChangeCardInDifferentPhase,
  setDragDestinationData,
  setAddCard,
  setDeleteCard,
  setEditCard
} = ListsSlice.actions;
export default ListsSlice.reducer;
