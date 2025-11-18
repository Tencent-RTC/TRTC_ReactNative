import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { useNavigation } from '../navigation/NavigationContext';
import TRTCCloud, { TRTCCloudDef, TRTCParams } from 'trtc-react-native';
import { SDKAPPID } from '../debug/config';
import getLatestUserSig from '../debug/index';
import { useTranslation } from 'react-i18next';

const VoiceLiveEntry = () => {
    const [roomId, setRoomId] = useState('');
    const [userId, setUserId] = useState('');
    const [isAnchor, setIsAnchor] = useState(true); // Default to anchor
    const navigation = useNavigation();
    const { t } = useTranslation();

    const handleEnterRoom = async () => {
        if (!roomId || !userId) {
            Alert.alert(t('common.tip'), t('common.inputRequired'));
            return;
        }

        if (!SDKAPPID) {
            Alert.alert(t('common.error'), t('common.sdkAppIdRequired'));
            return;
        }

        const trtcCloud = TRTCCloud.sharedInstance();
        const role = isAnchor
            ? TRTCCloudDef.TRTCRoleAnchor
            : TRTCCloudDef.TRTCRoleAudience;

        try {
            const userSig = getLatestUserSig(userId).userSig;
            const params = new TRTCParams({
                sdkAppId: SDKAPPID,
                userId,
                userSig,
                roomId: Number(roomId),
                role,
            });

            console.log('[ChatRoomEntry] Calling enterRoom...');
            await trtcCloud.enterRoom(params, TRTCCloudDef.TRTC_APP_SCENE_VOICE_CHATROOM);
            console.log('[ChatRoomEntry] enterRoom success, navigating to VoiceChatRoom');

            navigation.navigate('VoiceChatRoom', {
                roomId,
                userId,
                role,
            });
        } catch (error: any) {
            console.error('[ChatRoomEntry] enterRoom failed:', error);
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

                {/* Role selection */}
                <View style={styles.roleSelectorContainer}>
                    <Text style={styles.roleLabel}>{t('chat.role.label')}</Text>
                    <TouchableOpacity
                        style={[styles.roleButton, isAnchor && styles.roleButtonActive]}
                        onPress={() => setIsAnchor(true)}
                    >
                        <Text style={[styles.roleButtonText, isAnchor && styles.roleButtonTextActive]}>
                            {t('chat.role.anchor')}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.roleButton, !isAnchor && styles.roleButtonActive]}
                        onPress={() => setIsAnchor(false)}
                    >
                        <Text style={[styles.roleButtonText, !isAnchor && styles.roleButtonTextActive]}>
                            {t('chat.role.audience')}
                        </Text>
                    </TouchableOpacity>
                </View>

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
    roleSelectorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 25,
        marginTop: 5,
    },
    roleLabel: {
        fontSize: 16,
        marginRight: 15,
        color: '#333',
    },
    roleButton: {
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderWidth: 1,
        borderColor: '#007AFF',
        borderRadius: 20,
        marginHorizontal: 5,
    },
    roleButtonActive: {
        backgroundColor: '#007AFF',
    },
    roleButtonText: {
        color: '#007AFF',
        fontSize: 14,
    },
    roleButtonTextActive: {
        color: '#fff',
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default VoiceLiveEntry; 