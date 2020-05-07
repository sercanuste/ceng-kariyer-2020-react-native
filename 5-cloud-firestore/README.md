# Cloud Firestore

- [Firebase Web Sitesi](https://firebase.google.com/)
- [React Native Firebase Web Sitesi](https://rnfirebase.io/)

1. Cloud Firestore modülünün eklenmesi
```
npm install --save @react-native-firebase/firestore
cd ios && pod install
```

2. Kayıt anında kullanıcı adının eklenmesi (HomeScreen.js)
```jsx
import firestore from '@react-native-firebase/firestore';
```
```jsx
state = {
    ...
    userName: ''
};
```
```jsx
renderLogin() {
    return <View style={{ flex: 1, padding: 30, alignItems: 'center', justifyContent: 'center' }}>
        <Input style={{ marginBottom: 10 }} placeholder="User Name" disabled={this.state.loading} onChangeText={(text) => this.setState({ userName: text })} /> // Update this line
        <Button buttonStyle={{ backgroundColor: '#8BC34A' }} title="Login" disabled={this.state.loading} onPress={() => this.login()} />
    </View>
}
```
```jsx
login() {
    if (this.state.userName.trim() == '') { return; }

    ...
    
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
            ...
        });
}
```

3. Kullanıcıların listelenmesi (HomeScreen.js)
```jsx
state = {
    users: []
};
```
```jsx
componentDidMount() {
    if (auth().currentUser != null) {
        this.setState({ isAuthenticated: true, userId: auth().currentUser.uid }); // Update this line
    }

    ...

    this.getUsers();
}
```
```jsx
login() {
    ...

    auth()
        .signInAnonymously()
        .then(async (credentials) => {
            ...
            this.setState({ loading: false, isAuthenticated: true, userId: credentials.user.uid }, () => { // Update this line
            ...
}
```
```jsx
getUsers() {
    firestore().collection('Users').onSnapshot((users) => {
        this.setState({ users: users.docs.filter((user) => { return user.data().userId != this.state.userId }) });
    })
}
```
```jsx
renderItem = ({ item }) => (
    <ListItem
        onPress={() => { this.props.navigation.navigate('Chat', { userName: item.data().userName, userId: item.data().userId }) }} // Update this line
        title={item.data().userName} // Update this line
        bottomDivider
        chevron
    />
)
```

4. Mesajlaşma (ChatScreen.js)
```jsx
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
```
```jsx
state = {
    messages: [],
    loading: true,
    chatId: '',
    userId: '',
    chatUserId: '',
    message: ''
};
```
```jsx
componentDidMount() {
    ...

    var chatUserId = '';
    if (this.props.route.params.userId) {
        chatUserId = this.props.route.params.userId;
    }

    this.setState({ userId: auth().currentUser.uid, chatUserId: chatUserId }, () => { this.connectToChat(); });
}
```
```jsx
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
```
```jsx
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

```
```jsx
render() {
    ...
    <Input
        inputContainerStyle={{ marginTop: 10, paddingHorizontal: 10, paddingVertical: 3, borderWidth: 1, borderColor: '#212121', borderRadius: 5, backgroundColor: '#ffffff' }}
        containerStyle={{ padding: 0, margin: 0 }}
        inputStyle={{ padding: 0, margin: 0 }}
        placeholder="Message"
        returnKeyType="send"
        blurOnSubmit={false}
        value={this.state.message} // Add this line
        onChangeText={(text) => this.setState({ message: text })} // Add this line
        onSubmitEditing={() => { this.sendMessage() }} // Add this line
    />
    ...
}
```
```jsx
renderItem = ({ item }) => (
    <ListItem
        title={item.data().userId == this.state.chatUserId ? item.data().message : null} // Update this line
        rightTitle={item.data().userId == this.state.userId ? item.data().message : null} // Update this line
        bottomDivider
    />
)
```