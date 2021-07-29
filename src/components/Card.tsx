// @ts-nocheck

import React, { useState } from "react";

// Dependencies Import
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
  IconButton,
  Menu,
  MenuItem,
} from "@material-ui/core";
import {
  KeyboardTimePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { Draggable } from "react-beautiful-dnd";
import { DroppableStateSnapshot } from "react-beautiful-dnd";
import { useSelector, useDispatch } from "react-redux";
//  // Material Icons
import AccessAlarmTwoToneIcon from "@material-ui/icons/AccessAlarmTwoTone";
import CalendarTodayTwoToneIcon from "@material-ui/icons/CalendarTodayTwoTone";
import CloseRoundedIcon from "@material-ui/icons/CloseRounded";
import AddRoundedIcon from "@material-ui/icons/AddRounded";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import CreateRoundedIcon from "@material-ui/icons/CreateRounded";
import DeleteRoundedIcon from "@material-ui/icons/DeleteRounded";
//  //

import { v4 as uuid } from "uuid";
import toast from "react-hot-toast";
import styled from "styled-components";

// Types, Components, Redux Actions Imports
import { CardType, DragData, ListType } from "../types";
import { TagsType } from "./Phase";
import { StateType } from "../redux/store";
import { setDeleteCard, setEditCard } from "../redux/ListsReducer";

// Assets Import
import mainPicImg from "../assets/main.svg";

type Props = {
  cardIndex: number;
  cardDetails: CardType;
  phaseKey: string;
};

// type ChipProps = {
//   label: string;
//   tagIndex: number;
// };

const MyPaper = styled.div`
  box-shadow: 0px 3px 5px 1px rgba(0, 0, 0, 0.2);
  border-radius: 20px;
  background-color: ${(props) =>
    props.isDragging ? "rgb(245, 230, 255)" : "white"};
`;
// const Div = styled("div")({
//   borderRadius: "20px",
// });

const ModalPaper = styled(Paper)((props) => {
  return {
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
  };
});

const Card: React.FC<Props> = ({ cardIndex, cardDetails, phaseKey }) => {
  const dispatch = useDispatch();

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
        setTagsArray([...tagsArray, obj]!);
      } else {
        setTagsArray([obj]);
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
      (tagData) => tagData.id !== data.id
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
    toast.success("Card Edited Successfully");
  };

  return (
    <>
      {/* ================================================================================================ */}
      <Draggable draggableId={cardDetails.id} index={cardIndex}>
        {(provided, snapshot) => (
          <>
            <MyPaper
              className={[
                "card",
                snapshot.isDragging ? "card_background" : "",
              ].join(" ")}
              elevation={5}
              style={{
                backgroundColor: `${snapshot.isDragging ? "black" : "white"}`,
              }}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              ref={provided.innerRef}
              isDragging={snapshot.isDragging}
            >
              {/* Image of the card if available---------------------------------------------------------------- */}
              <div>
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
              </div>

              {/* title section of the Card--------------------------------------------------------------------  */}
              <div className="card_title">
                <div className="card_titleLeft">
                  <img
                    src={mainPicImg}
                    height="50px"
                    width="50px"
                    style={{ margin: "0px 15px 10px 15px" }}
                  />
                  <h3>{cardDetails.title}</h3>
                </div>
                <div className="card_titleRight">
                  <IconButton
                    onClick={handleClick}
                    style={{
                      height: "50px",
                      width: "50px",
                      marginLeft: "auto",
                    }}
                  >
                    <MoreVertIcon />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    keepMounted
                    open={open}
                    onClose={handleClose}
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    transformOrigin={{ vertical: -50, horizontal: 120 }}
                    PaperProps={{
                      style: {
                        maxHeight: "fit-content",
                        width: "12ch",
                      },
                    }}
                  >
                    <MenuItem onClick={handleModalOpen}>
                      <CreateRoundedIcon
                        style={{ color: "#2ecc71", marginRight: "10px" }}
                      />
                      Edit
                    </MenuItem>
                    <MenuItem onClick={handleDeleteCard}>
                      <DeleteRoundedIcon
                        style={{ color: "#fdcb6e", marginRight: "10px" }}
                      />
                      Delete
                    </MenuItem>
                  </Menu>
                </div>
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
          outline: "none",
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
                        ampm
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
                        ampm
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
                <Button variant="contained" color="primary" type="submit">
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
