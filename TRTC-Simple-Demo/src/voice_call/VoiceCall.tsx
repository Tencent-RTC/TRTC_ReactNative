import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, Image, Platform } from 'react-native';
import { useNavigation, useRoute } from '../navigation/NavigationContext';
import TRTCCloud, {
    TRTCCloudListener,
    TRTCCloudDef,
} from 'trtc-react-native';
import AudioSettings from './AudioSettings';
import { useTranslation } from 'react-i18next';

interface User {
    userId: string;
    volume?: number;
    networkQuality?: any;
}

const Room = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { t } = useTranslation();
    const { roomId, userId: localUserId } = route.params as {
        roomId: string;
        userId: string;
    };
    const [users, setUsers] = useState<User[]>([
        { userId: localUserId, volume: 0, networkQuality: undefined },
    ]);
    const [isEarpiece, setIsEarpiece] = useState(false);
    const [isMicOpen, setIsMicOpen] = useState(true);
    const [settingsVisible, setSettingsVisible] = useState(false);

    const getNetworkQualityLabel = useCallback((quality?: any): string => {
        if (quality === undefined || quality === null) return t('room.networkQuality.unknown');
        switch (quality.quality) {
            case TRTCCloudDef.TRTC_QUALITY_Excellent:
                return t('room.networkQuality.excellent');
            case TRTCCloudDef.TRTC_QUALITY_Good:
                return t('room.networkQuality.good');
            case TRTCCloudDef.TRTC_QUALITY_Poor:
                return t('room.networkQuality.poor');
            case TRTCCloudDef.TRTC_QUALITY_Bad:
                return t('room.networkQuality.bad');
            case TRTCCloudDef.TRTC_QUALITY_Vbad:
                return t('room.networkQuality.vbad');
            case TRTCCloudDef.TRTC_QUALITY_Down:
                return t('room.networkQuality.down');
            case TRTCCloudDef.TRTC_QUALITY_UNKNOWN:
            default:
                return t('room.networkQuality.unknown');
        }
    }, [t]);

    const onRtcListener = useCallback((type: TRTCCloudListener, params: any) => {
        if (type === TRTCCloudListener.onRemoteUserEnterRoom) {
            setUsers(prev => [...prev, { userId: params.userId, volume: 0, networkQuality: undefined }]);
        } else if (type === TRTCCloudListener.onRemoteUserLeaveRoom) {
            setUsers(prev => prev.filter(user => user.userId !== params.userId));
        } else if (type === TRTCCloudListener.onUserVoiceVolume) {
            const userVolumes = params.userVolumes as Array<{ userId: string; volume: number }>;
            if (!userVolumes) {
                console.warn('onUserVoiceVolume received invalid params:', params);
                return;
            }

            const volumeMap = new Map<string, number>();
            userVolumes.forEach((item: { userId: string; volume: number }) => {
                volumeMap.set(item.userId === '' ? localUserId : item.userId, item.volume);
            });

            setUsers((prevUsers) =>
                prevUsers.map((user) => ({
                    ...user,
                    volume: volumeMap.get(user.userId) ?? user.volume,
                }))
            );
        } else if (type === TRTCCloudListener.onNetworkQuality) {
            const networkMap = new Map<string, any>();
            networkMap.set(localUserId, params.localQuality);
            params.remoteQuality.forEach((item: any) => {
                networkMap.set(item.userId, item);
            });

            setUsers((prevUsers) =>
                prevUsers.map((user) => ({
                    ...user,
                    networkQuality: networkMap.get(user.userId) ?? user.networkQuality,
                }))
            );
        }
    }, [localUserId]);

    useEffect(() => {
        const trtcCloud = TRTCCloud.sharedInstance();

        trtcCloud.enableAudioVolumeEvaluation(300);

        trtcCloud.startLocalAudio(TRTCCloudDef.TRTC_AUDIO_QUALITY_DEFAULT).catch(error => {
            console.error("Failed to start local audio:", error);
            setIsMicOpen(false);
        });

        trtcCloud.registerListener(onRtcListener);

        // Add cleanup logic when leaving the page
        const unsubscribe = navigation.addBeforeRemoveListener(async () => {
            const trtcCloud = TRTCCloud.sharedInstance();
            try {
                trtcCloud.stopLocalAudio().catch(error => {
                    console.error("Failed to stop local audio on back navigation:", error);
                });
                trtcCloud.enableAudioVolumeEvaluation(0);
                await trtcCloud.exitRoom();
                console.log("Exited room on back navigation");
            } catch (error) {
                console.error("Failed to exit room on back navigation:", error);
            }
        });

        return () => {
            const trtcCloud = TRTCCloud.sharedInstance();
            trtcCloud.stopLocalAudio().catch(error => {
                console.error("Failed to stop local audio on component unmount:", error);
            });
            trtcCloud.enableAudioVolumeEvaluation(0);
            trtcCloud.unRegisterListener(onRtcListener);
            unsubscribe(); // Remove beforeRemove listener
            // Don't call exitRoom on component unmount, because beforeRemove already handled it
        };
    }, [onRtcListener]); // Remove navigation dependency

    const handleEarpiece = async () => {
        const trtcCloud = TRTCCloud.sharedInstance();
        const deviceManager = trtcCloud.getDeviceManager();
        try {
            if (isEarpiece) {
                await deviceManager.setAudioRoute(TRTCCloudDef.TRTC_AUDIO_ROUTE_SPEAKER);
                setIsEarpiece(false);
            } else {
                await deviceManager.setAudioRoute(TRTCCloudDef.TRTC_AUDIO_ROUTE_EARPIECE);
                setIsEarpiece(true);
            }
        } catch (error) {
            console.error("Failed to set audio route:", error);
            Alert.alert(t('common.error'), t('room.switchAudioRoute'));
        }
    };

    const handleMic = async () => {
        const trtcCloud = TRTCCloud.sharedInstance();
        try {
            if (isMicOpen) {
                await trtcCloud.stopLocalAudio();
            } else {
                await trtcCloud.startLocalAudio(TRTCCloudDef.TRTC_AUDIO_QUALITY_DEFAULT);
            }
            setIsMicOpen(!isMicOpen);
        } catch (error) {
            console.error("Failed to toggle microphone:", error);
            Alert.alert(t('common.error'), t('room.switchMic'));
        }
    };

    const handleHangup = () => {
        // Directly return, beforeRemove listener will handle exit room logic
        navigation.goBack();
    };

    const handleSettingsConfirm = async (settings: {
        captureVolume: number;
        playoutVolume: number;
    }) => {
        const trtcCloud = TRTCCloud.sharedInstance();
        try {
            await trtcCloud.setAudioCaptureVolume(settings.captureVolume);
            await trtcCloud.setAudioPlayoutVolume(settings.playoutVolume);
        } catch (error) {
            console.error("Failed to set audio volumes:", error);
            Alert.alert(t('common.error'), t('room.setAudioVolumeFailed'));
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.membersContainer}>
                <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.membersList}
                >
                    {users.map((user) => (
                        <View key={user.userId} style={styles.memberItem}>
                            <Image
                                source={require('../../assets/ic_avatar.png')}
                                style={styles.avatar}
                            />
                            <Text style={styles.userId}>{user.userId}</Text>
                        </View>
                    ))}
                </ScrollView>
            </View>

            <View style={styles.infoPanel}>
                <Text style={styles.panelTitle}>{t('room.statusPanel')}</Text>
                <ScrollView style={styles.infoList}>
                    {users.map((user) => (
                        <View key={user.userId} style={styles.infoItem}>
                            <Text style={styles.infoUserId}>{user.userId}:</Text>
                            <View style={styles.infoDetails}>
                                <Text style={styles.infoText}>
                                    {t('room.volume')}: {user.volume ?? '-'}
                                </Text>
                                <Text style={styles.infoText}>
                                    {t('room.network')}: {getNetworkQualityLabel(user.networkQuality)}
                                </Text>
                            </View>
                        </View>
                    ))}
                </ScrollView>
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={handleEarpiece}
                >
                    <Text style={styles.buttonText}>
                        {isEarpiece ? t('room.useSpeaker') : t('room.useEarpiece')}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.button, !isMicOpen && styles.buttonActive]}
                    onPress={handleMic}
                >
                    <Text style={styles.buttonText}>
                        {isMicOpen ? t('common.closeMic') : t('common.openMic')}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => setSettingsVisible(true)}
                >
                    <Text style={styles.buttonText}>{t('room.audioSettings')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.button, styles.hangupButton]}
                    onPress={handleHangup}
                >
                    <Text style={styles.buttonText}>{t('room.hangup')}</Text>
                </TouchableOpacity>
            </View>

            <AudioSettings
                visible={settingsVisible}
                onClose={() => setSettingsVisible(false)}
                onConfirm={handleSettingsConfirm}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f4f4',
    },
    membersContainer: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        minHeight: 120,
    },
    membersList: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    memberItem: {
        alignItems: 'center',
        marginRight: 15,
        width: 70,
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginBottom: 5,
        backgroundColor: '#ddd',
    },
    userId: {
        fontSize: 12,
        color: '#333',
        textAlign: 'center',
    },
    infoPanel: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
        marginTop: 10,
    },
    panelTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#333',
    },
    infoList: {
        flex: 1,
    },
    infoItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    infoUserId: {
        fontSize: 14,
        fontWeight: '500',
        color: '#555',
        flexShrink: 1,
        marginRight: 10,
    },
    infoDetails: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    infoText: {
        fontSize: 14,
        color: '#666',
        marginLeft: 15,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        backgroundColor: '#fff',
        flexWrap: 'wrap',
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 20,
        backgroundColor: '#007AFF',
        minWidth: 90,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 5,
    },
    buttonActive: {
        backgroundColor: '#aaa',
    },
    hangupButton: {
        backgroundColor: '#FF3B30',
    },
    buttonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '500',
    },
});

export default Room; 