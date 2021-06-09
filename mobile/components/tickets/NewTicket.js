import React, { Component, useState } from 'react';
import { View, Button, TextInput, Text } from 'react-native';
import { DropdownMenu } from 'react-native-dropdown-menu';

import auth from '@react-native-firebase/auth';
import axios from 'axios';

export class NewTicket extends Component {
  constructor(props) {
    super(props);

    this.state = {
      todaytime: 'initial',
      projectname: 'NST-WFI',
      title: '',
      detail: '',
      previd: 0,
    }
    this.onSubmit = this.onSubmit.bind(this);
  }

  async onSubmit() {

    let today = new Date();
    today.setTime(today.getTime() + 8 * 60 * 60 * 1000)
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1;
    let dd = today.getDate();
    let hh = today.getHours();
    let min = today.getMinutes();
    let ss = today.getSeconds();

    if (dd < 10) {
      dd = `0${dd}`;
    }
    if (mm < 10) {
      mm = `0${mm}`;
    }
    if (hh < 10) {
      hh = `0${hh}`;
    }
    if (min < 10) {
      min = `0${min}`;
    }
    if (ss < 10) {
      ss = `0${ss}`;
    }
    const todayString = `${yyyy}${mm}${dd}${hh}${min}${ss}`;
    let idnum = '0'
    await axios.get(`http://192.168.68.109:5050/ticket/getnextid/${this.state.projectname}-${yyyy}${mm}${dd}`)
      .then((response) => {
        if (response.data != '') {
          // this.setState({
          //   previd: response.data.tc_id.substring(17, 20)
          // })
          idnum = response.data.tc_id.substring(17, 19)
          //console.log(`idnum: ${idnum}`)
        }
      })
      .catch((error) => {
        // handle error
        console.log(error);
      })
    idnum++
    if (idnum < 10) {
      idnum = `0${idnum}`;
    }

    const id = `${this.state.projectname}-${yyyy}${mm}${dd}-${idnum}`
    await axios
      .post('http://192.168.68.109:5050/ticket/new', {
        id: id,
        projectname: this.state.projectname,
        title: this.state.title,
        detail: this.state.detail,
        createdAt: todayString,
      })
      .then((response) => {
        console.log(`NewTicket.onSubmit(): ticket ${id} passed to API`);
      })
      .catch((error) => {
        console.log(error.response.data);
      });
    this.props.navigation.popToTop()
  }
  componentDidMount() {

  }

  render() {
    return (
      <View>
        <TextInput
          placeholder="title"
          onChangeText={(title) => this.setState({ title })}
        />
        <TextInput
          placeholder="detail"
          onChangeText={(detail) => this.setState({ detail })}
        />

        <Button
          onPress={() => this.onSubmit()}
          title="Submit"
        />
      </View>
    )
  }
}

export default NewTicket
