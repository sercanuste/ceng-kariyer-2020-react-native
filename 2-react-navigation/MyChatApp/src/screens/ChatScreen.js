import React, { Component } from "react";
import {
    View,
    Text
} from 'react-native';

export default class ChatScreen extends Component {
    constructor(props) {
        super(props);
    }

    state = {
    };

    render() {
        return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Chat Screen</Text>
        </View>
    }
}