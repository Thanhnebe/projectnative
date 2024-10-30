import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';

const MyWalletScreen = () => {
  const [balance, setBalance] = useState('');

  const handleImport = async () => {
    try {
      const response = await fetch(`https://manim-api-ffh6c8ewbehjc0hn.canadacentral-01.azurewebsites.net/create?balance=${balance}`);
      const data = await response.json();
      Alert.alert('Thông báo', `Nạp tiền thành công: ${data.message}`);
    } catch (error) {
      Alert.alert('Lỗi', 'Đã xảy ra lỗi trong quá trình nạp tiền.');
    }
  };

  return (
    <View style={styles.container}>
      <Text>Ví của tôi</Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập số tiền muốn nạp"
        keyboardType="numeric"
        value={balance}
        onChangeText={setBalance}
      />
      <Button title="Nạp tiền" onPress={handleImport} />
    </View>
  );
};

export default MyWalletScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    width: '100%',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
});
