import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "./ThemeContext"; // 🔹 Імпортуй контекст

interface DayProps {
    day: number;
    isCurrentMonth: boolean;
    isToday: boolean;
    hasTask: boolean;
    onDayPress: () => void;
}

const Day = ({ day, isCurrentMonth, isToday, hasTask, onDayPress }: DayProps) => {
    const { theme } = useTheme(); // 🔹 Отримати тему
    const styles = getStyles(theme); // 🔹 Динамічні стилі

    return (
        <TouchableOpacity
            style={[styles.dayContainer, isToday && styles.todayContainer]}
            onPress={onDayPress}
            activeOpacity={0.7}
            disabled={!isCurrentMonth}
        >
            <View style={styles.inner}>
                <Text
                    style={[
                        styles.dayText,
                        !isCurrentMonth && styles.notCurrentMonth,
                        isToday && styles.todayText,
                    ]}
                >
                    {day}
                </Text>
                {hasTask && <View style={styles.taskDot} />}
            </View>
        </TouchableOpacity>
    );
};

// 🔹 Динамічні стилі залежно від теми
const getStyles = (theme: 'light' | 'dark') => StyleSheet.create({
    dayContainer: {
        flex: 1,
        aspectRatio: 1,
        borderWidth: 1,
        borderColor: theme === 'dark' ? "#555" : "lightgray",
        backgroundColor: theme === 'dark' ? "#222" : "#fff",
    },
    inner: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
    },
    dayText: {
        fontSize: 16,
        color: theme === 'dark' ? "#fff" : "#000",
    },
    notCurrentMonth: {
        color: theme === 'dark' ? "#777" : "gray",
    },
    todayText: {
        fontWeight: "bold",
        color: theme === 'dark' ? "#fff" : "#000",
    },
    todayContainer: {
        backgroundColor: theme === 'dark' ? "#444" : "lightblue",
    },
    taskDot: {
        position: "absolute",
        bottom: 5,
        right: 5,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "red",
    },
});

export default Day;
