import React, { useState, useCallback, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '../navigation/NavigationContext';
import TRTCCloud, { TRTCCloudDef, TRTCParams, TRTCCloudListener } from 'trtc-react-native';
import { SDKAPPID } from '../debug/config';
import getLatestUserSig from '../debug/index';
import { useTranslation } from 'react-i18next';

const VideoCall = () => {
    const [roomId, setRoomId] = useState('');
    const [userId, setUserId] = useState('');
    const navigation = useNavigation();
    const listenerRegistered = useRef(false); // Flag to track if listener is registered
    const { t } = useTranslation();

    // Define listener callback
    const onRtcListener = useCallback((type: TRTCCloudListener, params: any) => {
        const trtcCloud = TRTCCloud.sharedInstance();
        if (type === TRTCCloudListener.onEnterRoom) {
            console.log('[VideoCall] onEnterRoom received:', params);
            if (listenerRegistered.current) {
                trtcCloud.unRegisterListener(onRtcListener);
                listenerRegistered.current = false;
                console.log('[VideoCall] Listener unregistered in onEnterRoom');
            }

            if (params.result > 0) {
                // Navigate to video room page (VideoRoom)
                navigation.navigate('VideoRoom', { roomId, userId, type: 'video' });
            } else {
                Alert.alert(t('common.error'), `${t('common.enterRoomFailed')} (${params.result})`);
            }
        }
    }, [navigation, roomId, userId, t]);

    const handleEnterRoom = async () => {
        if (!roomId || !userId) {
            Alert.alert(t('common.tip'), t('common.inputRequired'));
            return;
        }

        const trtcCloud = TRTCCloud.sharedInstance();

        if (listenerRegistered.current) {
            console.log('[VideoCall] Listener already registered, skipping.');
            return; // Prevent duplicate click handling
        }

        try {
            console.log('[VideoCall] Registering listener...');
            trtcCloud.registerListener(onRtcListener);
            listenerRegistered.current = true;

            const userSig = getLatestUserSig(userId).userSig;
            const params = new TRTCParams({
                sdkAppId: SDKAPPID,
                userId,
                userSig,
                roomId: Number(roomId),
            });

            console.log('[VideoCall] Calling enterRoom with VIDEO_CALL scene...');
            // Use TRTC_APP_SCENE_VIDEOCALL scene
            await trtcCloud.enterRoom(params, TRTCCloudDef.TRTC_APP_SCENE_VIDEOCALL);
            console.log('[VideoCall] enterRoom called successfully (async)');

        } catch (error: any) {
            console.error('[VideoCall] enterRoom failed:', error);
            if (listenerRegistered.current) {
                trtcCloud.unRegisterListener(onRtcListener);
                listenerRegistered.current = false;
                console.log('[VideoCall] Listener unregistered in catch block');
            }
            Alert.alert(t('common.error'), `${t('common.enterRoomFailed')}: ${error.message || error}`);
        }
    };

    // Handle component unmount
    useEffect(() => {
        return () => {
            if (listenerRegistered.current) {
                console.log('[VideoCall] Unregistering listener on component unmount');
                const trtcCloud = TRTCCloud.sharedInstance();
                trtcCloud.unRegisterListener(onRtcListener);
                listenerRegistered.current = false;
            }
        };
    }, [onRtcListener]);

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.label}>{t('chat.roomId')}</Text>
                <TextInput
                    style={styles.input}
                    value={roomId}
                    onChangeText={setRoomId}
                    placeholder={t('chat.roomId')}
                    keyboardType="numeric"
                />

                <Text style={styles.label}>{t('chat.userId')}</Text>
                <TextInput
                    style={styles.input}
                    value={userId}
                    onChangeText={setUserId}
                    placeholder={t('chat.userId')}
                />

                <TouchableOpacity style={styles.button} onPress={handleEnterRoom}>
                    <Text style={styles.buttonText}>{t('chat.enterRoom')}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

// Styles (same as VoiceCall.tsx, consider extracting common styles)
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        padding: 20,
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
        color: '#333',
    },
    input: {
        height: 40,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 4,
        paddingHorizontal: 10,
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default VideoCall; 