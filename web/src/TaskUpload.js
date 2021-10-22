import React, { useState } from "react";
import { Button, Modal, makeStyles } from "@material-ui/core";
import { storage, db } from "./firebase";
import firebase from "firebase";
import "./TaskUpload.css"

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

function TaskUpload({ userAvatar, userName }) {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [caption, setCaption] = useState("");
  const [openTask, setOpenTask] = useState(false);

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    const uploadTask = storage.ref(`files/${file.name}`).put(file);
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
          .ref("files")
          .child(file.name)
          .getDownloadURL()
          .then((url) => {
            db.collection("posts").add({
              createdAt: firebase.firestore.FieldValue.serverTimestamp(),
              caption: caption,
              fileURL: url,
              userName: userName,
              userAvatar: userAvatar,
            });
          });
        setProgress(0);
        setCaption("");
        setFile(null);
        setOpenTask(false);
      }
    );
  };

  return (
    <div className="taskUpload">
      <progress
        className="taskupload_progress"
        value={progress}
        max="100"
      ></progress>

      <Modal
        open={openTask}
        onClose={() => setOpenTask(false)}
        aria-labelledby="simple-modal-title"
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="task_add">
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
          </form>
        </div>
      </Modal>

      {/* <form className="app_signup">
            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" variant="contained" onClick={signIn}>
              Sign In
            </Button>
          </form> */}

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

export default TaskUpload;
