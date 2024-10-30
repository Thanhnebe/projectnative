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
        const fetchUser = async () => {
            const token = await AsyncStorage.getItem('userToken');
            try {
                const response = await axios.get('https://manim-api-ffh6c8ewbehjc0hn.canadacentral-01.azurewebsites.net/api/user/profile', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                setUser(response.data.data);
                setFullName(response.data.data.fullName); // Khởi tạo tên người dùng
                setEmail(response.data.data.email); // Khởi tạo email
                setPhone(response.data.data.phone); // Khởi tạo số điện thoại
                setGender(response.data.data.gender); // Khởi tạo giới tính
            } catch (error) {
                console.error(error);
                Alert.alert('Lỗi', 'Không thể lấy thông tin người dùng');
            }
        };

        fetchUser();
    }, []);

    const handleEdit = () => {
        setIsEditing(!isEditing);
        if (isEditing) {
            const updateUser = async () => {
                const token = await AsyncStorage.getItem('userToken');
                try {
                    await axios.put('https://manim-api-ffh6c8ewbehjc0hn.canadacentral-01.azurewebsites.net/api/user/profile', {
                        fullName,
                        email,
                        phone,
                        gender,
                    }, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    });
                    Alert.alert('Thông báo', 'Cập nhật thông tin thành công');
                } catch (error) {
                    console.error(error);
                    Alert.alert('Lỗi', 'Không thể cập nhật thông tin');
                }
            };
            updateUser();
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
                <Text style={styles.info}>{user.phone}</Text>
            )}

            <Text style={styles.label}>Giới tính:</Text>
            {isEditing ? (
                <TextInput
                    style={styles.input}
                    value={gender}
                    onChangeText={setGender}
                />
            ) : (
                <Text style={styles.info}>{user.gender}</Text>
            )}

            <TouchableOpacity style={styles.button} onPress={handleEdit}>
                <Text style={styles.buttonText}>{isEditing ? 'Lưu' : 'Sửa'}</Text>
            </TouchableOpacity>
        </View>
    );
};

export default ProfileScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f5f5f5',
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
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
