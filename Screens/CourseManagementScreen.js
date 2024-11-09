import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Linking } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CourseManagementScreen = () => {
    const [solutions, setSolutions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSolutions = async () => {
            try {
                const token = await AsyncStorage.getItem('userToken');
                const userData = await AsyncStorage.getItem('userData');
                const { id } = JSON.parse(userData);

                const response = await axios.get(
                    `https://manim-api-ffh6c8ewbehjc0hn.southeastasia-01.azurewebsites.net/api/solutions?index=1&pageSize=10&userId=${id}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    }
                );
                setSolutions(response.data.data.items);

            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchSolutions();
    }, []);

    const handleLinkPress = (url) => {
        Linking.openURL(url).catch(err => console.error("Couldn't open page", err));
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <Text>Loading purchased solutions...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Bài học đã thanh toán</Text>
            <FlatList
                data={solutions}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.solutionCard}>
                        <Text style={styles.solutionTitle}>{item.problemName}</Text>
                        <Text>{item.description}</Text>
                        <TouchableOpacity onPress={() => handleLinkPress(item.url)}>
                            <Text style={styles.link}>Xem video chi tiết</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />
        </View>
    );
};

export default CourseManagementScreen;

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
    solutionCard: {
        backgroundColor: '#ffffff',
        borderRadius: 8,
        padding: 10,
        marginBottom: 10,
    },
    solutionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    link: {
        color: '#007AFF',
        fontWeight: 'bold',
        marginTop: 10,
    },
});
