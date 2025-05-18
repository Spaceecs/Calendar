import React, { useState, useEffect } from "react";
import { StatusBar, Platform, SafeAreaView } from "react-native";
import Calendar from "./src/Calendar";
import { createTable, fetchTasks } from "./src/db/db";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Tasks from "./src/Tasks";
import Task from "./src/Task";
import Login from "./src/Login";
import Register from "./src/Register";
import { UserProvider } from "./src/userContext";
import { ThemeProvider, useTheme } from "./src/ThemeContext";

const Stack = createStackNavigator();

function AppNavigator({ tasks, onTasksUpdated, isDBReady }) {
    const { theme } = useTheme();

    return (
        <Stack.Navigator
            initialRouteName="Login"
            screenOptions={{
                headerStyle: {
                    backgroundColor: theme === "dark" ? "#121212" : "#ffffff",
                    shadowColor: theme === "dark" ? "#000000" : "#ddd",
                },
                headerTintColor: theme === "dark" ? "#ffffff" : "#000000",
                headerTitleStyle: {
                    fontWeight: "bold",
                },
            }}
        >
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen name="Calendar">
                {({ navigation, route }) => (
                    <Calendar
                        tasks={tasks}
                        onTasksUpdated={onTasksUpdated}
                        navigation={navigation}
                        route={route}
                    />
                )}
            </Stack.Screen>
            <Stack.Screen name="Tasks">
                {({ navigation, route }) =>
                    isDBReady ? (
                        <Tasks
                            route={route}
                            navigation={navigation}
                            onTasksUpdated={onTasksUpdated}
                        />
                    ) : null
                }
            </Stack.Screen>
            <Stack.Screen name="Task">
                {({ route, navigation }) => (
                    <Task route={route} navigation={navigation} onTasksUpdated={onTasksUpdated} />
                )}
            </Stack.Screen>
        </Stack.Navigator>
    );
}

function MainApp() {
    const { theme } = useTheme();
    const [tasks, setTasks] = useState({});
    const [isDBReady, setIsDBReady] = useState(false);

    useEffect(() => {
        async function initDB() {
            await createTable();
            await loadTasks();
            setIsDBReady(true);
        }
        initDB();
    }, []);

    const loadTasks = async () => {
        const allTasks = await fetchTasks();
        const tasksByDate = allTasks.reduce((acc, task) => {
            if (!acc[task.date]) acc[task.date] = [];
            acc[task.date].push(task);
            return acc;
        }, {});
        setTasks(tasksByDate);
    };

    const onTasksUpdated = () => {
        loadTasks();
    };

    return (
        <>
            <StatusBar
                barStyle={theme === "dark" ? "light-content" : "dark-content"}
                backgroundColor={theme === "dark" ? "#121212" : "#ffffff"} // для Android
                translucent={false}
            />
            <SafeAreaView
                style={{
                    flex: 1,
                    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
                    backgroundColor: theme === "dark" ? "#121212" : "#ffffff",
                }}
            >
                <NavigationContainer>
                    <AppNavigator
                        tasks={tasks}
                        onTasksUpdated={onTasksUpdated}
                        isDBReady={isDBReady}
                    />
                </NavigationContainer>
            </SafeAreaView>
        </>
    );
}

export default function App() {
    return (
        <ThemeProvider>
            <UserProvider>
                <MainApp />
            </UserProvider>
        </ThemeProvider>
    );
}
