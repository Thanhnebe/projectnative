import React from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image } from 'react-native';

const ChapterDetailScreen = ({ route, navigation }) => {
    const { chapter } = route.params;

    const renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => navigation.navigate('TopicDetail', { topic: item })}>
            <View style={styles.lessonCard}>
                <Image
                    source={{ uri: 'https://top10tphcm.com/wp-content/uploads/2023/06/anh-mau-den-dep-va-chat.jpg' }} // Replace with your default image URL
                    style={styles.lessonImage}
                />
                <View style={styles.lessonDetails}>
                    <Text style={styles.lessonName}>{"Vật lý"}</Text>
                    <Text style={styles.lessonTitle}>{item.name}</Text>
                    <Text style={styles.gia}>{"200 VNĐ"}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Text style={styles.backButtonText}>Back</Text>
                </TouchableOpacity>
                <Text style={styles.chapterTitle}>{chapter.name}</Text>
            </View>
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
        backgroundColor: '#c7fffe',
    },
    backButton: {
        marginBottom: 10,
        padding: 10,
        backgroundColor: '#007AFF',
        borderRadius: 5,
        alignSelf: 'flex-start',
    },
    backButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    chapterTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    lessonCard: {
        flexDirection: 'row', // Use row layout for image and text
        alignItems: 'center', // Center align items vertically
        backgroundColor: '#ffffff',
        borderRadius: 10,
        marginVertical: 5,
        elevation: 2,
    },
    lessonImage: {
        width: 100, // Set a fixed width for the image
        height: 100, // Set a fixed height for the image
        borderRadius: 5, // Optional: rounded corners
        marginRight: 15, // Space between image and text
    },
    lessonTitle: {
        fontSize: 18,
        fontWeight: "400"
    },
    lessonName: {
        fontSize: 16,
        color: "#e6ff00",
        textTransform: "uppercase"
    },
    gia: {
        color: "#0100ff",
        fontWeight: "700"
    },
    header: {
        flexDirection: 'row', // Aligns items in a row
        alignItems: 'center', // Centers items vertically
        marginBottom: 20, // Space below the header
        gap: 10
    },
});
