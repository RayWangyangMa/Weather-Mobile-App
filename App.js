import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import WeatherScreen from "./WeatherScreen";
import AddLocationScreen from "./AddLocationScreen";
import { initializeApp, getApps } from "firebase/app";
import LoginScreen from "./LoginScreen";
import RegisterScreen from "./RegisterScreen";

const firebaseConfig = {
	apiKey: "AIzaSyA24OzATS_vZudQBmlidE1zbFpWVVSi6Cw",
	authDomain: "weather-app-5cebe.firebaseapp.com",
	projectId: "weather-app-5cebe",
	storageBucket: "weather-app-5cebe.appspot.com",
	messagingSenderId: "854521298917",
	appId: "1:854521298917:android:5cd41a0294bbaeef74790c",
};

if (!getApps().length) {
	initializeApp(firebaseConfig);
}

const Stack = createStackNavigator();

const App = () => {
	return (
		<NavigationContainer>
			<Stack.Navigator initialRouteName="Login">
				<Stack.Screen
					name="Login"
					component={LoginScreen}
					options={{ title: "Login" }}
				/>
				<Stack.Screen
					name="Register"
					component={RegisterScreen}
					options={{ title: "Register" }}
				/>
				<Stack.Screen
					name="Weather"
					component={WeatherScreen}
					options={{ title: "Weather App" }}
				/>
				<Stack.Screen
					name="AddLocation"
					component={AddLocationScreen}
					options={{ title: "Add Location" }}
				/>
			</Stack.Navigator>
		</NavigationContainer>
	);
};
export default App;
