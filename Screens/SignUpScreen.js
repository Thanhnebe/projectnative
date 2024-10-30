import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, Button, Alert, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const SignUpScreen = () => {
  const [username, setUsername] = useState('');  // Thêm state cho username
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState(0);  // Sử dụng số cho gender
  const navigation = useNavigation();

  const next = () => {
    navigation.navigate('Login');
  };

  const handleSignUp = () => {
    const userData = {
      username,  // Gửi username
      password,
      confirmPassword,  // Thêm confirmPassword
      fullName,
      email,
      phone,
      gender,
    };

    axios.post('https://manim-api-ffh6c8ewbehjc0hn.canadacentral-01.azurewebsites.net/api/auth/SignUp', userData)
      .then(response => {
        Alert.alert('Account created successfully');
        navigation.navigate('Login');
      })
      .catch(error => {
        Alert.alert(`Error: ${error.response ? error.response.data.errorMessage : error.message}`);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng ký</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Phone"
        value={phone}
        onChangeText={setPhone}
      />
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={fullName}
        onChangeText={setFullName}
      />

      <Text style={styles.genderLabel}>Gender:</Text>
      <View style={styles.radioContainer}>
        <TouchableOpacity onPress={() => setGender(0)}>
          <Text style={gender === 0 ? styles.radioSelected : styles.radio}>Male</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setGender(1)}>
          <Text style={gender === 1 ? styles.radioSelected : styles.radio}>Female</Text>
        </TouchableOpacity>
      </View>

      <Button title="Đăng ký" onPress={handleSignUp} />

      <TouchableOpacity style={styles.guestButton}>
        <Text style={styles.guestButtonText}>As a Guest</Text>
      </TouchableOpacity>

      <View style={styles.loginPrompt}>
        <Text style={styles.loginText}>You don't have an account yet? </Text>
        <TouchableOpacity onPress={next}>
          <Text style={styles.loginLink}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SignUpScreen;

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
    marginBottom: 10,
  },
  input: {
    height: 50,
    borderColor: '#E0E0E0',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  genderLabel: {
    fontSize: 18,
    marginVertical: 10,
  },
  radioContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  radio: {
    fontSize: 18,
    color: '#666',
  },
  radioSelected: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  guestButtonText: {
    color: '#007AFF',
    fontSize: 16,
  },
  loginPrompt: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  loginText: {
    color: '#666',
    marginBottom: 50,
  },
  loginLink: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
});
