import React, { Component } from "react";
import {
    View,
    Text,
    TouchableOpacity
} from 'react-native';

export default class HomeScreen extends Component {
    constructor(props) {
        super(props);
    }

    state = {
    };

    render() {
        return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Home Screen</Text>
            <TouchableOpacity onPress={() => { this.props.navigation.navigate('Chat') }}>
                <Text>Go to Chat</Text>
            </TouchableOpacity>
        </View>
    }
}