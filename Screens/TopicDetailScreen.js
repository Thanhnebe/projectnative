import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import axios from 'axios';

const TopicDetailScreen = ({ route, navigation }) => {
    const { topic } = route.params;
    const [problems, setProblems] = useState([]);

    useEffect(() => {
        const fetchProblems = async () => {
            try {
                const response = await axios.get('https://manimapi-hfanb8gyejb3eacw.southeastasia-01.azurewebsites.net/api/topics?index=1&pageSize=10');
                const topicData = response.data.data.items.find(item => item.id === topic.id);
                setProblems(topicData ? topicData.problems : []);
            } catch (error) {
                console.error(error);
            }
        };

        fetchProblems();
    }, [topic.id]);

    const renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => navigation.navigate('ProblemDetail', { problemId: item.id })}>
            <View style={styles.problemCard}>
                <Text style={styles.problemTitle}>{item.name}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.topicTitle}>{topic.name}</Text>
            <FlatList
                data={problems}
                keyExtractor={item => item.id}
                renderItem={renderItem}
            />
        </View>
    );
};

export default TopicDetailScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#c7fffe',
    },
    topicTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    problemCard: {
        backgroundColor: '#ffffff',
        borderRadius: 10,
        padding: 15,
        marginVertical: 5,
        elevation: 2,
    },
    problemTitle: {
        fontSize: 18,
    },
});
