import React, { useEffect, useState } from "react";
import {
  Paper,
  Chip,
  Divider,
  Modal,
  Fade,
  Button,
  Backdrop,
  TextField,
  FormGroup,
  FormControlLabel,
} from "@material-ui/core";
import DateFnsUtils from "@date-io/date-fns";
import { CardType, DragData, ListType } from "../types";
import AccessAlarmTwoToneIcon from "@material-ui/icons/AccessAlarmTwoTone";
import CalendarTodayTwoToneIcon from "@material-ui/icons/CalendarTodayTwoTone";
import { Draggable } from "react-beautiful-dnd";
import { DroppableStateSnapshot } from "react-beautiful-dnd";
import { useSelector, useDispatch } from "react-redux";
import CloseRoundedIcon from "@material-ui/icons/CloseRounded";
import AddRoundedIcon from "@material-ui/icons/AddRounded";

// for deleteCardButton Icon
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { styled } from "@material-ui/core/styles";
import { v4 as uuid } from "uuid";
import { TagsType } from "./Phase";
// -----------------

// import of progress Images
import progress1 from "../assets/progress1.png";
import { StateType } from "../redux/store";
import { setDeleteCard, setEditCard } from "../redux/ListsReducer";
import toast from "react-hot-toast";
import {
  KeyboardTimePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
// Done

type Props = {
  cardIndex: number;
  cardDetails: CardType;
  droppableSnapshot: DroppableStateSnapshot;
  phaseDetails: ListType;
  phaseKey: string;
};

type ChipProps = {
  label: string;
  tagIndex: number;
};

const MyPaper = styled(Paper)({
  borderRadius: "20px",
});

const ModalPaper = styled(Paper)({
  minHeight: "300px",
  maxHeight: "calc(100vh - 100px)",
  minWidth: "800px",
  maxWidth: "800px",
  outline: "none",
  borderRadius: "30px",
  display: "flex",
  flexDirection: "column",
  padding: "20px",
  overflow: "hidden",
  overflowY: "inherit",
  scrollBehavior: "smooth",
});

const Card: React.FC<Props> = ({
  cardIndex,
  cardDetails,
  droppableSnapshot,
  phaseDetails,
  phaseKey,
}) => {
  const dispatch = useDispatch();

  const dragDestinationData: DragData = useSelector(
    (state: StateType) => state.lists.dragDestinationData
  );

  const [tagsArray, setTagsArray] = useState<TagsType[] | undefined>(
    cardDetails.tags!
  );
  // for Modal
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [title, setTitle] = useState<string>(cardDetails.title);
  const [desc, setDesc] = useState<string>(cardDetails.description!);
  const [startTime, setStartTime] = useState<Date | null>(
    cardDetails.startTime!
  );
  const [endTime, setEndTime] = useState<Date | null>(cardDetails.endTime!);
  const [handleTagInput, setHandleTagInput] = useState<boolean>(false);
  const [tagInput, setTagInput] = useState<string>("");

  //
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  // for Modal
  const handleModalClose = () => {
    setModalOpen(false);
  };
  const handleModalOpen = () => {
    setModalOpen(true);
    handleClose();
  };
  const openTagInput = () => {
    setHandleTagInput(true);
  };
  const handleAddTags = () => {
    if (tagInput) {
      const obj = {
        id: uuid(),
        name: tagInput,
      };
      if (tagsArray) {
        setTagsArray([...tagsArray, obj]!)
      }
      else {
        setTagsArray([obj])
      }
      setTagInput("");
    }
    setHandleTagInput(false);
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleDeleteCard = () => {
    dispatch(
      setDeleteCard({
        phaseKey: phaseKey,
        cardId: cardDetails.id,
      })
    );
    handleClose();
    toast.success("Card Deleted Successfully");
  };
  const handleDeleteChip = (data: TagsType) => {
    const newTagsArray: TagsType[] = tagsArray!.filter(
      (tagData, index) => tagData.id !== data.id
    );
    setTagsArray(newTagsArray);
  };
  const handleSaveChanges = (e: any) => {
    e.preventDefault();
    const editObj = {
      phaseKey: phaseKey,
      cardIndex: cardIndex,
      cardDetails: {
        id: cardDetails.id,
        title: title,
        description: desc,
        tags: tagsArray,
        startTime: startTime,
        endTime: endTime,
        date: new Date().toLocaleDateString(),
      },
    };
    dispatch(setEditCard(editObj));
    handleModalClose();
    toast.success('Card Edited Successfully');
  };

  return (
    <>
      {/* ================================================================================================ */}
      <Draggable draggableId={cardDetails.id} index={cardIndex}>
        {(provided, snapshot) => (
          <>
            <MyPaper
              className="card"
              elevation={5}
              ref={provided.innerRef}
              {...provided.dragHandleProps}
              {...provided.draggableProps}
            >
              {/* Image of the card if available---------------------------------------------------------------- */}

              {cardDetails.cardImage ? (
                <img
                  src={cardDetails.cardImage}
                  width="100%"
                  height="200px"
                  style={{
                    borderRadius: "30px",
                    boxShadow: "0px 0px 5px 1px black",
                  }}
                />
              ) : (
                <></>
              )}

              {/* title section of the Card--------------------------------------------------------------------  */}

              <div className="card_title">
                <div className="card_titleLeft">
                  <img src={progress1} height="75px" width="75px" />
                  <h3>{cardDetails.title}</h3>
                </div>
                <IconButton
                  // aria-label="more"
                  // aria-controls="long-menu"
                  // aria-haspopup="true"
                  onClick={handleClick}
                  style={{ height: "50px", width: "50px" }}
                >
                  <MoreVertIcon />
                </IconButton>
                {/* Menu */}
                <Menu
                  anchorEl={anchorEl}
                  keepMounted
                  open={open}
                  onClose={handleClose}
                  PaperProps={{
                    style: {
                      maxHeight: "fit-content",
                      width: "10ch",
                      //   paddingLeft: "8px",
                    },
                  }}
                >
                  <MenuItem onClick={handleModalOpen}>Edit</MenuItem>
                  <MenuItem onClick={handleDeleteCard}>Delete</MenuItem>
                </Menu>
                {/* Ends Here */}
              </div>

              <Divider />

              {/*  Tag Section of the Card */}
              {console.log(cardDetails.tags)}

              {tagsArray && tagsArray.length !== 0 ? (
                <div className="card_tags">
                  {tagsArray.length !== 0
                    ? tagsArray.map((tag, tagIndex) => (
                        //@ts-ignore
                        <Chip
                          label={tag.name}
                          chipIndex={tagIndex}
                          style={{
                            marginRight: "10px",
                            marginBottom: "10px",
                            background:
                              tagIndex % 2 !== 0 ? "#2ecc71" : "#a29bfe",
                            color: "rgba(0,0,0,0.5)",
                            textTransform: "uppercase",
                            fontWeight: "bold",
                            letterSpacing: "1px",
                          }}
                        />
                      ))
                    : null}
                </div>
              ) : (
                <p style={{ textAlign: "center" }}>
                  <b>No Tags</b>
                </p>
              )}

              <Divider />
              {/* Description Section of Card */}

              <div className="card_desc">{cardDetails.description}</div>
              <Divider />
              {/*  Date and Time Section of the Card */}

              <div className="card_dateTime">
                <div className="card_time">
                  <AccessAlarmTwoToneIcon style={{ marginRight: "10px" }} />
                  <p>{`${cardDetails.startTime?.getHours()}:${cardDetails.startTime?.getMinutes()} - ${cardDetails.endTime?.getHours()}:${cardDetails.endTime?.getMinutes()}`}</p>
                </div>
                <div className="card_date">
                  <CalendarTodayTwoToneIcon style={{ marginRight: "10px" }} />
                  <p>{cardDetails.date}</p>
                </div>
              </div>
            </MyPaper>
          </>
        )}
      </Draggable>
      {/* ============================================================================================== */}

      {/* ============================================================================================== */}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        open={modalOpen}
        onClose={handleModalClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={modalOpen}>
          <form onSubmit={(e) => handleSaveChanges(e)}>
            <ModalPaper elevation={10} className="modal_paper">
              <div className="addCard_modal_header">
                <h3>Edit your Card Details</h3>
                <Button>
                  <CloseRoundedIcon
                    style={{ cursor: "pointer" }}
                    fontSize="large"
                    onClick={handleModalClose}
                  />
                </Button>
              </div>
              <Divider />
              <div className="addCard_modal_title">
                <TextField
                  autoComplete="false"
                  id="card_title"
                  label="Card Title"
                  variant="outlined"
                  fullWidth
                  required
                  // defaultValue={cardDetails.title}
                  onChange={(e) => setTitle(e.target.value)}
                  value={title}
                />
              </div>
              <Divider />
              <div className="addCard_modal_description">
                <TextField
                  type="textarea"
                  id="card_desc"
                  label="Card Description"
                  variant="outlined"
                  className="addCard_modal_desc"
                  onChange={(e) => setDesc(e.target.value)}
                  // defaultValue={cardDetails.description}
                  value={desc}
                  rows={5}
                  maxRows={30}
                  fullWidth
                  multiline
                  required
                />
              </div>
              <Divider />
              <div className="addCard_modal_tags">
                <h4 style={{ marginBottom: "10px" }}>Tags:</h4>
                <FormGroup row>
                  {tagsArray
                    ? tagsArray.map((tagData) => (
                        <FormControlLabel
                          style={{ margin: "5px 10px" }}
                          label=""
                          control={
                            <Chip
                              label={tagData.name}
                              onDelete={() => handleDeleteChip(tagData)}
                            />
                          }
                        />
                      ))
                    : null}
                  {handleTagInput ? (
                    <TextField
                      autoFocus
                      hiddenLabel
                      variant="filled"
                      onBlur={handleAddTags}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setTagInput(e.target.value)
                      }
                      style={{ padding: "0" }}
                      value={tagInput}
                      name="tagInput"
                    />
                  ) : (
                    <Button variant="contained" onClick={openTagInput}>
                      Add Tags <AddRoundedIcon />
                    </Button>
                  )}
                </FormGroup>
              </div>
              <div className="addCard_modal_timeLimit">
                <h4 style={{ marginBottom: "0" }}>Set Time Limit for Task: </h4>
                <div className="modal_date_container">
                  <div className="modal_startDate">
                    <p>
                      <i>Choose Start Time:</i>
                    </p>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <KeyboardTimePicker
                        defaultValue={cardDetails.startTime}
                        required
                        hiddenLabel
                        margin="normal"
                        id="time-picker"
                        ampm={true}
                        label=""
                        value={startTime}
                        onChange={(date: Date | null) => setStartTime(date)}
                        KeyboardButtonProps={{
                          "aria-label": "change time",
                        }}
                      />
                    </MuiPickersUtilsProvider>
                  </div>
                  <div className="modal_endDate">
                    <p>
                      <i>Choose End Time:</i>
                    </p>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <KeyboardTimePicker
                        defaultValue={cardDetails.endTime}
                        required
                        ampm={true}
                        hiddenLabel
                        margin="normal"
                        id="time-picker"
                        label=""
                        value={endTime}
                        onChange={(date: Date | null) => setEndTime(date)}
                        KeyboardButtonProps={{
                          "aria-label": "change time",
                        }}
                      />
                    </MuiPickersUtilsProvider>
                  </div>
                </div>
              </div>
              <Divider style={{ margin: "20px 0px 10px 0px" }} />
              <div className="addCard_modal_submit">
                <Button
                  variant="contained"
                  color="primary"
                  // onClick={handleSaveChanges}
                  type="submit"
                >
                  Edit Changes
                </Button>
                <Button variant="contained" onClick={handleModalClose}>
                  Cancel
                </Button>
              </div>
            </ModalPaper>
          </form>
        </Fade>
      </Modal>
      {/* ============================================================================================= */}
    </>
  );
};

export default Card;
