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
} from 'react-native-elements';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export default class ChatScreen extends Component {
    constructor(props) {
        super(props);
    }

    state = {
        messages: [],
        loading: true,
        chatId: '',
        userId: '',
        chatUserId: '',
        message: ''
    };

    componentDidMount() {
        if (this.props.route.params.userName) {
            this.props.navigation.setOptions({ title: this.props.route.params.userName });
        }

        var chatUserId = '';
        if (this.props.route.params.userId) {
            chatUserId = this.props.route.params.userId;
        }

        this.setState({ userId: auth().currentUser.uid, chatUserId: chatUserId }, () => { this.connectToChat(); });
    }

    connectToChat = async () => {
        var chatUsers = [this.state.userId, this.state.chatUserId];
        chatUsers.sort();

        var chat = (await firestore().collection('Chats').where('users', '==', chatUsers).get()).docs[0];
        if (!chat) {
            const chatData = {
                users: chatUsers
            }

            var chatRef = firestore().collection('Chats').doc();
            await chatRef.set(chatData);

            chat = await chatRef.get();
        }

        this.setState({ chatId: chat.ref.id });
        firestore().collection('Chats').doc(chat.ref.id).collection('Messages').orderBy('date', 'desc').onSnapshot((messages) => { this.setState({ messages: messages.docs }) });
    }

    sendMessage = async () => {
        if (this.state.message.trim() == '') { return; }

        var message = this.state.message;
        this.setState({ message: '' });

        const messageData = {
            message: message,
            userId: this.state.userId,
            date: new Date()
        }

        firestore().collection('Chats').doc(this.state.chatId).collection('Messages').add(messageData);
    }

    keyExtractor = (item, index) => index.toString()

    renderItem = ({ item }) => (
        <ListItem
            title={item.data().userId == this.state.chatUserId ? item.data().message : null}
            rightTitle={item.data().userId == this.state.userId ? item.data().message : null}
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
                    value={this.state.message}
                    onChangeText={(text) => this.setState({ message: text })}
                    onSubmitEditing={() => { this.sendMessage() }}
                />
            </KeyboardAvoidingView>
        </SafeAreaView>
    }
}