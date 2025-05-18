import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useTheme } from './ThemeContext'; // 🟡 Додати імпорт

const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

const Header = ({ month, year, onPrevMonth, onNextMonth, onToday }) => {
    const { theme, toggleTheme } = useTheme(); // 🟡 Використати контекст
    const styles = getStyles(theme); // 🟡 Динамічні стилі

    return (
        <View style={styles.headerContainer}>
            <TouchableOpacity onPress={onPrevMonth} style={styles.button}>
                <Text style={styles.buttonText}>{"<"}</Text>
            </TouchableOpacity>

            <Text style={styles.monthYearText}>
                {`${monthNames[month]} ${year}`}
            </Text>

            <TouchableOpacity onPress={onNextMonth} style={styles.button}>
                <Text style={styles.buttonText}>{">"}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={onToday} style={styles.button}>
                <Text style={styles.buttonText}>Today</Text>
            </TouchableOpacity>

            {/* 🟡 Кнопка для теми */}
            <TouchableOpacity onPress={toggleTheme} style={styles.themeToggle}>
                <Text style={styles.themeToggleText}>
                    {theme === 'light' ? '🌙' : '☀️'}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

// 🟡 Стилі залежать від теми
const getStyles = (theme: 'light' | 'dark') => StyleSheet.create({
    headerContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 10,
        alignItems: "center",
        paddingHorizontal: 20,
        backgroundColor: theme === 'dark' ? '#1e1e1e' : '#f0f0f0',
    },
    monthYearText: {
        fontSize: 18,
        fontWeight: "bold",
        color: theme === 'dark' ? '#ffffff' : '#000000',
    },
    button: {
        backgroundColor: theme === 'dark' ? '#333' : 'lightgray',
        borderRadius: 15,
        borderWidth: 2,
        borderColor: theme === 'dark' ? '#777' : 'black',
        paddingHorizontal: 10,
        paddingVertical: 3,
        marginHorizontal: 5,
    },
    buttonText: {
        color: theme === 'dark' ? '#fff' : '#000',
        fontWeight: "bold",
    },
    themeToggle: {
        marginLeft: 10,
        padding: 6,
        borderRadius: 50,
        backgroundColor: theme === 'dark' ? '#444' : '#ddd',
    },
    themeToggleText: {
        fontSize: 18,
        color: theme === 'dark' ? '#fff' : '#000',
    },
});

export default Header;
