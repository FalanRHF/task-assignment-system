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
  Modal
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
    width: 500,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

const EmployeeListResults = () => {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [openEmployee, setOpenEmployee] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [email, setEmail] = useState('');
  const [deletedEmail, setDeletedEmail] = useState('');
  const [employee, setEmployee] = useState([]);

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const onSubmitEmployee = () => {
    console.log(`NewTask.onSubmitemployee: called`)
    return new Promise(async (resolve, reject) => {
      try {
        const axiosPostResponse = await axios.post(`${SERVER_DOMAIN}/api/web/employee/postnewemployee`, {
          em_email: email,
        })

        resolve(axiosPostResponse)
      } catch (error) {
        reject(error)
      }
      setEmail('')
      setOpenEmployee(false)
      getEmployee()
    })
  }

  const deleteEmployee = async id => {
    try {
      const deleteEmployee = await axios.delete(`${SERVER_DOMAIN}/api/web/employee/deleteemployee/${id}`);
      console.log("Employee deleted")
      setEmployee(employee.filter(em => em.em_email !== id));
    } catch (err) {
      console.error(err.message);
    }
    setOpenDelete(false)
    setDeletedEmail('')
  };

  const getEmployee = async () => {
    try {
      const { data } = await axios.get(`${SERVER_DOMAIN}/api/web/employee/getemployee`)
      setEmployee(data)
    } catch (error) {
      console.error('getEmployee(): ERROR')
    }
  }

  useEffect(() => {
    getEmployee();
  }, []);

  return (
    <Box>
      <Modal
        open={openEmployee}
        onClose={() => setOpenEmployee(false)}
        aria-labelledby="simple-modal-title"
      >
        <Box style={modalStyle} className={classes.paper}>
          <FormControl sx={{ display: 'flex', flexDirection: 'column' }}>
            <FormLabel>Employee email:</FormLabel>
            <TextField type="email" placeholder="Enter employee email" value={email} onChange={e => setEmail(e.target.value)} />
          </FormControl>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 2 }}>
            <Button sx={{ bgcolor: 'lightgreen', mr: 1 }} variant="contained" onClick={() => { setOpenEmployee(false); setEmail('') }}>Cancel</Button>
            <Button variant="contained" color="primary" onClick={onSubmitEmployee}>Add</Button>
          </Box>

        </Box>
      </Modal>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1, mr: 5 }}>
        <Button variant="contained" onClick={() => setOpenEmployee(true)} color="primary">Add Employee</Button>
      </Box>

      <Card>
        <PerfectScrollbar>
          <Box sx={{ minWidth: 1050 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    Full Name
                  </TableCell>
                  <TableCell>
                    Contact Number
                  </TableCell>
                  <TableCell>
                    Email address
                  </TableCell>
                  <TableCell>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {employee.slice(0, limit).map((em) => (
                  <TableRow key={em.em_email}>
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
                          {em.em_fullname}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {em.em_phonenum}
                    </TableCell>
                    <TableCell>
                      {em.em_email}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex' }}>
                        <IconButton sx={{ color: 'red' }} onClick={() => { setOpenDelete(true); setDeletedEmail(em.em_email) }} aria-label="delete">
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
              onClose={() => { setOpenDelete(false); setDeletedEmail('') }}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">{"Are you sure you want to delete this employee?"}</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  This action will delete the employee details from the system.
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button sx={{ bgcolor: 'lightgreen' }} variant="contained" onClick={() => { setOpenDelete(false); setDeletedEmail('') }}>
                  Cancel
                </Button>
                <Button sx={{ bgcolor: 'red' }} variant="contained" onClick={() => deleteEmployee(deletedEmail)} autoFocus>
                  Delete
                </Button>
              </DialogActions>
            </Dialog>

          </Box>
        </PerfectScrollbar>
        <TablePagination
          component="div"
          count={employee.length}
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

export default EmployeeListResults;
