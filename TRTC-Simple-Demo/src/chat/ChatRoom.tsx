import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, Image, Platform } from 'react-native';
import { useNavigation, useRoute } from '../navigation/NavigationContext';
import TRTCCloud, {
    TRTCCloudListener,
    TRTCCloudDef,
    TRTCParams,
    TXVideoView,
} from 'trtc-react-native';
import { SDKAPPID } from '../debug/config';
import getLatestUserSig from '../debug/index';
import { useTranslation } from 'react-i18next';

interface UserInfo {
    userId: string;
    isAnchor: boolean;
    isAudioAvailable: boolean;
}

const VoiceChatRoom = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { t } = useTranslation();
    const { roomId, userId, role } = route.params as {
        roomId: string;
        userId: string;
        role: number;
    };
    const [users, setUsers] = useState<UserInfo[]>([]);
    const [isMuted, setIsMuted] = useState(false);
    const [isOnMic, setIsOnMic] = useState(role === TRTCCloudDef.TRTCRoleAnchor);
    const trtcCloud = TRTCCloud.sharedInstance();

    const onRtcListener = useCallback(
        (type: TRTCCloudListener, params: any) => {
            console.log(`[VoiceChatRoom] onRtcListener: ${type}`, params);
            switch (type) {
                case TRTCCloudListener.onRemoteUserEnterRoom:
                    if (params.userId !== userId) {
                        setUsers(prevUsers => [
                            ...prevUsers,
                            { userId: params.userId, isAnchor: true, isAudioAvailable: true }
                        ]);
                    }
                    break;
                case TRTCCloudListener.onRemoteUserLeaveRoom:
                    setUsers(prevUsers =>
                        prevUsers.filter(user => user.userId !== params.userId)
                    );
                    break;
            }
        },
        [userId]
    );

    const handleExitRoom = useCallback(async () => {
        // Directly return, beforeRemove listener will handle exit room logic
        navigation.goBack();
    }, [navigation]);

    useEffect(() => {
        const enterRoom = async () => {
            try {
                const userSig = getLatestUserSig(userId).userSig;
                const params = new TRTCParams({
                    sdkAppId: SDKAPPID,
                    userId,
                    userSig,
                    roomId: Number(roomId),
                    role,
                });

                trtcCloud.registerListener(onRtcListener);
                await trtcCloud.enterRoom(
                    params,
                    TRTCCloudDef.TRTC_APP_SCENE_VOICE_CHATROOM
                );

                if (role === TRTCCloudDef.TRTCRoleAnchor) {
                    setUsers(prevUsers => [
                        ...prevUsers,
                        { userId, isAnchor: true, isAudioAvailable: true }
                    ]);
                    await trtcCloud.startLocalAudio(TRTCCloudDef.TRTC_AUDIO_QUALITY_DEFAULT);
                }
            } catch (error: any) {
                Alert.alert(t('common.error'), `${t('common.enterRoomFailed')}: ${error.message || error}`);
            }
        };

        enterRoom();

        // Add cleanup logic when leaving the page
        const unsubscribe = navigation.addBeforeRemoveListener(async () => {
            try {
                await trtcCloud.exitRoom();
                console.log("Exited chat room on back navigation");
            } catch (error) {
                console.error("Failed to exit chat room on back navigation:", error);
            }
        });

        return () => {
            trtcCloud.unRegisterListener(onRtcListener);
            unsubscribe(); // Remove beforeRemove listener
            // Don't call exitRoom on component unmount, because beforeRemove already handled it
        };
    }, [roomId, userId, role, onRtcListener, t]); // Remove navigation dependency

    const handleMicToggle = async () => {
        try {
            if (isOnMic) {
                await trtcCloud.switchRole(TRTCCloudDef.TRTCRoleAudience);
                await trtcCloud.stopLocalAudio();
                setIsOnMic(false);
                setUsers(prevUsers => prevUsers.filter(user => user.userId !== userId));
            } else {
                await trtcCloud.switchRole(TRTCCloudDef.TRTCRoleAnchor);
                await trtcCloud.startLocalAudio(TRTCCloudDef.TRTC_AUDIO_QUALITY_DEFAULT);
                setIsOnMic(true);
                setUsers(prevUsers => [
                    ...prevUsers,
                    { userId, isAnchor: true, isAudioAvailable: true }
                ]);
            }
        } catch (error: any) {
            Alert.alert(t('common.error'), `${t('common.operationFailed')}: ${error.message || error}`);
        }
    };

    const handleMuteToggle = async () => {
        try {
            if (isMuted) {
                await trtcCloud.muteAllRemoteAudio(false);
            } else {
                await trtcCloud.muteAllRemoteAudio(true);
            }
            setIsMuted(!isMuted);
        } catch (error: any) {
            Alert.alert(t('common.error'), `${t('common.operationFailed')}: ${error.message || error}`);
        }
    };

    // Set up back button handling
    useEffect(() => {
        // Title is now automatically handled by Header component
    }, [roomId]);

    return (
        <View style={styles.container}>
            <View style={styles.micArea}>
                {users.map((user, index) => (
                    <View key={user.userId} style={styles.userItem}>
                        <Image
                            source={require('../../assets/ic_avatar.png')}
                            style={styles.avatar}
                        />
                        <View style={styles.userInfo}>
                            <Text style={styles.userId}>
                                ID: {user.userId}{user.userId === userId ? t('chat.operation.me') : ''}
                            </Text>
                            {!user.isAudioAvailable && (
                                <Text style={styles.audioOffText}>{t('chat.operation.micOff')}</Text>
                            )}
                        </View>
                    </View>
                ))}
            </View>

            <View style={styles.controls}>
                <TouchableOpacity
                    style={[styles.button, isOnMic ? styles.buttonActive : null]}
                    onPress={handleMicToggle}
                >
                    <Text style={styles.buttonText}>
                        {isOnMic ? t('chat.operation.offMic') : t('chat.operation.onMic')}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, isMuted ? styles.buttonActive : null]}
                    onPress={handleMuteToggle}
                >
                    <Text style={styles.buttonText}>
                        {isMuted ? t('chat.operation.unmute') : t('chat.operation.mute')}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, styles.exitButton]}
                    onPress={handleExitRoom}
                >
                    <Text style={styles.buttonText}>{t('chat.operation.exit')}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    micArea: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: 20,
        justifyContent: 'space-around',
    },
    userItem: {
        width: '45%',
        alignItems: 'center',
        marginBottom: 20,
        padding: 10,
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginBottom: 10,
    },
    userInfo: {
        alignItems: 'center',
    },
    userId: {
        fontSize: 14,
        color: '#333',
    },
    audioOffText: {
        fontSize: 12,
        color: '#999',
    },
    controls: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        backgroundColor: '#007AFF',
    },
    buttonActive: {
        backgroundColor: '#ff4d4f',
    },
    exitButton: {
        backgroundColor: '#666',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default VoiceChatRoom; 