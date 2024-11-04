import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image } from 'react-native';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';

const SubjectTab = ({ chapters, subjectName, navigation }) => {
    const filteredChapters = chapters.filter(item => item.subjectName.includes(subjectName));
    return (
        <View style={styles.scene}>
            {filteredChapters.length === 0 ? (
                <Text style={styles.noDataText}>Hiện tại chưa có bài học nào</Text>
            ) : (
                <FlatList
                    data={filteredChapters}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => navigation.navigate('ChapterDetail', { chapter: item })}>
                            <View style={styles.card}>
                                <Image
                                    source={{ uri: item.imageUrl || 'https://service.keyframe.vn/uploads/filecloud/2018/April/25/72-559201524659628-1524659628.jpg' }}
                                    style={styles.chapterImage}
                                    resizeMode="cover"
                                />
                                <Text style={styles.titlemonhoc}>{item.subjectName}</Text>
                                <Text style={styles.cardTitle}>{item.name}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            )}
        </View>
    );
};

const HomeScreen = ({ navigation }) => {
    const [chapters, setChapters] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [index, setIndex] = useState(0);
    const [routes, setRoutes] = useState([]);

    useEffect(() => {
        const fetchSubjectsAndChapters = async () => {
            try {
                const token = await AsyncStorage.getItem('userToken');

                // Fetch subjects
                const subjectsResponse = await axios.get('https://manimapi-hfanb8gyejb3eacw.southeastasia-01.azurewebsites.net/api/subjects?index=1&pageSize=10', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'accept': '*/*',
                    },
                });

                const fetchedSubjects = subjectsResponse.data.data.items;
                setSubjects(fetchedSubjects);

                // Set routes dynamically based on subjects
                const generatedRoutes = fetchedSubjects.map((subject, idx) => ({
                    key: subject.id,
                    title: subject.name,
                }));
                setRoutes(generatedRoutes);

                // Fetch chapters
                const chaptersResponse = await axios.get('https://manimapi-hfanb8gyejb3eacw.southeastasia-01.azurewebsites.net/api/chapters', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'accept': '*/*',
                    },
                });
                setChapters(chaptersResponse.data.data.items || []);
            } catch (error) {
                console.error(error);
            }
        };

        fetchSubjectsAndChapters();
    }, []);

    const renderScene = ({ route }) => {
        const subject = subjects.find(subject => subject.id === route.key);
        return (
            <SubjectTab
                chapters={chapters}
                subjectName={subject ? subject.name : ''}
                navigation={navigation}
            />
        );
    };

    const renderTabBar = props => (
        <TabBar
            {...props}
            style={styles.tabBar}
            labelStyle={styles.tabLabel}
            indicatorStyle={styles.tabIndicator}
        />
    );

    return (
        <View style={styles.container}>
            <Text style={styles.userName}>Welcome, {'User'}!</Text>
            <Text style={styles.center}>Hiện bạn sẽ học gì cùng Manim AI Physics Visualizer App đây?</Text>
            <Text style={styles.center}>Hãy cho chúng mình biết nhé!</Text>
            <Text style={styles.danhmuc}>Danh mục</Text>
            <TabView
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={{ width: 400 }}
                renderTabBar={renderTabBar}
            />
        </View>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#bed1cd',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 24,
    },
    chapterImage: {
        width: '100%',
        height: 100,
        borderRadius: 8,
        marginBottom: 8,
    },
    tabBar: {
        backgroundColor: '#fff',
    },
    tabLabel: {
        color: '#007AFF',
        fontWeight: 'bold',
        textAlign: 'center'
    },
    tabIndicator: {
        backgroundColor: '#007AFF',
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 10,
        marginVertical: 10,
        padding: 10,
        elevation: 2,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    scene: {
        flex: 1,
    },
    noDataText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
        color: '#888',
    },
    center: {
        textAlign: "center",
        marginVertical: 10,
        fontSize: 14
    },
    userName: {
        marginBottom: 12,
        fontSize: 30,
        fontWeight: "700",
        textAlign: "center"
    },
    danhmuc: {
        fontWeight: "500",
        textTransform: "uppercase",
        marginTop: 10,
        fontSize: 15
    }
});
