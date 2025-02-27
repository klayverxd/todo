import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";
import { useTasks } from "../context/TaskContext";
import Task from "../types/Task";

export default function TaskForm() {
	const { item } = useLocalSearchParams();
	const task: Task | undefined = item ? JSON.parse(item as string) : undefined;

	const router = useRouter();
	const { addTask, updateTask } = useTasks();
	const [name, setName] = useState(task?.name ?? "");
	const [responsible, setResponsible] = useState(task?.responsible ?? "");
	const [date, setDate] = useState(task?.date ?? "");
	const [description, setDescription] = useState(task?.description ?? "");

	const navigation = useNavigation();

	useEffect(() => {
		navigation.setOptions({
			title: task ? "Editar Atividade" : "Nova Atividade",
		});
	}, [navigation]);

	const handleDateChange = (input: string) => {
		let formatted = input.replace(/\D/g, "");

		if (formatted.length > 2)
			formatted = `${formatted.slice(0, 2)}/${formatted.slice(2)}`;
		if (formatted.length > 5)
			formatted = `${formatted.slice(0, 5)}/${formatted.slice(5, 9)}`;

		setDate(formatted);
	};

	const handleSubmit = () => {
		if (!name || !responsible || !date) {
			Alert.alert("Erro", "Todos os campos são obrigatórios.");
			return;
		}
		if (task) {
			updateTask({ ...task, name, responsible, date, description });
			return;
		}

		addTask({ name, responsible, date, description, completed: false });
	};

	return (
		<View style={styles.container}>
			<Text>Nome da Atividade:</Text>
			<TextInput style={styles.input} value={name} onChangeText={setName} />
			<Text>Responsável:</Text>
			<TextInput
				style={styles.input}
				value={responsible}
				onChangeText={setResponsible}
			/>
			<Text>Data (DD/MM/YYYY):</Text>
			<TextInput
				style={styles.input}
				value={date}
				onChangeText={handleDateChange}
				keyboardType="numeric"
				maxLength={10}
			/>
			<Text>Descrição:</Text>
			<TextInput
				style={styles.input}
				value={description}
				onChangeText={setDescription}
				multiline
			/>
			<Button
				title={task ? "Atualizar" : "Cadastrar"}
				onPress={() => {
					if (!name || !responsible || !date) {
						Alert.alert("Erro", "Todos os campos são obrigatórios.");
						return;
					}
					handleSubmit();
					router.back();
				}}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, padding: 20, backgroundColor: "#fff" },
	input: { borderWidth: 1, padding: 10, marginVertical: 5, borderRadius: 5 },
});
