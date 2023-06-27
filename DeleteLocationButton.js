import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { doc, updateDoc, arrayRemove, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import axios from "axios";

const DeleteLocationButton = ({ location, setLocationsData, API_KEY }) => {
	const db = getFirestore();
	const auth = getAuth();

	const deleteLocation = async () => {
		const user = auth.currentUser;

		if (user) {
			console.log("Attempting to delete location from Firestore");
			try {
				await updateDoc(doc(db, "users", user.uid), {
					locations: arrayRemove(location),
				});

				console.log("Successfully deleted location from Firestore");
				// Reload locations
				const docSnap = await getDoc(doc(db, "users", user.uid));
				if (docSnap.exists()) {
					const userLocations = docSnap.data().locations || [];
					const locationData = await Promise.all(
						userLocations.map(async (location) => {
							const response = await axios.get(
								`http://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY}`
							);
							return { location, weather: response.data };
						})
					);
					setLocationsData(locationData);
				}
			} catch (error) {
				console.error("Error deleting location from Firestore:", error);
			}
		} else {
			console.log("Cannot delete location: No user logged in");
		}
	};

	return (
		<View style={styles.container}>
			<TouchableOpacity onPress={deleteLocation} style={styles.button}>
				<Text style={styles.text}>X</Text>
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		position: "absolute",
		bottom: 10,
		right: 10,
	},
	button: {
		backgroundColor: "#ff0000",
		width: 30,
		height: 30,
		borderRadius: 15,
		justifyContent: "center",
		alignItems: "center",
	},
	text: {
		color: "#ffffff",
		fontWeight: "bold",
	},
});

export default DeleteLocationButton;
