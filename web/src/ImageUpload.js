import React, { useState } from "react";
import { Button, Modal, makeStyles } from "@material-ui/core";
import { storage, db } from "./firebase";
import firebase from "firebase";
import "./ImageUpload.css"

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function ImageUpload({ userAvatar, userName }) {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const [caption, setCaption] = useState("");
  const [openTask, setOpenTask] = useState(false);

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    const uploadTask = storage.ref(`images/${image.name}`).put(image);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        //   progress function
        const progress =
          Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progress);
      },
      (error) => {
        //   error function
        console.log(error);
        alert(error.message);
      },
      () => {
        //   complete function
        storage
          .ref("images")
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            db.collection("posts").add({
              createdAt: firebase.firestore.FieldValue.serverTimestamp(),
              caption: caption,
              imageURL: url,
              userName: userName,
              userAvatar: userAvatar,
            });
          });
        setProgress(0);
        setCaption("");
        setImage(null);
      }
    );
  };

  return (
    <div className="imageUpload">
      <progress
        className="imageupload_progress"
        value={progress}
        max="100"
      ></progress>

      <Modal
        open={openTask}
        onClose={() => setOpenTask(false)}
        aria-labelledby="simple-modal-title"
      >
        <div style={modalStyle} className={classes.paper}>
          <div className="task_add">
            <input
              type="text"
              placeholder="Enter a Caption..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              />
              <input type="file" onChange={handleChange} />
            <Button variant="contained" color="primary" onClick={handleUpload}>
              Upload
            </Button>
            </div>
        </div>
      </Modal>

      {/* <input
        type="text"
        placeholder="Enter a Caption..."
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
      />
      <input type="file" onChange={handleChange} />
      <Button variant="contained" color="primary" onClick={handleUpload}>
        Upload
      </Button> */}
      <Button variant="contained" onClick={() => setOpenTask(true)} color="primary"
      >
      Add Task
      </Button>
    </div>
  );
}

export default ImageUpload;
