import React, { Component } from "react";
import {
    View,
    SafeAreaView,
    FlatList,
    Text,
    TouchableOpacity
} from 'react-native';
import {
    Input,
    Button,
    ListItem
} from 'react-native-elements';
import auth from '@react-native-firebase/auth';

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
        }],
        loading: true
    };

    componentDidMount() {
        if (auth().currentUser != null) {
            this.setState({ isAuthenticated: true });
        }

        this.setState({ loading: false });

        this.renderLogoutButton();
    }

    renderLogoutButton() {
        this.props.navigation.setOptions({
            headerRight: () => {
                return this.state.isAuthenticated ?
                    <TouchableOpacity
                        style={{ padding: 5, marginRight: 5 }}
                        onPress={() => {
                            auth()
                                .signOut()
                                .then(() => {
                                    this.setState({ isAuthenticated: false }, () => { this.renderLogoutButton(); });
                                })
                        }}>
                        <Text>Log out</Text>
                    </TouchableOpacity>
                    :
                    null
            }
        });
    }

    renderLogin() {
        return <View style={{ flex: 1, padding: 30, alignItems: 'center', justifyContent: 'center' }}>
            <Input style={{ marginBottom: 10 }} placeholder="User Name" />
            <Button buttonStyle={{ backgroundColor: '#8BC34A' }} title="Login" disabled={this.state.loading} onPress={() => this.login()} />
        </View>
    }

    login() {
        this.setState({ loading: true });

        auth()
            .signInAnonymously()
            .then(() => {
                console.log('User signed in anonymously');
                this.setState({ loading: false, isAuthenticated: true }, () => { this.renderLogoutButton(); });
            })
            .catch(error => {
                if (error.code === 'auth/operation-not-allowed') {
                    console.log('Enable anonymous in your firebase console.');
                }

                console.error(error);
                this.setState({ loading: false });
            });
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