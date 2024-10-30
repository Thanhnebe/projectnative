import { View, Button, Alert } from 'react-native';
import React, { useState } from 'react';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { useNavigation } from '@react-navigation/native';

const GoogleLogin = () => {
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();

    const handleGoogleSignIn = async () => {
       
    };

    return (
        <View>
            <Button title="Đăng nhập với Google" onPress={handleGoogleSignIn} disabled={loading} />
        </View>
    );
};

export default GoogleLogin;
