import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const ProfileScreen = ({ navigation }) => {
    const [user, setUser] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [gender, setGender] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userDataString = await AsyncStorage.getItem('userData');
                if (userDataString) {
                    const userData = JSON.parse(userDataString);
                    setUser(userData);
                    setFullName(userData.fullName);
                    setEmail(userData.email);
                    setPhone(userData.phoneNumber);
                    setGender(userData.gender);
                }
            } catch (error) {
                console.error(error);
                Alert.alert('Lỗi', 'Không thể lấy thông tin người dùng từ lưu trữ');
            }
        };

        fetchUserData();
    }, []);

    const handleEdit = async () => {
        if (isEditing) {
            const updateUserData = async () => {
                const token = await AsyncStorage.getItem('userToken');
                const updatedUser = { userName: user.userName, fullName, email, phoneNumber: phone, gender };

                try {
                    const response = await axios.put(
                        'https://manimapi-hfanb8gyejb3eacw.southeastasia-01.azurewebsites.net/api/auth/UpdateProfile',
                        updatedUser,
                        {
                            headers: {
                                'Authorization': `Bearer ${token}`,
                                'Content-Type': 'application/json',
                            },
                        }
                    );

                    if (response.status === 200) {
                        await AsyncStorage.setItem('userData', JSON.stringify(updatedUser));
                        setUser(updatedUser);
                        Alert.alert('Thông báo', 'Cập nhật thông tin thành công');
                    }
                } catch (error) {
                    console.error(error);
                    Alert.alert('Lỗi', 'Không thể cập nhật thông tin');
                }
            };
            updateUserData();
        }
        setIsEditing(!isEditing);
    };

    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem('userToken');
            await AsyncStorage.removeItem('userData');
            navigation.navigate('Home'); // Adjust to your actual home route name
        } catch (error) {
            console.error(error);
            Alert.alert('Lỗi', 'Đăng xuất không thành công');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Thông tin cá nhân</Text>

            <Text style={styles.label}>Họ và tên:</Text>
            {isEditing ? (
                <TextInput
                    style={styles.input}
                    value={fullName}
                    onChangeText={setFullName}
                />
            ) : (
                <Text style={styles.info}>{user.fullName}</Text>
            )}

            <Text style={styles.label}>Email:</Text>
            {isEditing ? (
                <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                />
            ) : (
                <Text style={styles.info}>{user.email}</Text>
            )}

            <Text style={styles.label}>Số điện thoại:</Text>
            {isEditing ? (
                <TextInput
                    style={styles.input}
                    value={phone}
                    onChangeText={setPhone}
                />
            ) : (
                <Text style={styles.info}>{user.phoneNumber}</Text>
            )}

            <Text style={styles.label}>Giới tính:</Text>
            {isEditing ? (
                <TextInput
                    style={styles.input}
                    value={gender.toString()}
                    onChangeText={setGender}
                />
            ) : (
                <Text style={styles.info}>{user.gender}</Text>
            )}

            <TouchableOpacity style={styles.button} onPress={handleEdit}>
                <Text style={styles.buttonText}>{isEditing ? 'Lưu' : 'Sửa'}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
                <Text style={styles.buttonText}>Đăng xuất</Text>
            </TouchableOpacity>
        </View>
    );
};

export default ProfileScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#c7fffe',

    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    label: {
        fontSize: 18,
        marginBottom: 10,
    },
    input: {
        height: 50,
        borderColor: '#E0E0E0',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 20,
    },
    info: {
        fontSize: 18,
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#007AFF',
        borderRadius: 8,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    logoutButton: {
        backgroundColor: '#FF3B30',
    },
});
