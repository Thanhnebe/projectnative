import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, Button, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OTPScreen = () => {
    const [otp, setOtp] = useState('');
    const [userId, setUserId] = useState(null);  // Store the userId
    const navigation = useNavigation();

    // Retrieve userId from AsyncStorage
    const getUserId = async () => {
        const storedUserId = await AsyncStorage.getItem('userid');
        setUserId(storedUserId);
    };

    // Call getUserId when the component is mounted
    React.useEffect(() => {
        getUserId();
    }, []);

    const handleVerifyOTP = () => {
        if (otp.length !== 6) {
            Alert.alert('Error', 'OTP must be 6 digits');
            return;
        }

        // Check if userId is available
        if (!userId) {
            Alert.alert('Error', 'User ID is not available. Please try again.');
            return;
        }

        // Send OTP and userId to the API for verification
        const data = {
            userId: userId,  // Send the userId from AsyncStorage
            otp: otp,
        };

        axios.post('https://manim-api-ffh6c8ewbehjc0hn.southeastasia-01.azurewebsites.net/api/auth/Verify', data)
            .then(response => {
                // Handle successful OTP verification
                if (response.data.data === true) {
                    Alert.alert('Success', 'OTP verified successfully!');
                    navigation.navigate('Login');  // Navigate to the next screen
                } else {
                    Alert.alert('Error', 'Invalid OTP. Please try again.');
                }
            })
            .catch(error => {
                Alert.alert('Error', 'An error occurred while verifying OTP. Please try again.');
            });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Enter OTP</Text>

            <TextInput
                style={styles.input}
                placeholder="Enter OTP"
                value={otp}
                onChangeText={setOtp}
                keyboardType="numeric"
                maxLength={6}  // Limiting to 6 digits
            />

            <Button title="Verify OTP" onPress={handleVerifyOTP} />

            <View style={styles.resendContainer}>
                <Text style={styles.resendText}>Didn't receive OTP?</Text>
                <Button title="Resend OTP" onPress={() => Alert.alert('OTP resent!')} />
            </View>
        </View>
    );
};

export default OTPScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    input: {
        height: 50,
        borderColor: '#E0E0E0',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 20,
        textAlign: 'center',
        fontSize: 18,
    },
    resendContainer: {
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    resendText: {
        fontSize: 16,
        color: '#666',
    },
});
