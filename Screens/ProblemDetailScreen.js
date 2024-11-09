import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, TextInput, Button, Modal, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProblemDetailScreen = ({ route }) => {
    const { problemId } = route.params;
    const navigation = useNavigation();
    const [problemDetails, setProblemDetails] = useState(null);
    const [parameterValues, setParameterValues] = useState({});
    const [responseMessage, setResponseMessage] = useState('');
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        const fetchProblemDetails = async () => {
            try {
                const token = await AsyncStorage.getItem('userToken');
                const response = await axios.get(
                    'https://manim-api-ffh6c8ewbehjc0hn.southeastasia-01.azurewebsites.net/api/problems?index=1&pageSize=10',
                    {
                        headers: {
                            'accept': '*/*',
                            'Authorization': `Bearer ${token}`,
                        },
                    }
                );

                const problemData = response.data.data.items.find(item => item.id === problemId);
                setProblemDetails(problemData);

                if (problemData) {
                    const initialValues = {};
                    problemData.getPPVM.forEach(param => {
                        initialValues[param.parameterId] = '';
                    });
                    setParameterValues(initialValues);
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchProblemDetails();
    }, [problemId]);

    if (!problemDetails) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }

    const handleInputChange = (parameterId, value) => {
        setParameterValues({
            ...parameterValues,
            [parameterId]: value,
        });
    };

    const handleSubmit = async () => {
        const postPPVMs = Object.keys(parameterValues).map(key => ({
            parameterId: key,
            value: parseFloat(parameterValues[key]),
        }));

        const data = {
            problemId: problemId,
            postPPVMs: postPPVMs,
        };

        try {
            const token = await AsyncStorage.getItem('userToken');
            const response = await axios.post(
                'https://manim-api-ffh6c8ewbehjc0hn.southeastasia-01.azurewebsites.net/api/problems/purchaseProblem',
                data,
                {
                    headers: {
                        'accept': '*/*',
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.data && response.data.code === "Success!") {
                setResponseMessage(response.data.data);
                setModalVisible(true); // Show modal on success
            }
        } catch (error) {
            console.error(error);
            setResponseMessage('Error: Unable to submit the values.');
        }
    };

    const handleNavigateToCourseManagement = () => {
        setModalVisible(false);
        navigation.navigate('CourseManagement', { successMessage: responseMessage });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.problemTitle}>{problemDetails.name}</Text>
            <Text style={styles.problemDescription}>{problemDetails.description}</Text>
            <Text style={styles.parameterTitle}>Parameters:</Text>
            <FlatList
                data={problemDetails.getPPVM}
                keyExtractor={item => item.parameterId}
                renderItem={({ item }) => (
                    <View style={styles.parameterCard}>
                        <Text>{item.symbol}:</Text>
                        <TextInput
                            style={styles.input}
                            value={parameterValues[item.parameterId]}
                            onChangeText={value => handleInputChange(item.parameterId, value)}
                            placeholder={`Enter value for ${item.symbol}`}
                            keyboardType="numeric"
                        />
                    </View>
                )}
            />
            <Button title="Submit Values" onPress={handleSubmit} />

            {/* Modal for Success Notification */}
            <Modal
                transparent={true}
                animationType="slide"
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalMessage}>{responseMessage || 'Mua giải pháp thành công'}</Text>
                        <TouchableOpacity style={styles.modalButton} onPress={handleNavigateToCourseManagement}>
                            <Text style={styles.modalButtonText}>Quản lý khóa học</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.modalCloseButton} onPress={() => setModalVisible(false)}>
                            <Text style={styles.modalCloseButtonText}>Đóng</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default ProblemDetailScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f5f5f5',
    },
    problemTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    problemDescription: {
        fontSize: 16,
        marginBottom: 20,
    },
    parameterTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
    },
    parameterCard: {
        backgroundColor: '#ffffff',
        borderRadius: 8,
        padding: 10,
        marginVertical: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        padding: 8,
        marginTop: 5,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: '80%',
        alignItems: 'center',
    },
    modalMessage: {
        fontSize: 18,
        marginBottom: 20,
        textAlign: 'center',
    },
    modalButton: {
        backgroundColor: '#4CAF50',
        padding: 10,
        borderRadius: 5,
        width: '100%',
        alignItems: 'center',
        marginBottom: 10,
    },
    modalButtonText: {
        color: 'white',
        fontSize: 16,
    },
    modalCloseButton: {
        padding: 10,
        width: '100%',
        alignItems: 'center',
    },
    modalCloseButtonText: {
        fontSize: 16,
        color: 'red',
    },
});
