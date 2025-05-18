import React from 'react';
import { View, Button, Alert, TextInput, StyleSheet, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useUser } from './userContext';
import { loginUser } from './db/db';

import { Formik } from 'formik';
import * as Yup from 'yup';

type RootStackParamList = {
    Login: undefined;
    Calendar: undefined;
    Register: undefined;
};

const LoginSchema = Yup.object().shape({
    name: Yup.string().required('Ім\'я обов\'язкове'),
    password: Yup.string().required('Пароль обов\'язковий'),
});

export default function Login() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { setUser } = useUser();

    return (
        <Formik
            initialValues={{ name: '', password: '' }}
            validationSchema={LoginSchema}
            onSubmit={async (values, { setSubmitting }) => {
                const user = await loginUser(values.name, values.password);

                if (user && typeof user === 'object' && 'id' in user && 'name' in user) {
                    setUser(user as { id: number; name: string });
                    console.log('User:', user);
                    navigation.navigate('Calendar');
                } else {
                    Alert.alert('Помилка', 'Неправильні дані');
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

                    <Button onPress={() => handleSubmit()} title={isSubmitting ? "Входимо..." : "Увійти"} disabled={isSubmitting} />
                    <Button title="Реєстрація" onPress={() => navigation.navigate('Register')} />
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
