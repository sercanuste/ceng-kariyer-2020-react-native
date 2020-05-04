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
import firestore from '@react-native-firebase/firestore';

export default class HomeScreen extends Component {
    constructor(props) {
        super(props);
    }

    state = {
        isAuthenticated: false,
        users: [],
        loading: true,
        userName: '',
        userId: ''
    };

    componentDidMount() {
        if (auth().currentUser != null) {
            this.setState({ isAuthenticated: true, userId: auth().currentUser.uid });
        }

        this.setState({ loading: false });

        this.renderLogoutButton();

        this.getUsers();
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
            <Input style={{ marginBottom: 10 }} placeholder="User Name" disabled={this.state.loading} onChangeText={(text) => this.setState({ userName: text })} />
            <Button buttonStyle={{ backgroundColor: '#8BC34A' }} title="Login" disabled={this.state.loading} onPress={() => this.login()} />
        </View>
    }

    login() {
        if (this.state.userName.trim() == '') { return; }

        this.setState({ loading: true });

        auth()
            .signInAnonymously()
            .then(async (credentials) => {
                console.log('User signed in anonymously');

                const user = {
                    userId: credentials.user.uid,
                    userName: this.state.userName
                }

                const userDocument = firestore().collection('Users').doc(credentials.user.uid);
                await userDocument.set(user);

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

    getUsers() {
        firestore().collection('Users').onSnapshot((users) => {
            this.setState({ users: users.docs.filter((user) => { return user.data().userId != this.state.userId }) });
        })
    }

    keyExtractor = (item, index) => index.toString()

    renderItem = ({ item }) => (
        <ListItem
            onPress={() => { this.props.navigation.navigate('Chat', { userName: item.data().userName, userId: item.data().userId }) }}
            title={item.data().userName}
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