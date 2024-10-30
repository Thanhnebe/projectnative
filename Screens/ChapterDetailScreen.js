import React from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';

const ChapterDetailScreen = ({ route }) => {
    const { chapter } = route.params;

    const renderItem = ({ item }) => (
        <View style={styles.lessonCard}>
            <Text style={styles.lessonTitle}>{item.name}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.chapterTitle}>{chapter.name}</Text>
            <FlatList
                data={chapter.topics}
                keyExtractor={item => item.id}
                renderItem={renderItem}
            />
        </View>
    );
};

export default ChapterDetailScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f5f5f5',
    },
    chapterTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    lessonCard: {
        backgroundColor: '#ffffff',
        borderRadius: 10,
        padding: 15,
        marginVertical: 5,
        elevation: 2,
    },
    lessonTitle: {
        fontSize: 18,
    },
});
