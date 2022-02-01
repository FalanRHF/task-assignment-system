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
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
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
    width: 500,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

const CompanyListResults = () => {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [openCompany, setOpenCompany] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [name, setName] = useState('');
  const [detail, setDetail] = useState('');
  const [code, setCode] = useState('');
  const [updatedName, setUpdatedName] = useState('');
  const [updatedDetail, setUpdatedDetail] = useState('');
  const [updatedCode, setUpdatedCode] = useState('');
  const [company, setCompany] = useState([]);
  const [deletedCompany, setDeletedCompany] = useState('');

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const onSubmitCompany = () => {
    console.log(`onSubmitcompany: called`)
    return new Promise(async (resolve, reject) => {
      try {
        const axiosPostResponse = await axios.post("http://localhost:5050/api/web/company/postnewcompany", {
          cm_name: name,
          cm_code: code.toUpperCase(),
          cm_detail: detail.trim()
        })

        resolve(axiosPostResponse)
      } catch (error) {
        reject(error)
      }
      setName('')
      setDetail('')
      setCode('')
      setOpenCompany(false)
      getCompany()
    })
  }

  const onUpdateCompany = () => {
    console.log(`onUpdatecompany: called`)
    return new Promise(async (resolve, reject) => {
      try {
        const axiosPostResponse = await axios.post("http://localhost:5050/api/web/company/updatecompany", {
          cm_name: updatedName,
          cm_code: updatedCode,
          cm_detail: updatedDetail.trim()
        })

        resolve(axiosPostResponse)
      } catch (error) {
        reject(error)
      }
      setUpdatedName('')
      setUpdatedDetail('')
      setUpdatedCode('')
      setOpenUpdate(false)
      getCompany()
    })
  }

  const deleteCompany = async id => {
    try {
      const deleteCompany = await axios.delete(`http://localhost:5050/api/web/company/deletecompany/${id}`);
      console.log("Company deleted")
      setCompany(company.filter(cm => cm.cm_code !== id));
    } catch (err) {
      console.error(err.message);
    }
    setOpenDelete(false)
    setDeletedCompany('')
  };

  const getCompany = async () => {
      try {
        const { data }  = await axios.get(`http://localhost:5050/api/web/company/getcompany`)
        setCompany(data)
      } catch (error) {
        console.error('getCompany(): ERROR')
      }
  }

  useEffect(() => {
    getCompany();
  }, []);

  return (
  <Box>
    <Modal
        open={openCompany}
        onClose={() => { setOpenCompany(false); setName(''); setDetail(''); setCode('') }}
        aria-labelledby="simple-modal-title"
      >
      <Box style={modalStyle} className={classes.paper}>
        <FormControl sx={{ display: 'flex', flexDirection: 'column'}}>
          <FormLabel>Company Name:</FormLabel>
          <TextField type="text" placeholder="Enter company name" value={name} onChange={e => setName(e.target.value)}/>
          <FormLabel>Company Details:</FormLabel>
          <TextField type="text" placeholder="Enter company details" value={detail} onChange={e => setDetail(e.target.value)}/>
          <FormLabel>Company Code:</FormLabel>
          <TextField inputProps={{ maxLength: 6 }} type="text" placeholder="Enter company code" value={code} onChange={e => setCode(e.target.value)}/>
        </FormControl>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt:2 }}>
          <Button sx={{ bgcolor:'lightgreen', mr:1 }} variant="contained" onClick={() => { setOpenCompany(false); setName(''); setDetail(''); setCode('') }}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={onSubmitCompany}>Add</Button>
        </Box>

      </Box>
    </Modal>

    <Box sx={{ display: 'flex', justifyContent: 'flex-end', p:1, mr:5}}>
    <Button variant="contained" onClick={() => setOpenCompany(true)} color="primary">Add Company</Button>
    </Box>

      <Card>
        <PerfectScrollbar>
          <Box sx={{ minWidth: 1050 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    Company Name
                  </TableCell>
                  <TableCell>
                    Company Details
                  </TableCell>
                  <TableCell>
                    PIC Name
                  </TableCell>
                  <TableCell>
                    PIC Number
                  </TableCell>
                  <TableCell>
                    Company Code
                  </TableCell>
                  <TableCell>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {company.slice(0, limit).map((cm) => (
                  <TableRow key={cm.cm_code}>
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
                          {cm.cm_name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {cm.cm_detail}
                    </TableCell>
                    <TableCell>
                      {cm.cl_fullname}
                    </TableCell>
                    <TableCell>
                      {cm.cl_phonenum}
                    </TableCell>
                    <TableCell>
                      {cm.cm_code}
                    </TableCell>
                    <TableCell>
                      <Box sx={{display: 'flex'}}>
                        <IconButton sx={{ color:'lightgreen' }} onClick={() => { setOpenUpdate(true); setUpdatedName(cm.cm_name); setUpdatedDetail(cm.cm_detail); setUpdatedCode(cm.cm_code) }} aria-label="edit">
                          <EditIcon/>
                        </IconButton>
                        <IconButton sx={{ color:'red' }} onClick={() => { setOpenDelete(true); setDeletedCompany(cm.cm_code) } } aria-label="delete">
                          <DeleteIcon/>
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <Dialog
              open={openDelete}
              onClose={() => { setOpenDelete(false); setDeletedCompany('') }}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">{"Are you sure you want to delete this company?"}</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  This action will delete all the details about the company from the system.
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button sx={{ bgcolor:'lightgreen' }} variant="contained" onClick={() => { setOpenDelete(false); setDeletedCompany('') }}>
                  Cancel
                </Button>
                <Button sx={{ bgcolor:'red' }} variant="contained" onClick={() => deleteCompany(deletedCompany)} autoFocus>
                  Delete
                </Button>
              </DialogActions>
            </Dialog>

            <Modal
                open={openUpdate}
                onClose={() => { setOpenUpdate(false); setUpdatedName(''); setUpdatedDetail(''); setUpdatedCode('') }}
                aria-labelledby="simple-modal-title"
              >
              <Box style={modalStyle} className={classes.paper}>
                <FormControl sx={{ display: 'flex', flexDirection: 'column' }}>
                  <FormLabel>Company Name:</FormLabel>
                  <TextField type="text" value={updatedName} onChange={e => setUpdatedName(e.target.value)}/>
                  <FormLabel>Company Details:</FormLabel>
                  <TextField type="text" value={updatedDetail} onChange={e => setUpdatedDetail(e.target.value)}/>
                  <FormLabel>Company Code:</FormLabel>
                  <TextField disabled type="text" value={updatedCode}/>
                </FormControl>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt:2 }}>
                  <Button sx={{ bgcolor:'lightgreen', mr:1 }} variant="contained" onClick={() => { setOpenUpdate(false); setUpdatedName(''); setUpdatedDetail(''); setUpdatedCode('') }}>Cancel</Button>
                  <Button sx={{ bgcolor:'lightblue' }} variant="contained" onClick={onUpdateCompany}>Update</Button>
                </Box>
              </Box>
            </Modal>

          </Box>
        </PerfectScrollbar>
        <TablePagination
          component="div"
          count={company.length}
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

export default CompanyListResults;
