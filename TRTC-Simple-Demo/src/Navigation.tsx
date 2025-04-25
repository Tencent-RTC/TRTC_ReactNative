import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';

type RootStackParamList = {
    Navigation: undefined;
    VoiceCall: undefined;
    VideoCall: undefined;
    VideoLiveEntry: undefined;
    VoiceLiveEntry: undefined;
};

type NavigationScreenProp = StackNavigationProp<RootStackParamList, 'Navigation'>;

const Navigation = () => {
    const navigation = useNavigation<NavigationScreenProp>();
    const { t } = useTranslation();

    const menuItems = [
        { title: t('navigation.voiceCall'), screen: 'VoiceCall' },
        { title: t('navigation.videoCall'), screen: 'VideoCall' },
        { title: t('navigation.videoLive'), screen: 'VideoLiveEntry' },
        { title: t('navigation.voiceLive'), screen: 'VoiceLiveEntry' },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>{t('navigation.title')}</Text>
            <View style={styles.menuContainer}>
                {menuItems.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.menuItem}
                        onPress={() => navigation.navigate(item.screen as keyof RootStackParamList)}
                    >
                        <Text style={styles.menuText}>{item.title}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </SafeAreaView>
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