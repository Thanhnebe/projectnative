import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, Alert, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Thêm AsyncStorage
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation();

    const handleLogin = async () => {
        const userData = { username, password };

        try {
            const response = await axios.post('https://manimapi-hfanb8gyejb3eacw.southeastasia-01.azurewebsites.net/api/auth/SignIn', userData);
            const { user, token } = response.data.data;
            console.log(response);

            // Save user details and token to AsyncStorage
            await AsyncStorage.setItem('userToken', token.accessToken);
            await AsyncStorage.setItem('userData', JSON.stringify(user));

            Alert.alert('Đăng nhập thành công');
            navigation.navigate('Home', { user });
        } catch (error) {
            Alert.alert('Đăng nhập thất bại', error.response ? error.response.data.message : error.message);
        }
    };

    const goToSignUp = () => {
        navigation.navigate('SignUp');
    };

    const dismissKeyboard = () => {
        Keyboard.dismiss();
    };

    return (
        <TouchableWithoutFeedback onPress={dismissKeyboard}>
            <View style={styles.container}>
                <Text style={styles.title}>Đăng nhập</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Username"
                    value={username}
                    onChangeText={setUsername}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Mật khẩu"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
                <TouchableOpacity style={styles.btnDangnhap} onPress={handleLogin}>
                    <Text style={styles.loginButtonText}>Đăng nhập</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.googleButton}>
                    <Text style={{ fontSize: 32, fontWeight: "bold" }}>
                        <Text style={{ color: "#4285F4" }}>G</Text>
                        <Text style={{ color: "#EA4336" }}>o</Text>
                        <Text style={{ color: "#FBBC04" }}>o</Text>
                        <Text style={{ color: "#4285F4" }}>g</Text>
                        <Text style={{ color: "#34A853" }}>l</Text>
                        <Text style={{ color: "#EA4336" }}>e</Text>
                    </Text>
                </TouchableOpacity>

                <View style={styles.signupContainer}>
                    <Text style={styles.signupText}>Bạn chưa có tài khoản? </Text>
                    <TouchableOpacity onPress={goToSignUp}>
                        <Text style={styles.signupLink}>Đăng ký</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
};

export default LoginScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 24,
        textAlign: 'center',
    },
    input: {
        height: 50,
        borderColor: '#E0E0E0',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 15,
    },
    btnDangnhap: {
        backgroundColor: '#007AFF',
        borderRadius: 8,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
    },
    loginButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    googleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: '#E0E0E0',
        borderWidth: 1,
        borderRadius: 8,
        height: 50,
        marginBottom: 20,
    },
    signupContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    signupText: {
        color: '#666',
    },
    signupLink: {
        color: '#007AFF',
        fontWeight: 'bold',
    },
});
