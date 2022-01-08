import "./ProjectListResults.css"
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
    width: 500,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

const ProjectListResults = ({ projects, ...rest }) => {
  // const [selectedprojectIds, setSelectedprojectIds] = useState([]);
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [selectedprojectIds] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [openproject, setOpenproject] = useState(false);

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

  return (
  <div>
    <Modal
        open={openproject}
        onClose={() => setOpenproject(false)}
        aria-labelledby="simple-modal-title"
      >
      <div style={modalStyle} className={classes.paper}>
        <FormControl className="add_project">
          <input type="text" placeholder="Enter project name"/>
          <input type="text" placeholder="Enter client name"/>
          <input type="text" placeholder="Enter client contact number"/>
          <Button variant="contained" color="primary">Add</Button>
        </FormControl>
      </div>
    </Modal>

    <Box sx={{ display: 'flex', justifyContent: 'flex-end', p:1, mr:5}}>
    <Button variant="contained" onClick={() => setOpenproject(true)} color="primary">Add Project</Button>
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
                    Project Name
                  </TableCell>
                  <TableCell>
                    Client Name
                  </TableCell>
                  <TableCell>
                    Contact Number
                  </TableCell>
                  <TableCell>
                    Date Created
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

ProjectListResults.propTypes = {
  projects: PropTypes.array.isRequired
};

export default ProjectListResults;
