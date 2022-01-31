import { Helmet } from 'react-helmet';
import { Box, Container } from '@material-ui/core';
import EmployeeListResults from '../components/employee/EmployeeListResults';

const EmployeeList = () => (
  <>
    <Helmet>
      <title>Project</title>
    </Helmet>
    <Box
      sx={{
        backgroundColor: 'background.default',
        minHeight: '100%',
        py: 3
      }}
    >
      <Container maxWidth={false}>
        <Box sx={{ pt: 3 }}>
          <EmployeeListResults/>
        </Box>
      </Container>
    </Box>
  </>
);

export default EmployeeList;
