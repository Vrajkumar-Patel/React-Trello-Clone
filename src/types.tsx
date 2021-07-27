export type CardType = {
  id: string;
  title: string;
  description?: string;
  colorLabel?: string;
  cardImage?: string;
  tags?: { id: string | number; name: string }[] | [];
  startTime?: Date | null;
  endTime?: Date | null;
  date?: string;
};

export type ListType = {
  title: string;
  id: string;
  cards: CardType[] | [];
  color?: string | "black";
};

export type DragData =
  | {
      droppableId: string;
      index: number;
    }
  | {};

export interface ListState {
  lists: {
    [key: string]: ListType;
  };
  dragDestinationData: DragData;
}
