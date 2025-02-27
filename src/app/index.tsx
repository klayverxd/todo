import React, { useEffect, useState } from "react";
import {
	View,
	Text,
	Button,
	FlatList,
	TouchableOpacity,
	StyleSheet,
	TextInput,
} from "react-native";
import { useNavigation, useRouter } from "expo-router";
import { useTasks } from "../context/TaskContext";
import Checkbox from "expo-checkbox";
import { Ionicons } from "@expo/vector-icons";

export default function HomeScreen() {
	const router = useRouter();
	const { tasks, toggleTaskCompletion, deleteTask } = useTasks();
	const [searchQuery, setSearchQuery] = useState("");

	const navigation = useNavigation();

	const filteredTasks = tasks.filter(
		task =>
			task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			task.responsible.toLowerCase().includes(searchQuery.toLowerCase())
	);

	useEffect(() => {
		navigation.setOptions({
			title: "✅ Atividades",
		});
	}, [navigation]);

	return (
		<View style={styles.container}>
			<TextInput
				style={styles.input}
				placeholder="Buscar por título ou responsável"
				value={searchQuery}
				onChangeText={setSearchQuery}
			/>
			<Button
				title="Nova Atividade"
				onPress={() =>
					router.push({
						pathname: "/form",
					})
				}
			/>
			<FlatList
				data={filteredTasks}
				keyExtractor={item => item.id}
				renderItem={({ item }) => (
					<TouchableOpacity
						onPress={() =>
							router.push({ pathname: "/details", params: { id: item.id } })
						}
					>
						<View
							style={[styles.taskItem, item.completed && styles.completedTask]}
						>
							<Checkbox
								value={item.completed}
								onValueChange={() => toggleTaskCompletion(item.id)}
							/>
							<View style={{ flex: 1, marginLeft: 10 }}>
								<Text>Título: {item.name}</Text>
								<Text>Responsável: {item.responsible}</Text>
							</View>
							<View style={styles.iconContainer}>
								<TouchableOpacity
									onPress={() =>
										router.push({
											pathname: "/form",
											params: { item: JSON.stringify(item) },
										})
									}
								>
									<Ionicons name="create-outline" size={24} color="blue" />
								</TouchableOpacity>
								<TouchableOpacity onPress={() => deleteTask(item.id)}>
									<Ionicons name="trash-outline" size={24} color="red" />
								</TouchableOpacity>
							</View>
						</View>
					</TouchableOpacity>
				)}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, padding: 20, backgroundColor: "#fff" },
	input: { borderWidth: 1, padding: 10, marginVertical: 5, borderRadius: 5 },
	taskItem: {
		padding: 15,
		backgroundColor: "#f0f0f0",
		marginVertical: 5,
		borderRadius: 5,
		flexDirection: "row",
		alignItems: "center",
	},
	completedTask: {
		backgroundColor: "#d4edda",
	},
	iconContainer: { flexDirection: "row", gap: 10 },
});
