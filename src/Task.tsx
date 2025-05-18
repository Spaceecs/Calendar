import { useState } from "react";
import { deleteTask, updateTask } from "./db/db";
import { Alert, View, Text, TextInput, Button, StyleSheet, Platform, StatusBar } from "react-native";
import { useTheme } from "./ThemeContext";

interface Task {
    id: number;
    date: string;
    content: string;
}

export default function Task({ route, navigation }: any) {
    const { task } = route.params;
    const [content, setContent] = useState(task.content);
    const { theme } = useTheme();
    const styles = getStyles(theme);

    const handlerUpdate = async () => {
        console.log("Update clicked", content);
        const result = await updateTask(task.id, content, task.date);
        console.log('Update result:', result);
        navigation.goBack(); // повертаємось назад, Tasks оновить список через useFocusEffect
    };

    const handlerDelete = () => {
        Alert.alert('Підтвердження', 'Ви точно хочете видалити це завдання?', [
            { text: 'Скасувати', style: 'cancel' },
            {
                text: 'Видалити',
                style: 'destructive',
                onPress: async () => {
                    try {
                        const result = await deleteTask(task.id);
                        console.log('Delete result:', result);
                        navigation.goBack(); // повертаємось назад
                    } catch (error) {
                        Alert.alert('Помилка', 'Не вдалося видалити завдання');
                        console.error(error);
                    }
                },
            },
        ]);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Оновити завдання:</Text>
            <TextInput
                placeholder="Введіть завдання..."
                placeholderTextColor={theme === 'dark' ? '#888' : '#999'}
                value={content}
                onChangeText={setContent}
                style={styles.input}
                multiline
                autoFocus
            />
            <Button title="Оновити" onPress={handlerUpdate} />
            <View style={{ height: 10 }} />
            <Button title="Видалити" onPress={handlerDelete} color="#d9534f" />
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
            paddingVertical: 16,
        },
        label: {
            fontSize: 16,
            marginBottom: 8,
            color: theme === 'dark' ? '#eee' : '#111',
            fontWeight: '600',
        },
        input: {
            borderWidth: 1,
            borderColor: theme === 'dark' ? '#555' : '#ccc',
            borderRadius: 5,
            padding: 10,
            marginBottom: 20,
            color: theme === 'dark' ? '#eee' : '#222',
            backgroundColor: theme === 'dark' ? '#2a2a2a' : '#fff',
            fontSize: 16,
            minHeight: 80,
            textAlignVertical: 'top',
        },
    });
