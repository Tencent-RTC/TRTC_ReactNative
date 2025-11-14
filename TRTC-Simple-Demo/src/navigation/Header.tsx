import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useNavigation, useRoute } from './NavigationContext';
import { useTranslation } from 'react-i18next';

interface HeaderProps {
    title?: string;
    showBack?: boolean;
}

const Header: React.FC<HeaderProps> = ({ title, showBack = true }) => {
    const navigation = useNavigation();
    const route = useRoute();
    const { t } = useTranslation();

    const getTitle = () => {
        if (title) return title;

        switch (route.name) {
            case 'Navigation':
                return t('navigation.appTitle');
            case 'VoiceCall':
                return t('navigation.voiceCall');
            case 'Room':
                return `${t('navigation.room')} (${route.params?.roomId})`;
            case 'VideoCall':
                return t('navigation.videoCall');
            case 'VideoRoom':
                return `${t('navigation.videoRoom')} (${route.params?.roomId})`;
            case 'VoiceLiveEntry':
                return t('navigation.voiceLive');
            case 'VoiceChatRoom':
                return `${t('navigation.voiceRoom')} (${route.params?.roomId})`;
            case 'VideoLiveEntry':
                return t('navigation.videoLive');
            case 'LiveRoom':
                return `${t('navigation.liveRoom')} (${route.params?.roomId})`;
            default:
                return t('navigation.appTitle');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                {showBack && route.name !== 'Navigation' && (
                    <TouchableOpacity style={styles.backButton} onPress={navigation.goBack}>
                        <Text style={styles.backText}>←</Text>
                    </TouchableOpacity>
                )}
                <Text style={styles.title}>{getTitle()}</Text>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
    },
    header: {
        height: 44,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    backButton: {
        marginRight: 16,
    },
    backText: {
        fontSize: 24,
        color: '#007AFF',
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000',
    },
});

export default Header; 