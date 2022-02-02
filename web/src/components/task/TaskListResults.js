import React, { useState, useEffect } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Box,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormLabel,
  IconButton,
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
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { makeStyles } from '@material-ui/styles';
import axios from 'axios';
import env from '../../env.json'
const SERVER_DOMAIN = env.SERVER_DOMAIN

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

const TaskListResults = () => {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [openTask, setOpenTask] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [title, setTitle] = useState('');
  const [detail, setDetail] = useState('');
  const [pjcode, setpjCode] = useState('');
  const [assign, setAssign] = useState('');
  const [file, setFile] = useState('');
  const [filename, setFilename] = useState('');
  const [uploadedFile, setUploadedFile] = useState({});
  const [duedate, setDuedate] = useState('');
  const [priority, setPriority] = useState('');
  const [updatedID, setUpdatedID] = useState('');
  const [updatedTitle, setUpdatedTitle] = useState('');
  const [updatedDetail, setUpdatedDetail] = useState('');
  const [updatedAssign, setUpdatedAssign] = useState('');
  const [updatedDuedate, setUpdatedDuedate] = useState('');
  const [updatedPriority, setUpdatedPriority] = useState('');
  const [task, setTask] = useState([]);
  const [deletedTask, setDeletedTask] = useState('');
  const [employee, setEmployee] = useState([]);
  const [recommend, setRecommend] = useState([]);

  const imageLink = (filePath) => {
    if (filePath == null) {
      return null
    }
    const url = SERVER_DOMAIN + '/' + filePath;
    return (<a href={url} target="_blank">File link</a>)
  }

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setFilename(e.target.files[0].name);
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

  const getLatestTaskID = (projectID) => {
    console.log(`NewTask.onSubmitTask.getLatestTaskID(${projectID}): called`)
    return new Promise(async (resolve, reject) => {
      try {
        const axiosGetResponse = await axios.get(`${SERVER_DOMAIN}/api/web/task/lastid/${projectID}`)

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
        const axiosPostResponse = await axios.post(`${SERVER_DOMAIN}/api/web/task/postnewticket`, {
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
    const newduedate = duedate.replace(/-/g, "") + "000000"
    console.log(newduedate)
    return new Promise(async (resolve, reject) => {
      try {
        const axiosPostResponse = await axios.post(`${SERVER_DOMAIN}/api/web/task/postnewticketwithfile`, {
          tc_id: taskID,
          tc_title: title.trim(),
          tc_detail: detail.trim(),
          tc_assignedto: assign,
          tc_createdat: date,
          tc_status: 'PENDING',
          tc_duedate: newduedate,
          tc_priority: priority,
          tc_filepath: filePath
        })

        resolve(axiosPostResponse)
      } catch (error) {
        reject(error)
      }
    })
  }

  //TODO
  // const uploadFile = (fileURI, taskID) => {
  //   console.log(`NewTask.uploadFile: called`)
  //   console.log(`imageURI: ${fileURI}`)
  //   let fd = new FormData()
  //   const fileName = taskID + '.jpg'
  //   fd.append('ticketFile', { name:fileName })
  //   return new Promise(async (resolve, reject) => {
  //     try {
  //       const res = axios.post(`${SERVER_DOMAIN}/api/web/task/uploadfile`, fd)
  //       console.log(`NewTask.uploadFile: success`)
  //       console.log(JSON.stringify(res))
  //       resolve('task/' + fileName)
  //     } catch (error) {
  //       console.log(`NewTask.uploadTask: error= ${error}`)
  //       reject(error)
  //     }
  //   })
  // }

  const uploadFile = (taskID) => {
    const formData = new FormData();
    formData.append('file', file);

    return new Promise(async (resolve, reject) => {
      try {
        const res = await axios.post(`${SERVER_DOMAIN}/api/web/task/uploadfile/${taskID}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
        });
        const { fileName, filePath } = res.data;
        console.log(fileName)
        console.log(filePath)
        setUploadedFile({ fileName, filePath });
        resolve('api/files/attachments/' + fileName)
      } catch (err) {
        if (err.response.status === 500) {
          console.log('There was a problem with the server');
        } else {
          console.log(err.response.data.msg);
        }
        reject(err)
      }
    });

  };

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
      if (filename === "") {
        const nice = await createNewTask(taskID, date)
      } else {
        const filePath = await uploadFile(taskID)
        const nice = await createNewTaskWithFile(taskID, date, filePath)
      }
      setTitle('')
      setAssign('')
      setDetail('')
      setDuedate('')
      setPriority('')
      setFile('')
      setFilename('')
      setOpenTask(false)
      getTask()
    } catch (error) {
      console.log(error)
    }
  }

  const onUpdateTask = () => {
    console.log(`onUpdatetask: called`)
    return new Promise(async (resolve, reject) => {
      try {
        const axiosPostResponse = await axios.post(`${SERVER_DOMAIN}/api/web/task/updatetask`, {
          tc_id: updatedID,
          tc_title: updatedTitle.trim(),
          tc_detail: updatedDetail.trim(),
          tc_assignedto: updatedAssign,
          tc_duedate: updatedDuedate,
          tc_priority: updatedPriority,
        })

        resolve(axiosPostResponse)
      } catch (error) {
        reject(error)
      }
      setUpdatedID('')
      setUpdatedTitle('')
      setUpdatedDetail('')
      setUpdatedAssign('')
      setUpdatedDuedate('')
      setUpdatedPriority('')
      setOpenUpdate(false)
      getTask()
    })
  }

  const deleteTask = async id => {
    try {
      const deleteTask = await axios.delete(`${SERVER_DOMAIN}/api/web/task/deleteticket/${id}`);
      console.log("Task deleted")
      setTask(task.filter(ta => ta.tc_id !== id));
    } catch (err) {
      console.error(err.message);
    }
    setOpenDelete(false)
    setDeletedTask('')
  };

  const getTask = async () => {
    try {
      const { data } = await axios.get(`${SERVER_DOMAIN}/api/web/task/getticket`)
      setTask(data)
    } catch (error) {
      console.error('getTask(): ERROR')
    }
  }

  const getEmployee = async () => {
    try {
      const { data } = await axios.get(`${SERVER_DOMAIN}/api/web/task/getemployee`)
      setEmployee(data)
    } catch (error) {
      console.error('getEmployee(): ERROR')
    }
  }

  useEffect(() => {
    getTask();
    getEmployee();
  }, []);

  const getRecommend = () => {
    setRecommend();
  };

  return (
    <Box>
      <Modal
        open={openTask}
        onClose={() => { setOpenTask(false); setTitle(''); setAssign(''); setDetail(''); setDuedate(''); setPriority(''); setFile(''); setFilename('') }}
        aria-labelledby="simple-modal-title"
      >
        <Box style={modalStyle} className={classes.paper}>
          <FormControl sx={{ display: 'flex', flexDirection: 'column' }}>
            <FormLabel>Task Title:</FormLabel>
            <TextField type="text" placeholder="Enter task title" value={title} onChange={e => setTitle(e.target.value)} />
            <FormLabel>
              Assign To:
              <Select sx={{ pr: 5 }} value={assign} onChange={e => setAssign(e.target.value)}>
                {employee.map((em) => {
                  return (
                    <MenuItem key={em.em_fullname} value={em.em_fullname}>{em.em_fullname}</MenuItem>
                  )
                })}
              </Select>
            </FormLabel>
            <FormLabel>Task Details:</FormLabel>
            <TextField type="text" placeholder="Enter task detail" value={detail} onChange={e => setDetail(e.target.value)} />
            <FormLabel>Attachment File:</FormLabel>
            <TextField type="file" onChange={handleFileChange} />
            <FormLabel>Due Date:</FormLabel>
            <TextField type="date" value={duedate} onChange={e => setDuedate(e.target.value)} />
          </FormControl>
          <FormControl>
            <FormLabel>
              Task Priority:
              <Select value={priority} onChange={e => setPriority(e.target.value)}>
                <MenuItem value={'Low'}>Low</MenuItem>
                <MenuItem value={'Medium'}>Medium</MenuItem>
                <MenuItem value={'High'}>High</MenuItem>
              </Select>
            </FormLabel>
          </FormControl>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 2 }}>
            <Button sx={{ bgcolor: 'lightgreen', mr: 1 }} variant="contained" onClick={() => { setOpenTask(false); setTitle(''); setAssign(''); setDetail(''); setDuedate(''); setPriority(''); setFile(''); setFilename('') }}>Cancel</Button>
            <Button variant="contained" color="primary" onClick={onSubmitTask}>Add</Button>
          </Box>
        </Box>
      </Modal>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1, mr: 5 }}>
        <Button variant="contained" onClick={() => { setOpenTask(true); getRecommend() }} color="primary">Add Task</Button>
      </Box>

      <Card>
        <PerfectScrollbar>
          <Box sx={{ minWidth: 1050 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    Title
                  </TableCell>
                  <TableCell>
                    Title details
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
                  <TableCell>
                    Priority
                  </TableCell>
                  <TableCell>
                    File Link
                  </TableCell>
                  <TableCell>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {task.slice(0, limit).map((ta) => (
                  <TableRow key={ta.tc_id}>
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
                          {ta.tc_title}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {ta.tc_detail}
                    </TableCell>
                    <TableCell>
                      {ta.tc_assignedto}
                    </TableCell>
                    <TableCell>
                      {ta.tc_status}
                    </TableCell>
                    <TableCell>
                      {ta.tc_duedate.slice(0, -6)}
                    </TableCell>
                    <TableCell>
                      {ta.tc_priority}
                    </TableCell>
                    <TableCell>
                      {imageLink(ta.tc_filepath)}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex' }}>
                        <IconButton sx={{ color: 'lightgreen' }} onClick={() => { setOpenUpdate(true); setUpdatedID(ta.tc_id); setUpdatedTitle(ta.tc_title); setUpdatedDetail(ta.tc_detail); setUpdatedAssign(ta.tc_assignedto); setUpdatedDuedate(ta.tc_duedate); setUpdatedPriority(ta.tc_priority) }} aria-label="edit">
                          <EditIcon />
                        </IconButton>
                        <IconButton sx={{ color: 'red' }} onClick={() => { setOpenDelete(true); setDeletedTask(ta.tc_id) }} aria-label="delete">
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Dialog
              open={openDelete}
              onClose={() => { setOpenDelete(false); setDeletedTask('') }}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">{"Are you sure you want to delete this task?"}</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  This action will delete all the details about the task from the system.
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button sx={{ bgcolor: 'lightgreen' }} variant="contained" onClick={() => { setOpenDelete(false); setDeletedTask('') }}>
                  Cancel
                </Button>
                <Button sx={{ bgcolor: 'red' }} variant="contained" onClick={() => deleteTask(deletedTask)} autoFocus>
                  Delete
                </Button>
              </DialogActions>
            </Dialog>

            <Modal
              open={openUpdate}
              onClose={() => { setOpenUpdate(false); setUpdatedTitle(''); setUpdatedDetail(''); setUpdatedAssign(''); setUpdatedDuedate(''); setUpdatedPriority('') }}
              aria-labelledby="simple-modal-title"
            >
              <Box style={modalStyle} className={classes.paper}>
                <FormControl sx={{ display: 'flex', flexDirection: 'column' }}>
                  <FormLabel>Task Title:</FormLabel>
                  <TextField type="text" value={updatedTitle} onChange={e => setUpdatedTitle(e.target.value)} />
                  <FormLabel>
                    Assign To:
                    <Select value={updatedAssign} onChange={e => setUpdatedAssign(e.target.value)}>
                      {employee.map((em) => {
                        return (
                          <MenuItem key={em.em_fullname} value={em.em_fullname}>{em.em_fullname}</MenuItem>
                        )
                      })}
                    </Select>
                  </FormLabel>
                  <FormLabel>Task Details:</FormLabel>
                  <TextField type="text" value={updatedDetail} onChange={e => setUpdatedDetail(e.target.value)} />
                  <FormLabel>Due Date:</FormLabel>
                  <TextField type="date" value={updatedDuedate} onChange={e => setUpdatedDuedate(e.target.value)} />
                </FormControl>
                <FormControl>
                  <FormLabel>
                    Task Priority:
                    <Select value={updatedPriority} onChange={e => setUpdatedPriority(e.target.value)}>
                      <MenuItem value={'Low'}>Low</MenuItem>
                      <MenuItem value={'Medium'}>Medium</MenuItem>
                      <MenuItem value={'High'}>High</MenuItem>
                    </Select>
                  </FormLabel>
                </FormControl>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 2 }}>
                  <Button sx={{ bgcolor: 'lightgreen', mr: 1 }} variant="contained" onClick={() => { setOpenUpdate(false); setUpdatedTitle(''); setUpdatedDetail(''); setUpdatedAssign(''); setUpdatedDuedate(''); setUpdatedPriority('') }}>Cancel</Button>
                  <Button sx={{ bgcolor: 'lightblue' }} variant="contained" onClick={onUpdateTask}>Update</Button>
                </Box>
              </Box>
            </Modal>

          </Box>
        </PerfectScrollbar>
        <TablePagination
          component="div"
          count={task.length}
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

export default TaskListResults;
