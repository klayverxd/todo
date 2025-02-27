import React, { createContext, useContext, useMemo, useState } from "react";
import { Alert } from "react-native";
import Task from "../types/Task";

interface TaskContextType {
	tasks: Task[];
	addTask: (task: Omit<Task, "id">) => void;
	updateTask: (task: Task) => void;
	deleteTask: (id: string) => void;
	toggleTaskCompletion: (id: string) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider = ({ children }: { children: React.ReactNode }) => {
	const [tasks, setTasks] = useState<Task[]>([]);

	const addTask = (task: Omit<Task, "id">) => {
		if (!task.name || !task.responsible || !task.date) {
			Alert.alert("Erro", "Todos os campos são obrigatórios.");
			return;
		}
		setTasks([...tasks, { ...task, id: Date.now().toString() }]);
	};

	const deleteTask = (id: string) => {
		setTasks(tasks.filter(task => task.id !== id));
	};

	const updateTask = (updatedTask: Task) => {
		setTasks(
			tasks.map(task => (task.id === updatedTask.id ? updatedTask : task))
		);
	};

	const toggleTaskCompletion = (id: string) => {
		setTasks(
			tasks.map(task =>
				task.id === id ? { ...task, completed: !task.completed } : task
			)
		);
	};

	const value = useMemo(
		() => ({ tasks, addTask, deleteTask, updateTask, toggleTaskCompletion }),
		[tasks]
	);

	return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

export const useTasks = () => {
	const context = useContext(TaskContext);

	if (!context)
		throw new Error("useTasks deve ser usado dentro de TaskProvider");

	return context;
};
