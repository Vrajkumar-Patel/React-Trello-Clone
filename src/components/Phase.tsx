import "date-fns";
import React, { useState } from "react";
import AddRoundedIcon from "@material-ui/icons/AddRounded";
import { CardType, ListType } from "../types";
import Card from "./Card";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { v4 as uuid } from "uuid";
import {
  Backdrop,
  Button,
  Checkbox,
  Chip,
  Divider,
  Fade,
  FormControlLabel,
  FormGroup,
  InputLabel,
  Modal,
  Paper,
  TextField,
} from "@material-ui/core";
import { styled } from "@material-ui/core/styles";
import CloseRoundedIcon from "@material-ui/icons/CloseRounded";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { setAddCard } from "../redux/ListsReducer";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";

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
  // Form States
  const [title, setTitle] = useState<string>("");
  const [desc, setDesc] = useState<string>("");
  const [tagsArray, setTagsArray] = useState<TagsType[] | undefined>([
    // { id: 1, name: "Python" },
    // { id: 2, name: "Important" },
    // { id: 3, name: "Data" },
    // { id: 4, name: "JS" },
    // { id: 5, name: "React" },
  ]);
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
    setTitle("")
    setDesc("")
    handleModalClose();
    toast.success('Card Added Successfully');
  };

 

  return (
    <div className="phase">
      <div className="phase_header">
        <h4>{phaseKey}</h4>
        <Button
          style={{
            border: "1px dashed #000",
            borderRadius: "50%",
            cursor: "pointer",
            height: "50px",
            maxWidth: "40px",
            padding: "0px",
            // width: "10px",
          }}
          onClick={handleModalOpen}
        >
          <AddRoundedIcon
            style={{
              padding: "0px",
              margin: "0px",
            }}
            fontSize="large"
          />
        </Button>
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
                    droppableSnapshot={snapshot}
                    phaseDetails={phaseValue}
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
                  autoComplete='false'
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