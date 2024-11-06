import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Modal, Alert, FlatList, ActivityIndicator, StyleSheet, Linking } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
const BASE_API_URL = 'https://manimapi-hfanb8gyejb3eacw.southeastasia-01.azurewebsites.net';

const MyWalletScreen = () => {
  const [walletData, setWalletData] = useState({
    userId: '',
    balance: 0,
    transactions: [],
    purchasedCourses: []
  });
  const [showAddFunds, setShowAddFunds] = useState(false);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  console.log(walletData);

  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return '0 ₫';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
      minimumFractionDigits: 0
    }).format(amount);
  };

  const fetchWalletData = async () => {
    try {
      setIsLoading(true);
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        Alert.alert('Vui lòng đăng nhập để xem thông tin ví');
        return;
      }

      // Fetch wallet details
      const walletResponse = await axios.get(`${BASE_API_URL}/getWallet`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      let parsedData = {
        userId: walletResponse.data.data.userId,
        balance: parseFloat(walletResponse.data.data.balance) || 0,
        transactions: (walletResponse.data.data.transactions || []).map((t) => ({
          ...t,
          amount: parseFloat(t.amount) || 0
        })),
        purchasedCourses: (walletResponse.data.data.purchasedCourses || []).map((c) => ({
          ...c,
          price: parseFloat(c.price) || 0
        }))
      };

      // Fetch additional transaction history
      const transactionResponse = await axios.get(`${BASE_API_URL}/api/transaction?index=1&pageSize=10`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (transactionResponse.data.data.items) {
        const additionalTransactions = transactionResponse.data.data.items.map((t) => ({
          walletId: t.walletId,
          amount: parseFloat(t.amount) || 0,
          orderCode: t.orderCode,
          status: t.status,
        }));
        parsedData.transactions = [...parsedData.transactions, ...additionalTransactions];
      }

      setWalletData(parsedData);
    } catch (error) {
      Alert.alert('Không thể tải thông tin ví. Vui lòng thử lại sau.');
      console.error("Error fetching wallet data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWalletData();
    const pollInterval = setInterval(fetchWalletData, 30000);
    return () => clearInterval(pollInterval);
  }, []);

  const handleAddFunds = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        Alert.alert('Vui lòng đăng nhập để nạp tiền');
        return;
      }

      const numericAmount = parseFloat(amount);
      if (isNaN(numericAmount) || numericAmount <= 0) {
        Alert.alert('Vui lòng nhập số tiền hợp lệ');
        return;
      }

      const response = await axios.post(`${BASE_API_URL}/api/wallet/create`, null, {
        params: { balance: numericAmount },
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      // Kiểm tra phản hồi từ API
      console.log("API response:", response.data);

      if (response.data?.checkoutUrl) {
        setShowAddFunds(false);
        Linking.openURL(response.data.checkoutUrl);
        Alert.alert('Nạp tiền thành công!');
      } else {
        Alert.alert('Không nhận được checkoutUrl từ API');
      }
    } catch (error) {
      Alert.alert('Có lỗi xảy ra khi nạp tiền. Vui lòng thử lại sau.');
      console.error("Error:", error);
    } finally {
      setLoading(false);
      setAmount('');
    }
  };

  const renderTransactionItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.description}>Order Code: {item.orderCode || 'N/A'}</Text>
      <Text style={[styles.amount, { color: item.amount >= 0 ? 'green' : 'red' }]}>
        {formatCurrency(item.amount)}
      </Text>
      <Text style={[styles.status, styles[item.status.toLowerCase()]]}>{item.status}</Text>
    </View>
  );

  const renderCourseItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.description}>{item.name}</Text>
      <Text style={styles.amount}>{formatCurrency(item.price)}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Ví của tôi</Text>
      <Text style={styles.balance}>Số dư khả dụng: {formatCurrency(walletData.balance)}</Text>

      <Button title="Nạp tiền" onPress={() => setShowAddFunds(true)} />

      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <Text style={styles.sectionHeader}>Lịch sử giao dịch</Text>
          <FlatList
            data={walletData.transactions}
            renderItem={renderTransactionItem}
            keyExtractor={(item) => item.id}
          />

          <Text style={styles.sectionHeader}>Khóa học đã mua</Text>
          <FlatList
            data={walletData.purchasedCourses}
            renderItem={renderCourseItem}
            keyExtractor={(item) => item.id}
          />
        </>
      )}

      <Modal visible={showAddFunds} transparent animationType="slide">
        <View style={styles.modal}>
          <Text style={styles.modalHeader}>Nạp tiền vào ví</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập số tiền"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
          />
          <View style={styles.buttonRow}>
            <Button title="Hủy" onPress={() => setShowAddFunds(false)} />
            <Button title={loading ? 'Đang xử lý...' : 'Xác nhận'} onPress={handleAddFunds} disabled={loading} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#c7fffe',

  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  balance: {
    fontSize: 18,
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  description: {
    flex: 1,
  },
  amount: {
    flex: 1,
    textAlign: 'right',
  },
  date: {
    flex: 1,
  },
  status: {
    flex: 1,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  completed: {
    color: 'green',
  },
  pending: {
    color: 'orange',
  },
  failed: {
    color: 'red',
  },
  modal: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    height: 40,
    backgroundColor: "#fff",
    borderWidth: 0,
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});

export default MyWalletScreen;
