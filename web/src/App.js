import React, { useState, useEffect } from "react";
import "./App.css";
import Post from "./Post";
import { db, auth } from "./firebase";
import { Input, Modal, Button, makeStyles } from "@material-ui/core";
import TaskUpload from "./TaskUpload";

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

function App() {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [posts, setPosts] = useState([]);
  const [openSignUp, setOpenSignUp] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        console.log(authUser);
        setUser(authUser);
      } else {
        //user logged out
        setUser(null);
      }
    });
    return () => {
      unsubscribe();
    };
  }, [user, userName]);

  useEffect(() => {
    db.collection("posts")
      .orderBy("createdAt", "desc")
      .onSnapshot((snapshot) => {
        setPosts(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            post: doc.data(),
          }))
        );
      });
  }, []);

  const clearInput = () => {
    setUserName("");
    setEmail("");
    setPassword("");
  };

  const signUp = (event) => {
    event.preventDefault();
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: userName,
        });
      })
      .catch((err) => alert(err.message));
    setOpenSignUp(false);
    clearInput();
  };

  const signIn = (event) => {
    event.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));
    setOpenSignIn(false);
    clearInput();
  };

  return (
    <div className="app">
      <Modal
        open={openSignUp}
        onClose={() => setOpenSignUp(false)}
        aria-labelledby="simple-modal-title"
      >
        <div style={modalStyle} className={classes.paper}>
          <center>
            <img
              className="app_headerImage"
              src="http://www.adsjective-media.com/public/images/adsjective-logo-transparent.png"
              alt="adsjective logo"
            />
          </center>
          <form className="app_signup">
            <Input
              placeholder="username"
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
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
            <Button type="submit" variant="contained" onClick={signUp}>
              Sign Up
            </Button>
          </form>
        </div>
      </Modal>
      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
        aria-labelledby="simple-modal-title"
      >
        <div style={modalStyle} className={classes.paper}>
          <center>
            <img
              className="app_headerImage"
              src="http://www.netsys.com.my/assets/images/picture1-484x256.png"
              alt="netsinity logo"
            />
          </center>
          <form className="app_signup">
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
          </form>
        </div>
      </Modal>
      <div className="app_header">
        <img
          className="app_headerImage"
          src="http://www.netsys.com.my/assets/images/picture1-484x256.png"
          alt="netsinity logo"
        />
        {user ? (
          <Button
            variant="contained"
            onClick={() => auth.signOut()}
            color="primary"
          >
            Logout
          </Button>
        ) : (
          <div app="app_loginContainer">
            <Button
              variant="contained"
              onClick={() => setOpenSignIn(true)}
              color="primary"
            >
              Sign In
            </Button>
            <Button
              variant="contained"
              onClick={() => setOpenSignUp(true)}
              color="primary"
            >
              Sign Up
            </Button>
          </div>
        )}
      </div>
      <div className="app_posts">
        <div className="app_leftPosts">
          {posts.map(({ id, post }) => {
            return (
              <Post
                key={id}
                postId={id}
                userAvatar={post.userAvatar}
                user={user}
                userName={post.userName}
                fileURL={post.fileURL}
                caption={post.caption}
              />
            );
          })}
        </div>
      </div>
      {user?.displayName ? (
        <TaskUpload
          userName={user.displayName}
          userAvatar="https://i.pravatar.cc/150?img=10"
        />
      ) : (
        <center>
          <h4>
            Sorry you need to login to upload
          </h4>
        </center>
      )}
    </div>
  );
}

export default App;