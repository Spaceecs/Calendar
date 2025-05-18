// Calendar.tsx
import React, { useState } from 'react';
import { View, Platform, StatusBar, Text, StyleSheet } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import Header from './Header';
import Day from './Day';
import {useUser} from "./userContext";
import {useTheme} from "./ThemeContext";

type RootStackParamList = {
    Tasks: { selectedDate: string };
};

interface Task {
    id: number;
    date: string;       // формат YYYY-MM-DD
    content: string;
    user_id: number;
}

interface CalendarProps {
    tasks: Task[];
    onTasksUpdated: () => void;
    currentUserId: number;
}

const Calendar = ({ tasks, onTasksUpdated }: CalendarProps) => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const [currentDate, setCurrentDate] = useState(new Date());

    const { theme } = useTheme(); // 🟡 отримуємо тему
    const styles = getStyles(theme);

    const { user } = useUser();
    const currentUserId = user?.id;

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1).getDay(); // день тижня першого дня місяця (0-6)
    const daysInCurrentMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const totalCells = 6 * 7;
    type CalendarDay = { day: number; month: number; year: number; isCurrentMonth: boolean };
    const calendarDays: CalendarDay[] = [];

    // Попередній місяць
    const prevMonth = (month - 1 + 12) % 12;
    const prevYear = month === 0 ? year - 1 : year;
    for (let i = firstDay - 1; i >= 0; i--) {
        calendarDays.push({
            day: daysInPrevMonth - i,
            month: prevMonth,
            year: prevYear,
            isCurrentMonth: false,
        });
    }

    // Поточний місяць
    for (let i = 1; i <= daysInCurrentMonth; i++) {
        calendarDays.push({
            day: i,
            month: month,
            year: year,
            isCurrentMonth: true,
        });
    }

    // Наступний місяць
    const nextMonth = (month + 1) % 12;
    const nextYear = month === 11 ? year + 1 : year;
    while (calendarDays.length < totalCells) {
        const nextDay = calendarDays.length - (firstDay + daysInCurrentMonth) + 1;
        calendarDays.push({
            day: nextDay,
            month: nextMonth,
            year: nextYear,
            isCurrentMonth: false,
        });
    }

    const weeks = [];
    for (let i = 0; i < 6; i++) {
        weeks.push(calendarDays.slice(i * 7, (i + 1) * 7));
    }

    const changeMonth = (increment: number) => {
        const newDate = new Date(currentDate);
        newDate.setMonth(currentDate.getMonth() + increment);
        setCurrentDate(newDate);
        onTasksUpdated();
    };

    const goToToday = () => {
        setCurrentDate(new Date());
        onTasksUpdated();
    };

    return (
        <View style={styles.container}>
            <Header
                month={month}
                year={year}
                onPrevMonth={() => changeMonth(-1)}
                onNextMonth={() => changeMonth(1)}
                onToday={goToToday}
            />

            <View style={styles.daysOfWeek}>
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                    <Text key={index} style={styles.dayOfWeek}>
                        {day}
                    </Text>
                ))}
            </View>

            {weeks.map((week, index) => (
                <View key={index} style={styles.weekRow}>
                    {week.map((item, idx) => {
                        const dayStr = `${item.year}-${(item.month + 1).toString().padStart(2, '0')}-${item.day.toString().padStart(2, '0')}`;
                        const today = new Date();
                        const isToday = item.day === today.getDate() &&
                            item.month === today.getMonth() &&
                            item.year === today.getFullYear();

                        const hasUserTask = tasks &&
                            tasks[dayStr] &&
                            Array.isArray(tasks[dayStr]) &&
                            tasks[dayStr].some(task => String(task.user_id) === String(currentUserId));
                        return (
                            <Day
                                key={idx}
                                day={item.day}
                                isCurrentMonth={item.isCurrentMonth}
                                hasTask={hasUserTask}
                                onDayPress={() => {
                                    if (!item.isCurrentMonth) return;
                                    navigation.navigate('Tasks', { selectedDate: dayStr });
                                }}
                                isToday={isToday}
                            />
                        );
                    })}
                </View>
            ))}
        </View>
    );
};

const getStyles = (theme: 'light' | 'dark') =>
    StyleSheet.create({
        container: {
            flex: 1,
            paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 0,
            backgroundColor: theme === 'dark' ? '#121212' : '#ffffff',
        },
        daysOfWeek: {
            flexDirection: 'row',
            justifyContent: 'space-around',
            paddingVertical: 4,
        },
        dayOfWeek: {
            width: 40,
            textAlign: 'center',
            fontWeight: 'bold',
            color: theme === 'dark' ? '#dddddd' : '#000000',
        },
        weekRow: {
            flexDirection: 'row',
            justifyContent: 'center',
        },
    });

export default Calendar;
