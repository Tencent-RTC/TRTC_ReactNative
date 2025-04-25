import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { TRTCCloudDef } from 'trtc-react-native';
import { useTranslation } from 'react-i18next';

type RootStackParamList = {
    VoiceChatRoom: { roomId: string; userId: string; role: number };
};

type NavigationProp = StackNavigationProp<
    RootStackParamList,
    'VoiceChatRoom'
>;

const VoiceLiveEntry = () => {
    const [roomId, setRoomId] = useState('');
    const [userId, setUserId] = useState('');
    const [isAnchor, setIsAnchor] = useState(true); // 默认选择主播
    const navigation = useNavigation<NavigationProp>();
    const { t } = useTranslation();

    const handleEnterRoom = () => {
        if (!roomId || !userId) {
            Alert.alert(t('common.tip'), t('common.inputRequired'));
            return;
        }

        const role = isAnchor
            ? TRTCCloudDef.TRTCRoleAnchor
            : TRTCCloudDef.TRTCRoleAudience;

        navigation.navigate('VoiceChatRoom', {
            roomId,
            userId,
            role,
        });
    };

    return (
        <SafeAreaView style={styles.container}>
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
        </SafeAreaView>
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