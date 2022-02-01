import { Helmet } from 'react-helmet';
import React, { useState, useEffect } from 'react';
import { Box, Button, Card, CardActions, CardContent, CardHeader, CircularProgress, Container, Grid, Paper, Stack, Typography } from '@mui/material'
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

  const getKpiData = async () => {
    try {
      const { data } = await axios.get(`http://localhost:5050/api/web/kpi/data/all`)
      setKpiData(data)
      setIsLoaded(true)
    } catch (error) {
      console.error(error)
    }
  }

  const calculateScore = (id) => {
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
    return new Promise(async (resolve, reject) => {
      try {
        const res = await axios.post('http://localhost:5050/api/web/kpi/postdata', {
          kp_id: id,
          data: data
        })
        getKpiData()
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
      getKpiData()
    } catch (error) {
      console.log(error)
    }
  }

  const renderGenerateKPIButton = (currentMonth) => {
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
        <Grid item xs={10}>
          <Typography fontFamily={'Roboto'}>{item.employee}
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography fontFamily={'Roboto'}>{item.score}
          </Typography>
        </Grid>
      </>
    )
  }

  const getCsvString = () => {
    return csvString
  }

  const KPIGridItem = (item) => {
    const id = '' + item.kp_id
    const data = item.kp_data
    return (
      <Grid item key={item.kp_id} xs={12} sm={6} lg={4}>
        <Card sx={{ height: '100%' }}>
          <Stack alignItems={'center'} padding={1}>
            <Typography variant='h3'>{numToMonth[id.substring(4, 6)]} {id.substring(0, 4)}
            </Typography>
          </Stack>
          <CardContent>
            <Grid container>
              {data.map((item) => KPIRow(item))}
            </Grid>
          </CardContent>
          <Grid container justifyContent='right' padding={1}>
            <Grid item>
              <Button>
                <CSVLink filename={`kpiReport_${id}.csv`} data={getCsvString()} asyncOnClick={true}
                  onClick={() => prepareCSV(done, id, item)}>Download CSV</CSVLink>
              </Button></Grid>
          </Grid>
        </Card>
      </Grid>
    )
  }

  const prepareCSV = (done, id, item) => {
    id = '' + id
    let csv = '' + csvReportHeader
    // today.setTime(today.getTime())
    const currentDate = '' + FormatDate(new Date().getTime())
    console.log(currentDate)
    const genDate = '' + currentDate.substring(6, 8) + '/' + currentDate.substring(4, 6) + '/' + currentDate.substring(0, 4)
    const genTime = '' + currentDate.substring(8, 10) + ':' + currentDate.substring(10, 12) + ':' + currentDate.substring(12, 14)
    csv += `DATE|${genDate}|TIME|${genTime}\n\n${numToMonth[id.substring(4, 6)]}|${id.substring(0, 4)}\n\nEMPLOYEE|SCORE\n`
    item.kp_data.map((row) => {
      csv += `${row.employee}|${row.score}\n`
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
            {kpiData.map((item) => KPIGridItem(item))}
          </Grid>
        </Container>
      </Container>
    </>
  )
}

export default Assessment

