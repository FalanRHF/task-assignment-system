import React, { Component } from 'react'
import { StyleSheet, Button, View, SafeAreaView, Text, Alert } from 'react-native';

const Separator = () => (
  <View style={styles.separator} />
);

export class Home extends Component {
  componentDidMount() {
    console.log("meow")
  }
  render() {
    return (
      <View style={{ flex: 1, marginHorizontal: 16 }}>
        <View style={{ alignItems: 'center', paddingVertical: 30 }}>
          <Button title="Add New Ticket" onPress={() => this.props.navigation.navigate('NewTicket')} />
        </View>
        <Separator />
        <View>
          <Text>zaf single</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 16,
  },
  title: {
    textAlign: 'center',
    marginVertical: 8,
  },
  fixToText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  separator: {
    marginVertical: 4,
    borderBottomColor: '#737373',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});

export default Home


