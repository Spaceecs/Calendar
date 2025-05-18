import React from 'react';
import { View, Button, Alert, TextInput, StyleSheet, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useUser } from './userContext';
import { registerUser } from './db/db';

import { Formik } from 'formik';
import * as Yup from 'yup';

type RootStackParamList = {
    Calendar: undefined;
    Login: undefined;
    Register: undefined;
};

const RegisterSchema = Yup.object().shape({
    name: Yup.string().required('Ім\'я обов\'язкове'),
    password: Yup.string().min(4, 'Пароль має бути мінімум 4 символи').required('Пароль обов\'язковий'),
});

export default function RegisterScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { setUser } = useUser();

    return (
        <Formik
            initialValues={{ name: '', password: '' }}
            validationSchema={RegisterSchema}
            onSubmit={async (values, { setSubmitting }) => {
                const userId = await registerUser(values.name, values.password);
                if (userId) {
                    setUser({ id: userId, name: values.name });
                    console.log('User:', userId, values.name);
                    navigation.navigate('Calendar');
                } else {
                    Alert.alert('Помилка', 'Користувача не створено');
                }
                setSubmitting(false);
            }}
        >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
                <View style={styles.container}>
                    <TextInput
                        placeholder="Ім'я"
                        onChangeText={handleChange('name')}
                        onBlur={handleBlur('name')}
                        value={values.name}
                        style={styles.input}
                    />
                    {errors.name && touched.name && <Text style={styles.errorText}>{errors.name}</Text>}

                    <TextInput
                        placeholder="Пароль"
                        onChangeText={handleChange('password')}
                        onBlur={handleBlur('password')}
                        value={values.password}
                        secureTextEntry
                        style={styles.input}
                    />
                    {errors.password && touched.password && <Text style={styles.errorText}>{errors.password}</Text>}

                    <Button onPress={() => handleSubmit()} title={isSubmitting ? "Зареєструємось..." : "Зареєструватися"} disabled={isSubmitting} />
                    <Button title="Назад" onPress={() => navigation.goBack()} />
                </View>
            )}
        </Formik>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        marginBottom: 10,
        padding: 10,
        borderRadius: 5,
    },
    errorText: {
        marginBottom: 8,
        color: 'red',
    },
});
