import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image } from 'react-native';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';

const AllTab = ({ chapters, navigation }) => (
    <FlatList
        data={chapters}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
            <TouchableOpacity onPress={() => navigation.navigate('ChapterDetail', { chapter: item })}>
                <View style={styles.card}>
                    <Image
                        source={{ uri: item.imageUrl || 'https://service.keyframe.vn/uploads/filecloud/2018/April/25/72-559201524659628-1524659628.jpg' }} // Sử dụng URL hình ảnh từ API hoặc hình ảnh dự phòng
                        style={styles.chapterImage}
                        resizeMode="cover"
                    />
                    <Text style={styles.cardTitle}>{item.name}</Text>
                </View>
            </TouchableOpacity>
        )}
    />
);

const PhysicsTab = ({ chapters, navigation }) => {
    const filteredChapters = chapters.filter(item => item.subjectName.includes('Vật lý'));
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
                                    source={{ uri: item.imageUrl || 'https://service.keyframe.vn/uploads/filecloud/2018/April/25/72-559201524659628-1524659628.jpg' }} // Sử dụng URL hình ảnh từ API hoặc hình ảnh dự phòng
                                    style={styles.chapterImage}
                                    resizeMode="cover"
                                />
                                <Text style={styles.cardTitle}>{item.name}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            )}
        </View>
    );
};

const MathTab = ({ chapters, navigation }) => {
    const filteredChapters = chapters.filter(item => item.subjectName.includes('Toán học'));
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
                                    source={{ uri: item.imageUrl || 'https://service.keyframe.vn/uploads/filecloud/2018/April/25/72-559201524659628-1524659628.jpg' }} // Sử dụng URL hình ảnh từ API hoặc hình ảnh dự phòng
                                    style={styles.chapterImage}
                                    resizeMode="cover"
                                />
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
    const route = useRoute();
    const [chapters, setChapters] = useState([]);
    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: 'all', title: 'Tất cả' },
        { key: 'physics', title: 'Vật lý' },
        { key: 'math', title: 'Toán học' },
    ]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = await AsyncStorage.getItem('userToken');
                const response = await axios.get('https://manim-api-ffh6c8ewbehjc0hn.canadacentral-01.azurewebsites.net/api/chapters', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'accept': '*/*',
                    },
                });
                setChapters(response.data.data.items || []);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, []);

    const renderScene = SceneMap({
        all: () => <AllTab chapters={chapters} navigation={navigation} />,
        physics: () => <PhysicsTab chapters={chapters} navigation={navigation} />,
        math: () => <MathTab chapters={chapters} navigation={navigation} />,
    });

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
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 24,
    },
    chapterImage: {
        width: '100%',
        height: 100, // Điều chỉnh chiều cao tùy ý
        borderRadius: 8,
        marginBottom: 8,
    },
    tabBar: {
        backgroundColor: '#fff',
    },
    tabLabel: {
        color: '#007AFF',
        fontWeight: 'bold',
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
});
