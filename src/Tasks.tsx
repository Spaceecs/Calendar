import React, { useState, useCallback } from "react";
import {
    FlatList,
    Text,
    View,
    TouchableOpacity,
    Modal,
    TextInput,
    Button,
    StyleSheet,
    Platform,
    StatusBar,
} from "react-native";
import { fetchTasksByUser, insertEvent } from "./db/db";
import { useFocusEffect } from '@react-navigation/native';
import { useUser } from './userContext';
import { useTheme } from "./ThemeContext";

interface Task {
    id: number;
    date: string;
    content: string;
    user_id: number;
}

interface TasksProps {
    route: { params: { selectedDate: string } };
    navigation: any;
}

export default function Tasks({ route, navigation }: TasksProps) {
    const { theme } = useTheme();
    const { user } = useUser();
    const { selectedDate } = route.params;
    const [tasks, setTasks] = useState<Task[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [taskContent, setTaskContent] = useState('');
    const styles = getStyles(theme);

    const loadTasks = async () => {
        if (!user) {
            setTasks([]);
            return;
        }
        try {
            const allUserTasks = (await fetchTasksByUser(user.id)) as Task[];
            const filtered = allUserTasks.filter(task => task.date === selectedDate);
            setTasks(filtered);
            console.log("Tasks loaded:", filtered.length);
        } catch (error) {
            console.error("Error loading tasks:", error);
            setTasks([]);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadTasks();
        }, [selectedDate, user])
    );

    const handleSave = async () => {
        if (!user) {
            alert("Користувач не авторизований");
            return;
        }
        if (!taskContent.trim()) {
            alert("Введіть текст завдання");
            return;
        }
        try {
            await insertEvent(taskContent.trim(), selectedDate, user.id);
            setModalVisible(false);
            setTaskContent('');
            await loadTasks();
        } catch (error) {
            console.error("Error saving task:", error);
            alert("Сталася помилка при збереженні завдання");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Завдання на {selectedDate}</Text>

            <FlatList
                data={tasks}
                keyExtractor={(item) => item.id.toString()}
                ListEmptyComponent={<Text style={styles.noTasks}>Немає завдань на цей день</Text>}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => navigation.navigate('Task', { task: item })}>
                        <View style={styles.taskItem}>
                            <Text style={styles.taskText}>{item.content}</Text>
                        </View>
                    </TouchableOpacity>
                )}
            />

            <TouchableOpacity
                style={styles.addButton}
                onPress={() => {
                    setTaskContent('');
                    setModalVisible(true);
                }}
            >
                <Text style={styles.addButtonText}>+ Додати завдання</Text>
            </TouchableOpacity>

            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <TextInput
                            placeholder="Введіть завдання..."
                            placeholderTextColor={theme === 'dark' ? '#888' : '#999'}
                            value={taskContent}
                            onChangeText={setTaskContent}
                            style={styles.input}
                            multiline
                            autoFocus
                        />
                        <View style={styles.buttonsRow}>
                            <Button title={"Додати"} onPress={handleSave} />
                            <Button title="Скасувати" onPress={() => setModalVisible(false)} color="gray" />
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const getStyles = (theme: 'light' | 'dark') =>
    StyleSheet.create({
        container: {
            flex: 1,
            paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 0,
            backgroundColor: theme === 'dark' ? '#121212' : '#fff',
            paddingHorizontal: 16,
            paddingBottom: 16,
        },
        header: {
            fontSize: 20,
            marginBottom: 10,
            color: theme === 'dark' ? '#fff' : '#000',
            fontWeight: 'bold',
        },
        noTasks: {
            fontStyle: 'italic',
            color: theme === 'dark' ? '#aaa' : '#555',
            textAlign: 'center',
            marginTop: 20,
        },
        taskItem: {
            padding: 12,
            marginBottom: 10,
            backgroundColor: theme === 'dark' ? '#1E1E1E' : '#f9f9f9',
            borderRadius: 8,
            shadowColor: theme === 'dark' ? '#000' : '#ccc',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.3,
            shadowRadius: 2,
            elevation: 2,
        },
        taskText: {
            color: theme === 'dark' ? '#eee' : '#222',
            fontSize: 16,
        },
        addButton: {
            backgroundColor: '#2196F3',
            padding: 12,
            borderRadius: 8,
            alignItems: 'center',
            marginTop: 20,
            shadowColor: '#2196F3',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.8,
            shadowRadius: 3,
            elevation: 3,
        },
        addButtonText: {
            color: 'white',
            fontSize: 16,
            fontWeight: 'bold',
        },
        modalContainer: {
            flex: 1,
            justifyContent: 'center',
            backgroundColor: theme === 'dark' ? 'rgba(18,18,18,0.95)' : 'rgba(255,255,255,0.95)',
        },
        modalContent: {
            backgroundColor: theme === 'dark' ? '#1E1E1E' : '#fff',
            marginHorizontal: 20,
            padding: 20,
            borderRadius: 10,
            shadowColor: theme === 'dark' ? '#000' : '#ccc',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.5,
            shadowRadius: 4,
            elevation: 5,
        },
        input: {
            borderWidth: 1,
            borderColor: theme === 'dark' ? '#555' : '#ccc',
            color: theme === 'dark' ? '#eee' : '#222',
            padding: 10,
            marginBottom: 10,
            borderRadius: 5,
            minHeight: 60,
            textAlignVertical: 'top',
            fontSize: 16,
            backgroundColor: theme === 'dark' ? '#2a2a2a' : '#fff',
        },
        buttonsRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 8,
        },
    });
