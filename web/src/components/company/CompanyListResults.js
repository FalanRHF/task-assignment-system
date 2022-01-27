import "./CompanyListResults.css"
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
  FormControl,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  Modal,
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

const CompanyListResults = ({ projects, ...rest }) => {
  // const [selectedprojectIds, setSelectedprojectIds] = useState([]);
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

  // const handleSelectAll = (event) => {
  //   let newSelectedprojectIds;

  //   if (event.target.checked) {
  //     newSelectedprojectIds = projects.map((project) => project.id);
  //   } else {
  //     newSelectedprojectIds = [];
  //   }

  //   setSelectedprojectIds(newSelectedprojectIds);
  // };

  // const handleSelectOne = (event, id) => {
  //   const selectedIndex = selectedprojectIds.indexOf(id);
  //   let newSelectedprojectIds = [];

  //   if (selectedIndex === -1) {
  //     newSelectedprojectIds = newSelectedprojectIds.concat(selectedprojectIds, id);
  //   } else if (selectedIndex === 0) {
  //     newSelectedprojectIds = newSelectedprojectIds.concat(selectedprojectIds.slice(1));
  //   } else if (selectedIndex === selectedprojectIds.length - 1) {
  //     newSelectedprojectIds = newSelectedprojectIds.concat(selectedprojectIds.slice(0, -1));
  //   } else if (selectedIndex > 0) {
  //     newSelectedprojectIds = newSelectedprojectIds.concat(
  //       selectedprojectIds.slice(0, selectedIndex),
  //       selectedprojectIds.slice(selectedIndex + 1)
  //     );
  //   }

  //   setSelectedprojectIds(newSelectedprojectIds);
  // };

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
    })
  }

  const getCompany = () => {
    return new Promise(async (resolve, reject) => {
      try {
        const { company } = await axios.get(`http://localhost:5050/api/web/company/getcompany`)
        resolve(company)
      } catch (error) {
        console.error('getCompany(): ERROR')
        reject(error)
      }
    })
  }

  useEffect(() => {
    getCompany();
  }, []);

  return (
  <div>
    <Modal
        open={openCompany}
        onClose={() => setOpencompany(false)}
        aria-labelledby="simple-modal-title"
      >
      <div style={modalStyle} className={classes.paper}>
        <form className="add_company">
          <label>Company Name:</label>
          <input type="text" placeholder="Enter company name" value={name} onChange={e => setName(e.target.value)}/>
          <label>Company Details:</label>
          <input type="text" placeholder="Enter company details" value={details} onChange={e => setDetails(e.target.value)}/>
          <label>Company Code:</label>
          <input type="text" placeholder="Enter company code" value={code} onChange={e => setCode(e.target.value)}/>
          <Button variant="contained" color="primary" onClick={onSubmitcompany}>Add</Button>
        </form>
      </div>
    </Modal>

    <Box sx={{ display: 'flex', justifyContent: 'flex-end', p:1, mr:5}}>
    <Button variant="contained" onClick={() => setOpencompany(true)} color="primary">Add Company</Button>
    </Box>

      <Card {...rest}>
        <PerfectScrollbar>
          <Box sx={{ minWidth: 1050 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    {/* <Checkbox
                      checked={selectedprojectIds.length === projects.length}
                      color="primary"
                      indeterminate={
                        selectedprojectIds.length > 0
                        && selectedprojectIds.length < projects.length
                      }
                      onChange={handleSelectAll}
                    /> */}
                  </TableCell>
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
                {projects.slice(0, limit).map((project) => (
                  <TableRow
                    hover
                    key={project.id}
                    selected={selectedprojectIds.indexOf(project.id) !== -1}
                  >
                    <TableCell padding="checkbox">
                      {/* <Checkbox
                        checked={selectedprojectIds.indexOf(project.id) !== -1}
                        onChange={(event) => handleSelectOne(event, project.id)}
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
                          src={project.avatarUrl}
                          sx={{ mr: 2 }}
                        >
                          {getInitials(project.name)}
                        </Avatar> */}
                        <Typography
                          color="textPrimary"
                          variant="body1"
                        >
                          {project.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {project.email}
                    </TableCell>
                    <TableCell>
                      {project.phone}
                    </TableCell>
                    <TableCell>
                      {moment(project.createdAt).format('DD/MM/YYYY')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </PerfectScrollbar>
        <TablePagination
          component="div"
          count={projects.length}
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

CompanyListResults.propTypes = {
  projects: PropTypes.array.isRequired
};

export default CompanyListResults;
