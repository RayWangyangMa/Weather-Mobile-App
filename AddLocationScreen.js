import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet, Text } from "react-native";
import { getFirestore, arrayUnion, doc, setDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const AddLocationScreen = ({ navigation }) => {
	const [location, setLocation] = useState("");
	const db = getFirestore();
	const auth = getAuth();

	const saveLocation = async () => {
		const user = auth.currentUser;

		// Capitalize the first letter of the location
		let formattedLocation =
			location.charAt(0).toUpperCase() + location.slice(1).toLowerCase();

		console.log("saveLocation called");
		console.log("Current user:", user);
		console.log("Location:", formattedLocation);

		if (user && formattedLocation) {
			console.log("Attempting to save location to Firestore");
			try {
				await setDoc(
					doc(db, "users", user.uid),
					{
						locations: arrayUnion(formattedLocation),
					},
					{ merge: true }
				);

				console.log("Successfully saved location to Firestore");
				navigation.goBack();
			} catch (error) {
				console.error("Error saving location to Firestore:", error);
			}
		} else {
			console.log(
				"Cannot save location: No user logged in or location is empty"
			);
		}
	};

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Add Location</Text>
			<TextInput
				style={styles.input}
				onChangeText={setLocation}
				value={location}
				placeholder="Enter location"
			/>
			<Button
				title="Add Location"
				onPress={saveLocation}
				color="#01579b"
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		padding: 16,
		backgroundColor: "#e1f5fe",
	},
	title: {
		fontSize: 32,
		fontWeight: "bold",
		textAlign: "center",
		marginBottom: 20,
	},
	input: {
		height: 50,
		borderColor: "#01579b",
		borderWidth: 2,
		borderRadius: 10,
		padding: 10,
		marginBottom: 20,
	},
});

export default AddLocationScreen;
