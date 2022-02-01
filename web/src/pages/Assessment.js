import { Helmet } from 'react-helmet';
import React, { useState, useEffect } from 'react';
import { Box, Button, Card, CardActions, CardContent, CardHeader, CircularProgress, Container, Grid, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import axios from 'axios'
import FormatDate from '../components/DateFormatter'
import { CSVDownload, CSVLink } from "react-csv"
import { done } from 'nprogress';

const bull = (
  <Box
    component="span"
    sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
  >
    •
  </Box>
)

const numToMonth = { "01": "JANUARY", "02": "FEBRUARY", "03": "MARCH", "04": "APRIL", "05": "MAY", "06": "JUNE", "07": "JULY", "08": "AUGUST", "09": "SEPTEMBER", "10": "OCTOBER", "11": "NOVEMBER", "12": "DECEMBER" }


const Assessment = () => {
  const [date, setDate] = useState('')
  const [kpiData, setKpiData] = useState([])
  const [currentKPIdata, setCurrentKPIdata] = useState({})
  const [isLoaded, setIsLoaded] = useState(false)
  const [csvString, setCsvString] = useState('');

  // const today = new Date()

  var csvReportHeader = `NETSINITY SDN BHD\n\nMONTHLY ASSESSMENT REPORT\n\n`

  useEffect(() => {
    getKpiData()
    setDate(FormatDate(new Date().getTime()).substring(0, 6))
    return () => {
      console.log('Assessment Page unmounted')
    }
  }, [])

  useEffect(() => {
    init()
    setDate(FormatDate(new Date().getTime()).substring(0, 6))
    return () => {
      console.log('Assessment Page unmounted')
    }
  }, [])


  const init = async () => {
    console.log('init()');
    try {
      const unsortedData = await getKpiData()
      if (unsortedData.length > 0) {
        const sortedData = await sortKpiData(unsortedData)
        setKpiData(sortedData)
      }
    } catch (error) {
      console.log(error)
    }
    setIsLoaded(true)
  }


  const getKpiData = async () => {
    console.log('getKpiData()');
    return new Promise(async (resolve, reject) => {
      try {
        const { data } = await axios.get(`http://localhost:5050/api/web/kpi/data/all`)
        // console.log(data)
        resolve(data)
      } catch (error) {
        console.error(error)
        reject(error)
      }
    })
  }

  const sortKpiData = (data) => {
    return new Promise(async (resolve, reject) => {
      var arr3d = []
      var arr2d = []
      var curr_id = '' + data[0].kp_id

      data.map((row) => {
        if (row.kp_id != curr_id) {
          var temp_json = { "id": curr_id, "data": arr2d }
          arr3d.push(temp_json)
          arr2d = []
          curr_id = row.kp_id
        }
        arr2d.push(row)
      })
      var temp_json = { "id": curr_id, "data": arr2d }
      arr3d.push(temp_json)
      resolve(arr3d)
    })
  }

  const calculateScore = (id) => {
    console.log('Calculating Score...');
    return new Promise(async (resolve, reject) => {
      try {
        const { data } = await axios.get(`http://localhost:5050/api/web/kpi/newdata/${id}`)
        console.log(JSON.stringify(data))
        resolve(data)
      } catch (error) {
        console.log(error)
        reject(error)
      }
    })

  }

  const postScore = (id, data) => {
    console.log('id', id);
    return new Promise(async (resolve, reject) => {
      try {
        const res = await axios.post('http://localhost:5050/api/web/kpi/postdata', {
          id: id,
          data: data
        })
        resolve(res)
      } catch (error) {
        console.log(error)
        reject(error)
      }
    })
  }

  const generateKPIScore = async (prevMonth) => {
    const id = '' + prevMonth
    console.log('generateKPIScore clicked')
    try {
      const data = await calculateScore(id)
      if (data.length > 0) {
        await postScore(id, data)
      }
    } catch (error) {
      console.log(error)
    }
    init()
  }

  const renderGenerateKPIButton = (currentMonth) => {
    console.log('renderGenerateKPIButton()');
    let prevMonth = currentMonth - 1
    prevMonth = prevMonth % 10 > 0 ? prevMonth : (prevMonth - 88)
    if (isLoaded && (kpiData.length == 0 || kpiData[0].kp_id < prevMonth)) {
      return (
        <Container sx={{ paddingBottom: 2 }}>
          <Stack sx={{ alignItems: "center" }}>
            <Card elevation={5} sx={{ padding: 2 }}>
              <Stack sx={{ alignItems: "center" }}>
                <CardContent>
                  <Typography variant="h1" gutterBottom component="div">Ready to Generate!</Typography>
                </CardContent>
                <CardActions>
                  <Button variant="contained" onClick={() => generateKPIScore(prevMonth)}>GENERATE KPI SCORE</Button>
                </CardActions>
              </Stack>
            </Card>
          </Stack>
        </Container>
      )
    }
  }

  const KPIRow = (item) => {
    return (
      <>
        <Grid item xs={5}>
          <Typography>{item.kp_emname}
          </Typography>
        </Grid>
        <Grid item xs={1}>
          <Typography>{item.kp_low}
          </Typography>
        </Grid>
        <Grid item xs={1}>
          <Typography>{item.kp_medium}
          </Typography>
        </Grid>
        <Grid item xs={1}>
          <Typography>{item.kp_high}
          </Typography>
        </Grid>
        <Grid item xs={1}>
          <Typography>{item.kp_early}
          </Typography>
        </Grid>
        <Grid item xs={1}>
          <Typography>{item.kp_notearly}
          </Typography>
        </Grid>
        <Grid item xs={1}>
          <Typography>{item.kp_overdue}
          </Typography>
        </Grid>
        <Grid item xs={1}>
          <Typography>{item.kp_score}
          </Typography>
        </Grid>
      </>
    )
  }

  const getCsvString = () => {
    return csvString
  }

  const KPITable = (data) => {
    return (
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell>NAME</TableCell>
              <TableCell align="center">LOW</TableCell>
              <TableCell align="center">MEDIUM</TableCell>
              <TableCell align="center">HIGH</TableCell>
              <TableCell align="center">EARLY</TableCell>
              <TableCell align="center">ON TIME</TableCell>
              <TableCell align="center">OVERDUE</TableCell>
              <TableCell align="center"><b>SCORE</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow
                key={row.kp_emname}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.kp_emname}
                </TableCell>
                <TableCell align="center">{row.kp_low}</TableCell>
                <TableCell align="center">{row.kp_medium}</TableCell>
                <TableCell align="center">{row.kp_high}</TableCell>
                <TableCell align="center">{row.kp_early}</TableCell>
                <TableCell align="center">{row.kp_notearly}</TableCell>
                <TableCell align="center">{row.kp_overdue}</TableCell>
                <TableCell align="center"><b>{row.kp_score}</b></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  const KPICard = (item) => {
    const id = '' + item.id
    const data = item.data
    return (
      <Grid item key={item.kp_id} xs={12}>
        <Card sx={{ height: '100%' }}>
          <Stack alignItems={'center'} paddingTop={2}>
            <Typography variant='h3'>{numToMonth[id.substring(4, 6)]} {id.substring(0, 4)}
            </Typography>
          </Stack>
          <CardContent>
            {KPITable(data)}
          </CardContent>
          <Grid container justifyContent='right' padding={0}>
            <Grid item>
              <Button>
                <CSVLink filename={`kpiReport_${id}.csv`} data={getCsvString()} asyncOnClick={true}
                  onClick={() => prepareCSV(done, id, data)}>Download CSV</CSVLink>
              </Button></Grid>
          </Grid>
        </Card>
      </Grid>
    )
  }

  const prepareCSV = (done, id, data) => {
    id = '' + id
    let csv = '' + csvReportHeader
    const currentDate = '' + FormatDate(new Date().getTime())
    console.log(currentDate)
    const genDate = '' + currentDate.substring(6, 8) + '/' + currentDate.substring(4, 6) + '/' + currentDate.substring(0, 4)
    const genTime = '' + currentDate.substring(8, 10) + ':' + currentDate.substring(10, 12) + ':' + currentDate.substring(12, 14)

    csv += `DATE|${genDate}|TIME|${genTime}\n\n${numToMonth[id.substring(4, 6)]}|${id.substring(0, 4)}\n\n`

    csv += `NAME|LOW|MEDIUM|HIGH|EARLY|ON TIME|OVERDUE|SCORE\n`

    data.map((row) => {
      csv += `${row.kp_emname}|${row.kp_low}|${row.kp_medium}|${row.kp_high}|${row.kp_early}|${row.kp_notearly}|${row.kp_overdue}|${row.kp_score}\n`

    })
    setCsvString(csv)
    done(true)
  };


  if (!isLoaded) {
    return (
      <Box>
        <CircularProgress color="inherit" />
      </Box>
    )
  }
  return (
    <>
      <Helmet>
        <title>Assessment</title>
      </Helmet>
      <Container sx={{ paddingY: 10 }}>
        {renderGenerateKPIButton(date.substring(0, 6))}
        <Container>
          <Grid container spacing={2} justifyContent={'center'}>
            {kpiData.map((item) => KPICard(item))}
          </Grid>
        </Container>
      </Container>
    </>
  )
}

export default Assessment

