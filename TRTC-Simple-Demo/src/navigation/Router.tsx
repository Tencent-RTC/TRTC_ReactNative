import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRoute } from './NavigationContext';
import Header from './Header';
import Navigation from '../Navigation';
import VoiceCall from '../voice_call/VoiceCallEntry';
import Room from '../voice_call/VoiceCall';
import VideoCall from '../video_call/VideoCallEntry';
import VideoRoom from '../video_call/VideoCall';
import VoiceLiveEntry from '../chat/ChatRoomEntry';
import VoiceChatRoom from '../chat/ChatRoom';
import VideoLiveEntry from '../live/LiveRoomEntry';
import LiveRoom from '../live/LiveRoom';

const Router: React.FC = () => {
    const route = useRoute();

    const renderContent = () => {
        switch (route.name) {
            case 'Navigation':
                return <Navigation />;
            case 'VoiceCall':
                return <VoiceCall />;
            case 'Room':
                return <Room />;
            case 'VideoCall':
                return <VideoCall />;
            case 'VideoRoom':
                return <VideoRoom />;
            case 'VoiceLiveEntry':
                return <VoiceLiveEntry />;
            case 'VoiceChatRoom':
                return <VoiceChatRoom />;
            case 'VideoLiveEntry':
                return <VideoLiveEntry />;
            case 'LiveRoom':
                return <LiveRoom />;
            default:
                return <Navigation />;
        }
    };

    return (
        <View style={styles.container}>
            <Header />
            <View style={styles.content}>
                {renderContent()}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        flex: 1,
    },
});

export default Router; 