import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from './navigation/NavigationContext';
import { useTranslation } from 'react-i18next';

const Navigation = () => {
    const navigation = useNavigation();
    const { t } = useTranslation();

    const menuItems = [
        { title: t('navigation.voiceCall'), screen: 'VoiceCall' },
        { title: t('navigation.videoCall'), screen: 'VideoCall' },
        { title: t('navigation.videoLive'), screen: 'VideoLiveEntry' },
        { title: t('navigation.voiceLive'), screen: 'VoiceLiveEntry' },
    ];

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{t('navigation.title')}</Text>
            <View style={styles.menuContainer}>
                {menuItems.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.menuItem}
                        onPress={() => navigation.navigate(item.screen)}
                    >
                        <Text style={styles.menuText}>{item.title}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 20,
        marginBottom: 30,
    },
    menuContainer: {
        paddingHorizontal: 20,
    },
    menuItem: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 8,
        marginBottom: 15,
    },
    menuText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
    },
});

export default Navigation; 