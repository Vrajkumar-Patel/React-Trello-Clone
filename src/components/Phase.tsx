import "date-fns";
import React, { useState } from "react";

// Dependencies Imports
import AddRoundedIcon from "@material-ui/icons/AddRounded";
import { Droppable } from "react-beautiful-dnd";
import {
  Backdrop,
  Button,
  Chip,
  Divider,
  Fade,
  FormControlLabel,
  FormGroup,
  Modal,
  Paper,
  TextField,
} from "@material-ui/core";
import { styled } from "@material-ui/core/styles";
import CloseRoundedIcon from "@material-ui/icons/CloseRounded";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { v4 as uuid } from "uuid";

// Types Import
import { ListType } from "../types";

// Components Import
import Card from "./Card";

// Redux Action Import
import { setAddCard } from "../redux/ListsReducer";

// Styled Component
const MyPaper = styled(Paper)({
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

// 

export type TagsType = {
  id: string | number;
  name: string;
};

type Props = {
  phaseKey: string;
  phaseValue: ListType;
};

const Phase: React.FC<Props> = ({ phaseKey, phaseValue }) => {
  const today = new Date();
  const dispatch = useDispatch();
  const [open, setOpen] = useState<boolean>(false);
  const [handleTagInput, setHandleTagInput] = useState<boolean>(false);
  const [tagInput, setTagInput] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [desc, setDesc] = useState<string>("");
  const [tagsArray, setTagsArray] = useState<TagsType[] | undefined>([]);
  const [startTime, setStartTime] = useState<Date | null>(today);
  const [endTime, setEndTime] = useState<Date | null>(today);

  const handleModalOpen = () => {
    setOpen(true);
  };
  const handleModalClose = () => {
    setOpen(false);
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
      tagsArray!.push(obj);
      setTagInput("");
    }
    setHandleTagInput(false);
  };

  const handleDeleteChip = (data: TagsType) => {
    const newTagsArray: TagsType[] = tagsArray!.filter(
      (tagData, index) => tagData.id !== data.id
    );
    setTagsArray(newTagsArray);
  };

  const handleSaveChanges = (e: any) => {
    e.preventDefault();
    dispatch(
      setAddCard({
        phaseKey: phaseKey,
        cardDetails: {
          id: uuid(),
          title: title,
          description: desc,
          tags: tagsArray,
          startTime: startTime,
          endTime: endTime,
          date: today.toLocaleDateString(),
        },
      })
    );
    setTitle("");
    setDesc("");
    handleModalClose();
    toast.success("Card Added Successfully");
  };

  return (
    <div className="phase">
      <div className="phase_header">
        <p>{phaseKey}</p>
        <div
          style={{
            border: "2px dashed #000",
            borderRadius: "50%",
            cursor: "pointer",
            height: "40px",
            width: "40px",
            // maxWidth: "30px",
            padding: "0px",
            marginRight: "5px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            // width: "10px",
          }}
          onClick={handleModalOpen}
        >
          <AddRoundedIcon
            style={{
              padding: "0px",
              margin: "0px",
              fontSize: "30px",
            }}
          />
        </div>
      </div>
      <div>
        <Droppable droppableId={phaseValue.id} type="card">
          {(provided, snapshot) => (
            <>
              {console.log(snapshot)}
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {phaseValue.cards.map((card, index) => (
                  <Card
                    cardDetails={card}
                    cardIndex={index}
                    key={card.id}
                    phaseKey={phaseKey}
                  />
                ))}
                {provided.placeholder}
              </div>
            </>
          )}
        </Droppable>
      </div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          outline: "none",
        }}
        open={open}
        onClose={handleModalClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <form onSubmit={(e) => handleSaveChanges(e)}>
            <MyPaper elevation={10} className="modal_paper">
              <div className="addCard_modal_header">
                <h3>Add your Card Details</h3>
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
                  {tagsArray!.map((tagData) => (
                    <FormControlLabel
                      style={{ margin: "5px 10px" }}
                      label=""
                      control={
                        <Chip
                          label={tagData.name}
                          onDelete={() => handleDeleteChip(tagData)}
                          // className={classes.chip}
                        />
                        // <Checkbox
                        //   color="primary"
                        //   name={tagData.name}
                        //   //   onChange={handleChange}
                        // />
                      }
                    />
                  ))}
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
                        required
                        hiddenLabel
                        margin="normal"
                        id="time-picker"
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
                        required
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
                  Save Changes
                </Button>
                <Button variant="contained" onClick={handleModalClose}>
                  Cancel
                </Button>
              </div>
            </MyPaper>
          </form>
        </Fade>
      </Modal>
    </div>
  );
};

export default Phase;
