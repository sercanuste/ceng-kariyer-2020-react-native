# React Navigation

[React Navigation Web Sitesi](https://reactnavigation.org/)

1. Sayfaların Oluşturulması
```jsx
import React, { Component } from "react";
import {
    View,
    Text
} from 'react-native';

export default class Screen extends Component {
    constructor(props) {
        super(props);
    }

    state = {
    };

    render() {
        return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Screen</Text>
        </View>
    }
}
```

2. React Navigation'ın projeye eklenmesi
```
npm install @react-navigation/native
npm install react-native-reanimated react-native-gesture-handler react-native-screens react-native-safe-area-context @react-native-community/masked-view
npx pod-install ios
```

3. App.js'in React Navigation için güncellenmesi
```jsx
import 'react-native-gesture-handler';
import React, { Component } from 'react';
import { SafeAreaView, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

export default class App extends Component {
    render() {
        return (
            <NavigationContainer>
                <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Text>Chat App</Text>
                </SafeAreaView>
            </NavigationContainer>
        );
    }
}
```

4. Stack Navigator'ın projeye eklenmesi
```
npm install @react-navigation/stack
```

5. App.js'in Stack Navigator için güncellenmesi
```jsx
import 'react-native-gesture-handler';
import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from './src/screens/HomeScreen';
import ChatScreen from './src/screens/ChatScreen';

const Stack = createStackNavigator();

export default class App extends Component {
    render() {
        return (
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'My Chat App' }} />
                    <Stack.Screen name="Chat" component={ChatScreen} />
                </Stack.Navigator>
            </NavigationContainer>
        );
    }
}
```

6. Navigation
```jsx
<TouchableOpacity onPress={() => { this.props.navigation.navigate('Chat') }}>
    <Text>Go to Chat</Text>
</TouchableOpacity>
```