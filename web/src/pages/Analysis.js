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


const Analysis = () => {
  const [date, setDate] = useState('')
  const [summaryData, setSummaryData] = useState([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [csvString, setCsvString] = useState('');

  var csvReportHeader = `NETSINITY SDN BHD\n\nMONTHLY SUMMARY REPORT\n\n`

  useEffect(() => {
    init()
    setDate(FormatDate(new Date().getTime()).substring(0, 6))
    return () => {
      console.log('Analysis Page unmounted')
    }
  }, [])

  const init = async () => {
    const unsortedData = await getSummaryData()
    if (unsortedData.length > 0) {
      const sortedData = await sortSummaryData(unsortedData)
      setSummaryData(sortedData)
    }
    setIsLoaded(true)
  }

  const getSummaryData = () => {
    return new Promise(async (resolve, reject) => {
      try {
        const { data } = await axios.get(`http://localhost:5050/api/web/summary/data/all`)
        resolve(data)
      } catch (error) {
        console.error('Analysis.getSummaryData(): ERROR')
        reject(error)
      }
    })
  }

  const sortSummaryData = (data) => {
    return new Promise(async (resolve, reject) => {
      var arr3d = []
      var arr2d = []
      var curr_id = ''
      var pending = 0
      var inprogress = 0
      var resolved = 0

      for (let i = 0; i < data.length; i++) {
        const element = data[i]
        var temp_id = ('' + element.tc_createdat).substring(0, 6)
        if (i == 0) {
          curr_id = temp_id
        }
        if (temp_id != curr_id) {
          var temp_json = { "id": curr_id, "data": arr2d, "pending": pending, "inprogress": inprogress, "resolved": resolved }
          arr3d.push(temp_json)
          arr2d = []
          curr_id = temp_id
          pending = 0
          inprogress = 0
          resolved = 0
        }
        if (element.tc_status == 'RESOLVED') {
          resolved++
        } else if (element.tc_status == 'IN PROGRESS') {
          inprogress++
        } else {
          pending++
        }
        arr2d.push(element)
      }
      var temp_json = { "id": curr_id, "data": arr2d, "pending": pending, "inprogress": inprogress, "resolved": resolved }
      arr3d.push(temp_json)
      resolve(arr3d)
    })
  }

  const renderSummaryRows = (item) => {
    const id = '' + item.id
    const same = date == id
    return (
      <Card key={item.id} elevation={5} sx={{ marginBottom: 4, backgroundColor: same ? 'white' : '#efefef' }}>
        <CardContent>
          <Stack sx={{ alignItems: "center", margin: 2 }}>
            <Typography variant='h3'>{numToMonth[id.substring(4, 6)]} {id.substring(0, 4)}
            </Typography>
          </Stack>
          <Grid container>
            <Grid item xs={4}>
              <Stack sx={{ alignItems: "center", color: same ? 'red' : 'black' }}>
                <Typography variant='h5'>PENDING</Typography>
                <Typography variant='h5'>{item.pending}</Typography>
              </Stack>
            </Grid>
            <Grid item xs={4}>
              <Stack sx={{ alignItems: "center", color: same ? '#f4b210' : 'black' }}>
                <Typography variant='h5'>IN PROGRESS</Typography>
                <Typography variant='h5'>{item.inprogress}</Typography>
              </Stack>
            </Grid>
            <Grid item xs={4}>
              <Stack sx={{ alignItems: "center", color: same ? 'green' : 'black' }}>
                <Typography variant='h5'>RESOLVED</Typography>
                <Typography variant='h5'>{item.resolved}</Typography>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
        <Grid container justifyContent='right' padding={1}>
          <Grid item>
            <Button><CSVLink filename={`summaryReport_${id}.csv`} data={getCsvString()} asyncOnClick={true}
              onClick={() => prepareCSV(done, item)}>Download CSV</CSVLink></Button>
          </Grid>
        </Grid>
      </Card>
    )
  }

  const getCsvString = () => {
    return csvString
  };

  const prepareCSV = (done, item) => {
    const id = '' + item.id
    const { data } = item
    let csv = '' + csvReportHeader
    const currentDate = '' + FormatDate(new Date().getTime())
    const genDate = '' + currentDate.substring(6, 8) + '/' + currentDate.substring(4, 6) + '/' + currentDate.substring(0, 4)
    const genTime = '' + currentDate.substring(8, 10) + ':' + currentDate.substring(10, 12) + ':' + currentDate.substring(12, 14)
    csv += `DATE|${genDate}|TIME|${genTime}\n\n${numToMonth[id.substring(4, 6)]}|${id.substring(0, 4)}\n\nID|COMPANY CODE|TITLE|DETAIL|CREATED AT|STATUS|FILE PATH|ASSIGNED TO|DUE DATE|PRIORITY|COMPLETED DATE\n`

    data.map((row) => {
      csv += `${row.tc_id}|${row.tc_cmcode}|${row.tc_title}|${row.tc_detail}|${row.tc_createdat}|${row.tc_status}|${row.tc_filepath}|${row.tc_assignedto}|${row.tc_duedate}|${row.tc_priority}|${row.tc_completeddate}\n`
    })
    setCsvString(csv)
    done(true)
  }

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
        <title>Analysis</title>
      </Helmet>
      <Container sx={{ paddingY: 10 }}>
        {summaryData.map((item) => renderSummaryRows(item))}
      </Container>
    </>
  )
}

export default Analysis