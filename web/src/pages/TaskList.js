import { Helmet } from 'react-helmet';
import { Box, Container } from '@material-ui/core';
import TaskListResults from '../components/task/TaskListResults';
import customers from '../__mocks__/customers';

const TaskList = () => (
  <>
    <Helmet>
      <title>Task</title>
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
          <TaskListResults customers={customers} />
        </Box>
      </Container>
    </Box>
  </>
);

export default TaskList;
