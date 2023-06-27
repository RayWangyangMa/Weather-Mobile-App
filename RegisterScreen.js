import React, { useState } from "react";
import { StyleSheet, View, TextInput, Button, Text, Alert } from "react-native";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const RegisterScreen = ({ navigation }) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	const auth = getAuth();

	const registerUser = async () => {
		if (password !== confirmPassword) {
			Alert.alert("Error", "Passwords do not match");
			return;
		}

		try {
			const userCredential = await createUserWithEmailAndPassword(
				auth,
				email,
				password
			);
			// Signed in
			const user = userCredential.user;
			console.log("Successful registration");
			navigation.navigate("Weather");
		} catch (error) {
			const errorCode = error.code;
			const errorMessage = error.message;
			console.error("Error during registration:", errorMessage);
			Alert.alert("Registration Error", errorMessage);
		}
	};

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Register</Text>
			<TextInput
				style={styles.input}
				onChangeText={setEmail}
				value={email}
				placeholder="Email"
			/>
			<TextInput
				style={styles.input}
				onChangeText={setPassword}
				value={password}
				placeholder="Password"
				secureTextEntry={true}
			/>
			<TextInput
				style={styles.input}
				onChangeText={setConfirmPassword}
				value={confirmPassword}
				placeholder="Confirm Password"
				secureTextEntry={true}
			/>
			<Button title="Register" onPress={registerUser} />
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

export default RegisterScreen;
