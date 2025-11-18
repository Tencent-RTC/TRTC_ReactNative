import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '../navigation/NavigationContext';
import TRTCCloud, { TRTCCloudDef, TRTCParams } from 'trtc-react-native';
import { SDKAPPID } from '../debug/config';
import getLatestUserSig from '../debug/index';
import { useTranslation } from 'react-i18next';

const VoiceCall = () => {
    const [roomId, setRoomId] = useState('');
    const [userId, setUserId] = useState('');
    const navigation = useNavigation();
    const { t } = useTranslation();

    const handleEnterRoom = async () => {
        if (!roomId || !userId) {
            Alert.alert(t('common.tip'), t('common.inputRequired'));
            return;
        }

        const trtcCloud = TRTCCloud.sharedInstance();

        try {
            const userSig = getLatestUserSig(userId).userSig;
            const params = new TRTCParams({
                sdkAppId: SDKAPPID,
                userId,
                userSig,
                roomId: Number(roomId),
            });

            console.log('[VoiceCallEntry] Calling enterRoom...');
            await trtcCloud.enterRoom(params, TRTCCloudDef.TRTC_APP_SCENE_VIDEOCALL);
            console.log('[VoiceCallEntry] enterRoom success, navigating to Room');
            navigation.navigate('Room', { roomId, userId, type: 'voice' });
        } catch (error: any) {
            console.error('[VoiceCallEntry] enterRoom failed:', error);
            Alert.alert(t('common.error'), `${t('common.enterRoomFailed')}: ${error?.message || error}`);
        }
    };

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

export default VoiceCall; 