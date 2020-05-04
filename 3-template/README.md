# Template

- [React Native Elements Web Sitesi](https://react-native-elements.github.io/react-native-elements/)

1. React Native Elements'in projeye eklenmesi
```
npm i react-native-elements --save
npm i react-native-vector-icons --save
cd ios && pod install
```

2. Giriş Alanı (HomeScreen.js)
```jsx
import {
    Input,
    Button
} from 'react-native-elements';
```
```jsx
state = {
    isAuthenticated: false
};
```
```jsx
renderLogin() {
    return <View style={{ flex: 1, padding: 30, alignItems: 'center', justifyContent: 'center' }}>
        <Input style={{ marginBottom: 10 }} placeholder="User Name" />
        <Button buttonStyle={{ backgroundColor: '#8BC34A' }} title="Login" />
    </View>
}

renderUsers() {
    return <View>
        <Text>Authenticated</Text>
    </View>
}

render() {
    return this.state.isAuthenticated ?
        this.renderUsers()
        :
        this.renderLogin()
}
```

3. Kullanıcı Listesi (HomeScreen.js)
```jsx
import { SafeAreaView, FlatList } from 'react-native';
import { ListItem } from 'react-native-elements'
```
```jsx
state = {
    users: [{
        userId: 1,
        userName: 'User 1',
    },
    {
        userId: 2,
        userName: 'User 2'
    }]
};
```
```jsx
keyExtractor = (item, index) => index.toString()

renderItem = ({ item }) => (
    <ListItem
        onPress={() => { this.props.navigation.navigate('Chat') }}
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
```

4. Chat ekranına parametre gönderme (HomeScreen.js)
```jsx
renderItem = ({ item }) => (
    <ListItem
        onPress={() => { this.props.navigation.navigate('Chat', { userName: item.userName, userId: item.userId }) }}
        title={item.userName}
        bottomDivider
        chevron
    />
)
```

5. Chat ekranı başlığını parametreye göre güncelleme (ChatScreen.js)
```jsx
componentDidMount() {
    if (this.props.route.params.userName) {
        this.props.navigation.setOptions({ title: this.props.route.params.userName });
    }
}
```

6. Mesajlar (ChatScreen.js)
```jsx
import { SafeAreaView, FlatList } from 'react-native';
import { ListItem } from 'react-native-elements'
```
```jsx
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
```
```jsx
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
    </SafeAreaView>
}
```

7. Mesaj gönderme (ChatScreen.js)
```jsx
import { Platform, KeyboardAvoidingView } from 'react-native';
import { Input } from 'react-native-elements'
```
```jsx
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
```
