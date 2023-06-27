import React, { useState, useEffect, useLayoutEffect } from "react";
import { View, Text, Image, StyleSheet, Button, FlatList } from "react-native";
import axios from "axios";
import {
	getFirestore,
	arrayUnion,
	doc,
	setDoc,
	getDoc,
	onSnapshot,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import DeleteLocationButton from "./DeleteLocationButton";

const WeatherScreen = ({ navigation }) => {
	const [locationsData, setLocationsData] = useState([]);
	const API_KEY = "5d7d7fedd990a2f8555026c7cb46e5f0";
	const db = getFirestore();
	const auth = getAuth();

	useLayoutEffect(() => {
		navigation.setOptions({
			headerRight: () => (
				<Button
					onPress={() => navigation.navigate("AddLocation")}
					title="+"
					color="#01579b"
				/>
			),
		});
	}, [navigation]);

	useEffect(() => {
		const user = auth.currentUser;
		if (user) {
			const unsubscribe = onSnapshot(
				doc(db, "users", user.uid),
				async (snapshot) => {
					const userLocations = snapshot.data().locations || [];
					await fetchWeatherData(userLocations);
				},
				(error) => {
					console.error(
						"Error listening for document updates:",
						error
					);
				}
			);
			return unsubscribe;
		}
	}, [auth, db]);

	const fetchWeatherData = async (locations) => {
		const locationData = await Promise.all(
			locations.map(async (location) => {
				const response = await axios.get(
					`http://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY}`
				);
				return { location, weather: response.data };
			})
		);
		setLocationsData(locationData);
	};

	const kelvinToCelsius = (kelvin) => {
		return (kelvin - 273.15).toFixed(2);
	};

	return (
		<View style={styles.container}>
			<FlatList
				data={locationsData}
				keyExtractor={(item) => item.location}
				renderItem={({ item }) => (
					<View style={styles.card}>
						<Text style={styles.header}>
							Weather in {item.location}
						</Text>
						<Image
							style={styles.icon}
							source={{
								uri: `http://openweathermap.org/img/w/${item.weather.weather[0].icon}.png`,
							}}
						/>
						<Text style={styles.details}>
							{`Temperature: ${kelvinToCelsius(
								item.weather.main.temp
							)}°C`}
							{`\nFeels Like: ${kelvinToCelsius(
								item.weather.main.feels_like
							)}°C`}
							{`\nWeather: ${item.weather.weather[0].main}`}
							{`\nDescription: ${item.weather.weather[0].description}`}
							{`\nHumidity: ${item.weather.main.humidity}%`}
							{`\nPressure: ${item.weather.main.pressure} hPa`}
							{`\nVisibility: ${
								item.weather.visibility / 1000
							} km`}
							{`\nWind Speed: ${item.weather.wind.speed} m/s`}
							{`\nWind Direction: ${item.weather.wind.deg}°`}
						</Text>
						<DeleteLocationButton
							location={item.location}
							setLocationsData={setLocationsData}
							API_KEY={API_KEY}
							style={styles.deleteButton}
						/>
					</View>
				)}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#e1f5fe",
		padding: 16,
	},
	card: {
		backgroundColor: "#fff",
		borderRadius: 10,
		padding: 20,
		marginBottom: 20,
		borderColor: "#01579b",
		borderWidth: 2,
	},
	header: {
		fontSize: 32,
		fontWeight: "bold",
		textAlign: "center",
		marginBottom: 20,
		color: "#01579b",
	},
	details: {
		marginTop: 20,
		fontSize: 16,
		lineHeight: 22,
		color: "#333",
	},
	icon: {
		width: 100,
		height: 100,
		alignSelf: "center",
		marginBottom: 20,
	},
});

export default WeatherScreen;
