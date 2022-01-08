import "./TaskListResults.css"
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  // Avatar,
  Box,
  Button,
  Card,
  // Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
  Modal,
} from '@material-ui/core';
import { spacing } from '@material-ui/system';
import { makeStyles } from '@material-ui/styles';
// import getInitials from '../../utils/getInitials';

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
    width: 700,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

const TaskListResults = ({ tasks, ...rest }) => {
  // const [selectedtaskIds, setSelectedtaskIds] = useState([]);
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [selectedtaskIds] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [openTask, setOpenTask] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignTo, setAssignTo] = useState('');
  const [filePath, setFilepath] = useState(null);
  const [duedate, setDuedate] = useState('');

  // const handleSelectAll = (event) => {
  //   let newSelectedtaskIds;

  //   if (event.target.checked) {
  //     newSelectedtaskIds = tasks.map((task) => task.id);
  //   } else {
  //     newSelectedtaskIds = [];
  //   }

  //   setSelectedtaskIds(newSelectedtaskIds);
  // };

  // const handleSelectOne = (event, id) => {
  //   const selectedIndex = selectedtaskIds.indexOf(id);
  //   let newSelectedtaskIds = [];

  //   if (selectedIndex === -1) {
  //     newSelectedtaskIds = newSelectedtaskIds.concat(selectedtaskIds, id);
  //   } else if (selectedIndex === 0) {
  //     newSelectedtaskIds = newSelectedtaskIds.concat(selectedtaskIds.slice(1));
  //   } else if (selectedIndex === selectedtaskIds.length - 1) {
  //     newSelectedtaskIds = newSelectedtaskIds.concat(selectedtaskIds.slice(0, -1));
  //   } else if (selectedIndex > 0) {
  //     newSelectedtaskIds = newSelectedtaskIds.concat(
  //       selectedtaskIds.slice(0, selectedIndex),
  //       selectedtaskIds.slice(selectedIndex + 1)
  //     );
  //   }

  //   setSelectedtaskIds(newSelectedtaskIds);
  // };

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setFilepath(e.target.files[0]);
    }
  };

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const getCurrentDate = () => {
    console.log(`NewTicket.onSubmitTicket.getCurrentDate: called`)
    return new Promise((resolve, reject) => {
      var now = new Date()
      now.setTime(now.getTime() + 8 * 60 * 60 * 1000)
      var y = now.getFullYear()
      var m = now.getMonth() + 1
      var d = now.getDate()
      var hh = now.getHours()
      var mm = now.getMinutes()
      var ss = now.getSeconds()
      var date = '' + y + (m < 10 ? '0' : '') + m + (d < 10 ? '0' : '') + d + (hh < 10 ? '0' : '') + hh + (mm < 10 ? '0' : '') + mm + (ss < 10 ? '0' : '') + ss
      if (date.length == 14) {
        console.log(`NewTicket.onSubmitTicket.getCurrentDate: resolve(${date})`)
        resolve(date)
      } else {
        reject(new Error('date.length != 14'))
      }
    })
  }

  const submitForm = async e => {
    e.preventDefault();
    try {
      const body = { title, description, assignTo, duedate, filePath };
      const response = await fetch("http://localhost:5000/postnewtask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      window.location = "/";
    } catch (err) {
      console.error(err.message);
    }
    setOpenTask(false);
  };

  return (
  <div>
    <Modal
        open={openTask}
        onClose={() => setOpenTask(false)}
        aria-labelledby="simple-modal-title"
      >
      <div style={modalStyle} className={classes.paper}>
        <form className="add_task">
          <label>Task Title:</label>
          <input type="text" placeholder="Enter task title" value={title} onChange={e => setTitle(e.target.value)}/>
          <label>
            Assign To:
            <select value={assignTo} onChange={e => setAssignTo(e.target.value)}>
              <option value={'Ali'}>Ali</option>
              <option value={'Abu'}>Abu</option>
              <option value={'Ah Chong'}>Ah Chong</option>
            </select>
          </label>
          <label>Task Description:</label>
          <input type="text" placeholder="Enter task description" value={description} onChange={e => setDescription(e.target.value)}/>
          <label>Attachment:</label>
          <input type="file" value={filePath} onChange={handleChange}/>
          <label>Due Date:</label>
          <input type="date" value={duedate} onChange={e => setDuedate(e.target.value)}/>
          <Button variant="contained" color="primary" onClick={submitForm}>Upload</Button>
        </form>
      </div>
    </Modal>

    <Box sx={{ display: 'flex', justifyContent: 'flex-end', p:1, mr:5}}>
    <Button variant="contained" onClick={() => setOpenTask(true)} color="primary">Add Task</Button>
    </Box>

      <Card {...rest}>
        <PerfectScrollbar>
          <Box sx={{ minWidth: 1050 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    {/* <Checkbox
                      checked={selectedtaskIds.length === tasks.length}
                      color="primary"
                      indeterminate={
                        selectedtaskIds.length > 0
                        && selectedtaskIds.length < tasks.length
                      }
                      onChange={handleSelectAll}
                    /> */}
                  </TableCell>
                  <TableCell>
                    Title
                  </TableCell>
                  <TableCell>
                    Assigned to
                  </TableCell>
                  <TableCell>
                    Status
                  </TableCell>
                  <TableCell>
                    Due Date
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tasks.slice(0, limit).map((task) => (
                  <TableRow
                    hover
                    key={task.id}
                    selected={selectedtaskIds.indexOf(task.id) !== -1}
                  >
                    <TableCell padding="checkbox">
                      {/* <Checkbox
                        checked={selectedtaskIds.indexOf(task.id) !== -1}
                        onChange={(event) => handleSelectOne(event, task.id)}
                        value="true"
                      /> */}
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          alignItems: 'center',
                          display: 'flex'
                        }}
                      >
                        {/* <Avatar
                          src={task.avatarUrl}
                          sx={{ mr: 2 }}
                        >
                          {getInitials(task.name)}
                        </Avatar> */}
                        <Typography
                          color="textPrimary"
                          variant="body1"
                        >
                          {task.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {task.email}
                    </TableCell>
                    <TableCell>
                      {task.status}
                    </TableCell>
                    <TableCell>
                      {moment(task.createdAt).format('DD/MM/YYYY')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </PerfectScrollbar>
        <TablePagination
          component="div"
          count={tasks.length}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleLimitChange}
          page={page}
          rowsPerPage={limit}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Card>
    </div>
  );
};

TaskListResults.propTypes = {
  tasks: PropTypes.array.isRequired
};

export default TaskListResults;
