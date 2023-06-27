import React, { useState } from "react";
import {
	StyleSheet,
	View,
	TextInput,
	Button,
	Text,
	TouchableOpacity,
} from "react-native";

import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const LoginScreen = ({ navigation }) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [errorMessage, setErrorMessage] = useState("");

	const auth = getAuth();

	const validateUser = async () => {
		try {
			const userCredential = await signInWithEmailAndPassword(
				auth,
				email,
				password
			);
			// Signed in
			const user = userCredential.user;
			console.log("Successful login");
			navigation.navigate("Weather");
		} catch (error) {
			const errorCode = error.code;
			const errorMessage = error.message;
			console.error("Error during sign in:", errorMessage);
			setErrorMessage(errorMessage);
		}
	};

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Weather App</Text>
			<Text style={styles.error}>{errorMessage}</Text>
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
			<Button title="Sign In" onPress={validateUser} />
			<TouchableOpacity onPress={() => navigation.navigate("Register")}>
				<Text style={styles.registerText}>
					Don't have an account? Register
				</Text>
			</TouchableOpacity>
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
	error: {
		color: "red",
		marginBottom: 20,
		textAlign: "center",
	},
	registerText: {
		color: "#01579b",
		marginTop: 20,
		textAlign: "center",
	},
});

export default LoginScreen;
