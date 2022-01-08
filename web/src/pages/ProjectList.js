import { Helmet } from 'react-helmet';
import { Box, Container } from '@material-ui/core';
import ProjectListResults from '../components/project/ProjectListResults';
import projects from '../__mocks__/projects';

const ProjectList = () => (
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
          <ProjectListResults projects={projects} />
        </Box>
      </Container>
    </Box>
  </>
);

export default ProjectList;
