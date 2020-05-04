# Firebase Authentication

- [Firebase Web Sitesi](https://firebase.google.com/)
- [React Native Firebase Web Sitesi](https://rnfirebase.io/)

1. React Native Firebase'in projeye eklenmesi
```
npm install --save @react-native-firebase/app
```
Diğer konfigürasyonlar için [bakınız.](https://rnfirebase.io/)

2. Authentication modülünün eklenmesi
```
npm install --save @react-native-firebase/auth
cd ios && pod install
```

3. Authentication implementasyonu (HomeScreen.js)
```jsx
import auth from '@react-native-firebase/auth';
```
```jsx
    state = {
        loading: false
    };
```
```jsx
renderLogin() {
    return <View style={{ flex: 1, padding: 30, alignItems: 'center', justifyContent: 'center' }}>
        <Input style={{ marginBottom: 10 }} placeholder="User Name" />
        <Button buttonStyle={{ backgroundColor: '#8BC34A' }} title="Login" disabled={this.state.loading} onPress={() => this.login()} />
    </View>
}

login(){
    this.setState({ loading: true });

    auth()
        .signInAnonymously()
        .then(() => {
            console.log('User signed in anonymously');
            this.setState({ loading: false, isAuthenticated: true });
        })
        .catch(error => {
            if (error.code === 'auth/operation-not-allowed') {
                console.log('Enable anonymous in your firebase console.');
            }

            console.error(error);
            this.setState({ loading: false });
        });
}
```

4. Kullanıcı giriş yapmış ise kullanıcı listesine yönlendirme (HomeScreen.js)
```jsx
state = {
    loading: true
};
```
```jsx
componentDidMount() {
    if (auth().currentUser != null) {
        this.setState({ isAuthenticated: true });
    }

    this.setState({ loading: false });
}
```

5. Çıkış yapma (App.js)
```jsx
import { Text, TouchableOpacity } from 'react-native';
```
```jsx
componentDidMount() {
    ...
    this.renderLogoutButton(); // Add this line
}
```
```jsx
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
```
```jsx
login() {
    ...
    auth()
        .signInAnonymously()
        .then(() => {
            console.log('User signed in anonymously');
            this.setState({ loading: false, isAuthenticated: true }, () => { this.renderLogoutButton(); }); // Update this line
        })
        .catch(error => {
            ... 
        });
}
```