import React, { useState, useEffect } from "react";
import "./Post.css";
import { Avatar, Button, Modal, makeStyles } from "@material-ui/core";
import firebase from "firebase";
import { db } from "./firebase";

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

function Post(props) {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const { postId, user, userAvatar, userName, fileURL, caption } = props;
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [openEdit, setOpenEdit] = useState(false);

  useEffect(() => {
    let unsubscribe;
    if (postId) {
      unsubscribe = db
        .collection("posts")
        .doc(postId)
        .collection("comments")
        .orderBy("createdAt", "asc")
        .onSnapshot((snapshot) => {
          setComments(snapshot.docs.map((doc) => doc.data()));
        });
    }
    return () => {
      unsubscribe();
    };
  }, [postId]);

  const postComment = (event) => {
    event.preventDefault();
    db.collection("posts").doc(postId).collection("comments").add({
      text: comment,
      userName: user.displayName,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setComment("");
  };

  return (
    <div className="post">
      <Modal
        open={openEdit}
        onClose={() => setOpenEdit(false)}
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
            <Button variant="contained" color="primary" onClick={handleUpdate}>
              Update
            </Button>
          </form>
        </div>
      </Modal>
      <div className="post_header">
        <Avatar className="post_avatar" alt={userName} src={userAvatar} />
        <h3>{userName}</h3>
        {/* header -> avatar -> username */}
        <Button color="primary" variant="contained" size="small" onClick={() => setOpenEdit(true)} color="primary">Edit</Button>
        <Button color="secondary" variant ="contained" size="small" onClick={event => db.collection('posts').doc(postId).delete()}>Delete</Button>
      </div>

      <img className="post_image" src={fileURL} alt="username-avatar" />
      <h4 className="post_text">
        <strong>{userName}:</strong> {caption}
      </h4>
      <div className="post_comments">
        {comments.map((comment) => (
          <p>
            <strong>{comment.userName}</strong> {comment.text}
          </p>
        ))}
      </div>
      {user && (
        <form className="post_commentBox">
          <input
            className="post_input"
            type="text"
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button
            className="post_button"
            disabled={!comment}
            type="submit"
            onClick={postComment}
          >
            Post
          </button>
        </form>
      )}
    </div>
  );
}

export default Post;
