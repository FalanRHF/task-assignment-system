import React, { useState, useEffect } from 'react';
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
  const [selectedprojectIds] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [openCompany, setOpencompany] = useState(false);
  const [name, setName] = useState('');
  const [details, setDetails] = useState('');
  const [code, setCode] = useState('');
  const [company, setCompany] = useState([]);

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const onSubmitcompany = () => {
    console.log(`NewTask.onSubmitcompany: called`)
    return new Promise(async (resolve, reject) => {
      try {
        const axiosPostResponse = await axios.post("http://localhost:5050/api/web/company/postnewcompany", {
          cm_name: name,
          cm_code: code,
          cm_detail: details.trim()
        })

        resolve(axiosPostResponse)
      } catch (error) {
        reject(error)
      }
      setName('')
      setDetails('')
      setCode('')
      setOpencompany(false)
      getCompany()
    })
  }

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
        onClose={() => setOpencompany(false)}
        aria-labelledby="simple-modal-title"
      >
      <Box style={modalStyle} className={classes.paper}>
        <FormControl sx={{ display: 'flex', flexDirection: 'column'}}>
          <FormLabel>Company Name:</FormLabel>
          <TextField type="text" placeholder="Enter company name" value={name} onChange={e => setName(e.target.value)}/>
          <FormLabel>Company Details:</FormLabel>
          <TextField type="text" placeholder="Enter company details" value={details} onChange={e => setDetails(e.target.value)}/>
          <FormLabel>Company Code:</FormLabel>
          <TextField type="text" placeholder="Enter company code" value={code} onChange={e => setCode(e.target.value)}/>
          <Button variant="contained" color="primary" onClick={onSubmitcompany}>Add</Button>
        </FormControl>
      </Box>
    </Modal>

    <Box sx={{ display: 'flex', justifyContent: 'flex-end', p:1, mr:5}}>
    <Button variant="contained" onClick={() => setOpencompany(true)} color="primary">Add Company</Button>
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
                    PIC Name
                  </TableCell>
                  <TableCell>
                    PIC Number
                  </TableCell>
                  <TableCell>
                    Company Code
                  </TableCell>
                  <TableCell>
                    Company Details
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {company.slice(0, limit).map((comp) => (
                  <TableRow key={comp.cm_code}>
                    <TableCell>
                      <Box
                        sx={{
                          alignItems: 'center',
                          display: 'flex'
                        }}
                      >
                        {/* <Avatar
                          src={project.avatarUrl}
                          sx={{ mr: 2 }}
                        >
                          {getInitials(project.name)}
                        </Avatar> */}
                        <Typography
                          color="textPrimary"
                          variant="body1"
                        >
                          {comp.cm_name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {comp.cl_fullname}
                    </TableCell>
                    <TableCell>
                      {comp.cl_phonenum}
                    </TableCell>
                    <TableCell>
                      {comp.cm_code}
                    </TableCell>
                    <TableCell>
                      {comp.cm_detail}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
