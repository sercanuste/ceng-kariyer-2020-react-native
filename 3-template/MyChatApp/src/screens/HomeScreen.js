import React, { Component } from "react";
import {
    View,
    SafeAreaView,
    FlatList
} from 'react-native';
import {
    Input,
    Button,
    ListItem
} from 'react-native-elements';

export default class HomeScreen extends Component {
    constructor(props) {
        super(props);
    }

    state = {
        isAuthenticated: false,
        users: [{
            userId: 1,
            userName: 'User 1',
        },
        {
            userId: 2,
            userName: 'User 2'
        }]
    };

    renderLogin() {
        return <View style={{ flex: 1, padding: 30, alignItems: 'center', justifyContent: 'center' }}>
            <Input style={{ marginBottom: 10 }} placeholder="User Name" />
            <Button buttonStyle={{ backgroundColor: '#8BC34A' }} title="Login" />
        </View>
    }

    keyExtractor = (item, index) => index.toString()

    renderItem = ({ item }) => (
        <ListItem
            onPress={() => { this.props.navigation.navigate('Chat', { userName: item.userName, userId: item.userId }) }}
            title={item.userName}
            bottomDivider
            chevron
        />
    )

    renderUsers() {
        return <SafeAreaView style={{ flex: 1 }}>
            <FlatList
                style={{ flex: 1 }}
                keyExtractor={this.keyExtractor}
                data={this.state.users}
                renderItem={this.renderItem}
            />
        </SafeAreaView>
    }

    render() {
        return this.state.isAuthenticated ?
            this.renderUsers()
            :
            this.renderLogin()
    }
}