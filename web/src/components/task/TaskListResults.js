import React, { useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Box,
  Button,
  Card,
  FormControl,
  FormLabel,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
  Modal,
  MenuItem,
  Select
} from '@material-ui/core';
import { spacing } from '@material-ui/system';
import { makeStyles } from '@material-ui/styles';
import axios from 'axios';

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
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [selectedtaskIds] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [openTask, setOpenTask] = useState(false);
  const [title, setTitle] = useState('');
  const [detail, setDetail] = useState('');
  const [pjcode, setpjCode] = useState('');
  const [assign, setAssign] = useState('');
  const [file, setFile] = useState(null);
  const [duedate, setDuedate] = useState('');
  const [priority, setPriority] = useState('');
  const [recommend, setRecommend] = useState('');

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

//TODO
  const uploadFile = (fileURI, taskID) => {
    console.log(`NewTask.uploadFile: called`)
    console.log(`imageURI: ${fileURI}`)
    let fd = new FormData()
    const fileName = taskID + '.jpg'
    fd.append('taskfile', { uri: fileURI, type: 'file/pdf', name: fileName })
    return new Promise(async (resolve, reject) => {
      try {
        const res = axios.post(`http://localhost:5050/api/web/task/uploadfile`, fd)
        console.log(`NewTask.uploadFile: success`)
        console.log(JSON.stringify(res))
        resolve('task/' + fileName)
      } catch (error) {
        console.log(`NewTask.uploadTask: error= ${error}`)
        reject(error)
      }
    })
  }

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

  const getLatestTaskID = (projectID) => {
    console.log(`NewTask.onSubmitTask.getLatestTaskID(${projectID}): called`)
    return new Promise(async (resolve, reject) => {
      try {
        const axiosGetResponse = await axios.get(`http://localhost:5050/api/web/task/lastid/${projectID}`)

        console.log(`NewTask.onSubmitTask.getLatestTaskID(${projectID}).axiosGetResponse: ${JSON.stringify(axiosGetResponse.data)}`)
        if (axiosGetResponse.data == "") {
          //console.log("00")
          resolve("00")
        } else {
          //console.log(axiosGetResponse.data[0].tc_id.substr(-2, 2))
          resolve(axiosGetResponse.data[0].tc_id.substr(-2, 2))
        }
      } catch (error) {
        reject(error)
      }
    })
  }

  const createNewTask = (taskID, date) => {
    console.log(`NewTask.onSubmitTask.createNewTask: called`)
    const newduedate = duedate.replace(/-/g, "") + "000000"
    console.log(newduedate)

    return new Promise(async (resolve, reject) => {
      try {
        const axiosPostResponse = await axios.post("http://localhost:5050/api/web/task/postnewticket", {
          tc_id: taskID,
          tc_pjcode: pjcode,
          tc_title: title.trim(),
          tc_detail: detail.trim(),
          tc_assignedto: assign,
          tc_createdat: date,
          tc_status: 'PENDING',
          tc_duedate: newduedate,
          tc_priority: priority,
        })

        resolve(axiosPostResponse)
      } catch (error) {
        reject(error)
      }
    })
  }

  const createNewTaskWithFile = (taskID, date, filePath) => {
    console.log(`NewTask.onSubmitTask.createNewTask: called`)
    return new Promise(async (resolve, reject) => {
      try {
        const axiosPostResponse = await axios.post(`http://localhost:5050/api/web/task/postnewticketwithfile`, {
          tc_id: taskID,
          tc_title: title.trim(),
          tc_detail: detail.trim(),
          tc_assignedto: assign,
          tc_createdat: date,
          tc_status: 'PENDING',
          tc_duedate: duedate,
          tc_priority: priority,
          tc_filepath: filePath
        })

        resolve(axiosPostResponse)
      } catch (error) {
        reject(error)
      }
    })
  }

  //TODO:
  const onSubmitTask = async () => {
    console.log(`NewTask.onSubmitTask: called`)
    try {
      const date = await getCurrentDate()
      console.log(`NewTask.onSubmitTask: date=${date}`)
      var taskID = "NETSYS" + date.substr(0, 8)
      var latestID = await getLatestTaskID(taskID)
      console.log(`NewTask.onSubmitTask: latestID=${latestID}`)
      taskID = taskID + (++latestID < 10 ? '0' : '') + latestID
      console.log(`NewTask.onSubmitTask: next projectID=${taskID}`)
      const nice = await createNewTask(taskID, date)
      //what to do
      // if (fileAsset.fileExist) {
      //   const filePath = await uploadFile(fileAsset.uri, taskID)
      //   const nice = await createNewTaskWithFile(taskID, date, filePath)
      // } else {
      //   const nice = await createNewTask(taskID, date)
      // }
      setTitle('')
      setAssign('')
      setDetail('')
      setDuedate('')
      setPriority('')
      setOpenTask(false)
    } catch (error) {
      console.log(error)
    }
  }

  const getRecommend = () => {
    setRecommend();
  };

  return (
  <Box>
    <Modal
        open={openTask}
        onClose={() => setOpenTask(false)}
        aria-labelledby="simple-modal-title"
      >
      <Box style={modalStyle} className={classes.paper}>
        <FormControl sx={{ display: 'flex', flexDirection: 'column'}}>
          <FormLabel>Task Title:</FormLabel>
          <TextField type="text" placeholder="Enter task title" value={title} onChange={e => setTitle(e.target.value)}/>
          <FormLabel>
            Assign To:
            <Select value={assign} onChange={e => setAssign(e.target.value)}>
              <MenuItem value={'Ali'}>Ali</MenuItem>
              <MenuItem value={'Abu'}>Abu</MenuItem>
              <MenuItem value={'Acong'}>Acong</MenuItem>
            </Select>
          </FormLabel>
          <FormLabel>Task Details:</FormLabel>
          <TextField type="text" placeholder="Enter task detail" value={detail} onChange={e => setDetail(e.target.value)}/>
          <FormLabel>Attachment:</FormLabel>
          <TextField type="file" value={file} onChange={handleFileChange}/>
          <FormLabel>Due Date:</FormLabel>
          <TextField type="date" value={duedate} onChange={e => setDuedate(e.target.value)}/>
          <FormLabel>
            Task Priority:
            <Select value={priority} onChange={e => setPriority(e.target.value)}>
              <MenuItem value={'Low'}>Low</MenuItem>
              <MenuItem value={'Medium'}>Medium</MenuItem>
              <MenuItem value={'High'}>High</MenuItem>
            </Select>
          </FormLabel>
          <Button variant="contained" color="primary" onClick={onSubmitTask}>Upload</Button>
        </FormControl>
      </Box>
    </Modal>

    <Box sx={{ display: 'flex', justifyContent: 'flex-end', p:1, mr:5}}>
    <Button variant="contained" onClick={() => {
      setOpenTask(true); 
      getRecommend();
    }} color="primary">Add Task</Button>
    </Box>

      <Card {...rest}>
        <PerfectScrollbar>
          <Box sx={{ minWidth: 1050 }}>
            <Table>
              <TableHead>
                <TableRow>
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
                    <TableCell>
                      <Box
                        sx={{
                          alignItems: 'center',
                          display: 'flex'
                        }}
                      >
                        <Typography
                          color="textPrimary"
                          variant="body1"
                        >
                          {task.tc_title}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {task.tc_assignedto}
                    </TableCell>
                    <TableCell>
                      {task.tc_status}
                    </TableCell>
                    <TableCell>
                      {task.tc_duedate}
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
    </Box>
  );
};

TaskListResults.propTypes = {
  tasks: PropTypes.array.isRequired
};

export default TaskListResults;
