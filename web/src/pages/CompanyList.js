import { Helmet } from 'react-helmet';
import { Box, Container } from '@material-ui/core';
import CompanyListResults from '../components/company/CompanyListResults';

const CompanyList = () => (
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
          <CompanyListResults/>
        </Box>
      </Container>
    </Box>
  </>
);

export default CompanyList;
