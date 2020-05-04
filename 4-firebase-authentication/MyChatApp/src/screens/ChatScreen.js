import React, { Component } from "react";
import {
    SafeAreaView,
    FlatList,
    Platform,
    KeyboardAvoidingView
} from 'react-native';
import {
    ListItem,
    Input
} from 'react-native-elements'

export default class ChatScreen extends Component {
    constructor(props) {
        super(props);
    }

    state = {
        messages: [{
            userName: 'User 1',
            message: 'Lorem ipsum dolor sit amet.',
            date: new Date()
        },
        {
            userName: 'User 2',
            message: 'Etiam suscipit, sem in tempor blandit.',
            date: new Date()
        }]
    };

    componentDidMount() {
        if (this.props.route.params.userName) {
            this.props.navigation.setOptions({ title: this.props.route.params.userName });
        }
    }

    keyExtractor = (item, index) => index.toString()

    renderItem = ({ item }) => (
        <ListItem
            title={item.message}
            bottomDivider
        />
    )

    render() {
        return <SafeAreaView style={{ flex: 1 }}>
            <FlatList
                style={{ flex: 1 }}
                keyExtractor={this.keyExtractor}
                data={this.state.messages}
                renderItem={this.renderItem}
                inverted={true}
            />
            <KeyboardAvoidingView behavior={(Platform.OS === 'ios') ? "padding" : null} keyboardVerticalOffset={(Platform.OS === 'ios') ? 75 : 0}>
                <Input
                    inputContainerStyle={{ marginTop: 10, paddingHorizontal: 10, paddingVertical: 3, borderWidth: 1, borderColor: '#212121', borderRadius: 5, backgroundColor: '#ffffff' }}
                    containerStyle={{ padding: 0, margin: 0 }}
                    inputStyle={{ padding: 0, margin: 0 }}
                    placeholder="Message"
                    returnKeyType="send"
                    blurOnSubmit={false}
                />
            </KeyboardAvoidingView>
        </SafeAreaView>
    }
}