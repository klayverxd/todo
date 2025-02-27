import { useLocalSearchParams, useNavigation } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { useTasks } from "../context/TaskContext";
import { useEffect } from "react";

export default function TaskDetails() {
	const { id } = useLocalSearchParams();
	const { tasks } = useTasks();

	const task = tasks.find(t => t.id === id);

	const navigation = useNavigation();

	useEffect(() => {
		navigation.setOptions({
			title: "Detalhes da Atividade",
		});
	}, [navigation]);

	if (!task) return <Text>Erro ao carregar detalhes.</Text>;

	return (
		<View style={styles.container}>
			<Text>Nome: {task.name}</Text>
			<Text>Responsável: {task.responsible}</Text>
			<Text>Data: {task.date}</Text>
			<Text>Descrição: {task.description}</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, padding: 20, backgroundColor: "#fff" },
});
