import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    ScrollView,
    Dimensions,
    Image,
    Platform,
} from 'react-native';
import { useNavigation, useRoute } from '../navigation/NavigationContext';
import TRTCCloud, {
    TRTCCloudDef,
    TRTCCloudListener,
    TXVideoView,
} from 'trtc-react-native';
import { useTranslation } from 'react-i18next';

interface RemoteUser {
    userId: string;
    isMuted: boolean;
    isVideoAvailable: boolean;
    isAudioAvailable: boolean;
}

interface VideoItem extends RemoteUser {
    isLocal: boolean;
}

const MAX_VIDEOS_PER_PAGE = 4;

const LiveRoom = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { t } = useTranslation();
    const { roomId, userId, role } = route.params as {
        roomId: string;
        userId: string;
        role: number;
    };
    const [isMicOpen, setIsMicOpen] = useState(true);
    const [isCameraOpen, setIsCameraOpen] = useState(true);
    const [isMuted, setIsMuted] = useState(false);
    const [remoteUsers, setRemoteUsers] = useState<RemoteUser[]>([]);
    const trtcCloud = TRTCCloud.sharedInstance();
    const [currentPage, setCurrentPage] = useState(0);
    const windowWidth = Dimensions.get('window').width;
    const [isFrontCamera, setIsFrontCamera] = useState(true);

    // Handle remote users entering room
    const onRtcListener = useCallback((type: TRTCCloudListener, params: any) => {
        if (type === TRTCCloudListener.onRemoteUserEnterRoom) {
            console.log('[LiveRoom] onRemoteUserEnterRoom:', params);
            setRemoteUsers(prevUsers => [
                ...prevUsers,
                {
                    userId: params.userId,
                    isMuted: false,
                    isVideoAvailable: true,
                    isAudioAvailable: false
                }
            ]);
        } else if (type === TRTCCloudListener.onRemoteUserLeaveRoom) {
            console.log('[LiveRoom] onRemoteUserLeaveRoom:', params);
            setRemoteUsers(prevUsers =>
                prevUsers.filter(user => user.userId !== params.userId)
            );
        } else if (type === TRTCCloudListener.onUserVideoAvailable) {
            console.log('[LiveRoom] onUserVideoAvailable:', params);
            setRemoteUsers(prevUsers => {
                // Check if user is still in the list
                if (!prevUsers.some(user => user.userId === params.userId)) {
                    return prevUsers;
                }
                return prevUsers.map(user =>
                    user.userId === params.userId
                        ? { ...user, isVideoAvailable: params.available }
                        : user
                );
            });
        } else if (type === TRTCCloudListener.onUserAudioAvailable) {
            console.log('[LiveRoom] onUserAudioAvailable:', params);
            setRemoteUsers(prevUsers => {
                // Check if user is still in the list
                if (!prevUsers.some(user => user.userId === params.userId)) {
                    return prevUsers;
                }
                return prevUsers.map(user =>
                    user.userId === params.userId
                        ? { ...user, isAudioAvailable: params.available }
                        : user
                );
            });
        }
    }, []);

    // Handle muting a single user
    const handleMuteRemoteUser = async (targetUserId: string) => {
        try {
            const user = remoteUsers.find(u => u.userId === targetUserId);
            if (user) {
                await trtcCloud.muteRemoteAudio(targetUserId, !user.isMuted);
                setRemoteUsers(prevUsers =>
                    prevUsers.map(u =>
                        u.userId === targetUserId
                            ? { ...u, isMuted: !u.isMuted }
                            : u
                    )
                );
            }
        } catch (error: any) {
            Alert.alert(t('common.error'), `${t('common.operationFailed')}: ${error.message || error}`);
        }
    };

    // Handle microphone toggle
    const handleMicToggle = async () => {
        try {
            if (isMicOpen) {
                await trtcCloud.stopLocalAudio();
            } else {
                await trtcCloud.startLocalAudio(TRTCCloudDef.TRTC_AUDIO_QUALITY_DEFAULT);
            }
            setIsMicOpen(!isMicOpen);
        } catch (error: any) {
            Alert.alert(t('common.error'), `${t('common.operationFailed')}: ${error.message || error}`);
        }
    };

    // Handle mute all
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

    // Handle camera switch
    const handleCameraSwitch = async () => {
        try {
            await trtcCloud.getDeviceManager().switchCamera(!isFrontCamera);
            setIsFrontCamera(!isFrontCamera);
        } catch (error: any) {
            Alert.alert(t('common.error'), `${t('common.operationFailed')}: ${error.message || error}`);
        }
    };

    // Handle exit room
    const handleExitRoom = async () => {
        // Directly return, beforeRemove listener will handle exit room logic
        navigation.goBack();
    };

    // Calculate current page's video list
    const getCurrentPageVideos = (): VideoItem[] => {
        const allVideos: VideoItem[] = [
            ...(role === TRTCCloudDef.TRTCRoleAnchor && isCameraOpen ? [{
                userId,
                isLocal: true,
                isMuted: false,
                isVideoAvailable: true,
                isAudioAvailable: true
            }] : []),
            ...remoteUsers.map(user => ({ ...user, isLocal: false }))
        ];

        const startIndex = currentPage * MAX_VIDEOS_PER_PAGE;
        return allVideos.slice(startIndex, startIndex + MAX_VIDEOS_PER_PAGE);
    };

    // Calculate total pages
    const getTotalPages = () => {
        const totalVideos = (role === TRTCCloudDef.TRTCRoleAnchor && isCameraOpen ? 1 : 0) + remoteUsers.length;
        return Math.ceil(totalVideos / MAX_VIDEOS_PER_PAGE);
    };

    useEffect(() => {
        // Register listener
        trtcCloud.registerListener(onRtcListener);

        // If anchor, start local audio
        if (role === TRTCCloudDef.TRTCRoleAnchor) {
            trtcCloud.startLocalAudio(TRTCCloudDef.TRTC_AUDIO_QUALITY_DEFAULT)
                .catch(error => {
                    console.error('[LiveRoom] startLocalAudio failed:', error);
                    setIsMicOpen(false);
                });
        }

        // Add cleanup logic when leaving the page
        const unsubscribe = navigation.addBeforeRemoveListener(async () => {
            try {
                if (role === TRTCCloudDef.TRTCRoleAnchor) {
                    trtcCloud.stopLocalAudio().catch(error => {
                        console.error('[LiveRoom] stopLocalAudio failed:', error);
                    });
                }
                await trtcCloud.exitRoom();
                console.log("Exited live room on back navigation");
            } catch (error) {
                console.error("Failed to exit live room on back navigation:", error);
            }
        });

        // Cleanup on component unmount
        return () => {
            trtcCloud.unRegisterListener(onRtcListener);
            unsubscribe(); // Remove beforeRemove listener
            // Don't call exitRoom on component unmount, because beforeRemove already handled it
        };
    }, [roomId, role, onRtcListener]); // Remove navigation dependency

    return (
        <View style={styles.container}>
            <View style={styles.mainContent}>
                {/* Wait for anchor prompt */}
                {role === TRTCCloudDef.TRTCRoleAudience && remoteUsers.length === 0 && (
                    <View style={styles.waitingContainer}>
                        <Text style={styles.waitingText}>{t('room.waitingAnchor')}</Text>
                    </View>
                )}

                {/* Horizontal scroll layout for videos */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.horizontalScroll}
                    contentContainerStyle={styles.scrollContent}
                >
                    {/* Anchor local view */}
                    {role === TRTCCloudDef.TRTCRoleAnchor && isCameraOpen && (
                        <View style={styles.videoView}>
                            <TXVideoView.LocalView style={styles.video} />
                            <Text style={styles.userLabel}>ID: {userId}{t('chat.operation.me')}</Text>
                            <TouchableOpacity
                                style={styles.cameraSwitchButton}
                                onPress={handleCameraSwitch}
                            >
                                <Text style={styles.cameraSwitchText}>
                                    {isFrontCamera ? t('room.frontCamera') : t('room.backCamera')}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* Remote user views */}
                    {remoteUsers.map(user => (
                        <View key={user.userId} style={styles.videoView}>
                            {user.isVideoAvailable && (
                                <TXVideoView.RemoteView
                                    style={styles.video}
                                    userId={user.userId}
                                    streamType={TRTCCloudDef.TRTC_VIDEO_STREAM_TYPE_BIG}
                                />
                            )}
                            <Text style={styles.userLabel}>ID: {user.userId}</Text>
                            {!user.isAudioAvailable && (
                                <View style={styles.audioOffIndicator}>
                                    <Text style={styles.audioOffText}>{t('chat.operation.micOff')}</Text>
                                </View>
                            )}
                            <TouchableOpacity
                                style={styles.muteButton}
                                onPress={() => handleMuteRemoteUser(user.userId)}
                            >
                                <Text style={styles.muteButtonText}>
                                    {user.isMuted ? t('chat.operation.unmute') : t('chat.operation.mute')}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </ScrollView>
            </View>

            {/* Bottom control buttons (only visible to anchor) */}
            {role === TRTCCloudDef.TRTCRoleAnchor && (
                <View style={styles.controlContainer}>
                    <View style={styles.controlRow}>
                        <TouchableOpacity
                            style={[styles.controlButton, !isMicOpen && styles.controlButtonActive]}
                            onPress={handleMicToggle}
                        >
                            <Text style={styles.controlButtonText}>
                                {isMicOpen ? t('common.closeMic') : t('common.openMic')}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.controlButton, !isCameraOpen && styles.controlButtonActive]}
                            onPress={() => setIsCameraOpen(!isCameraOpen)}
                        >
                            <Text style={styles.controlButtonText}>
                                {isCameraOpen ? t('common.closeCamera') : t('common.openCamera')}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.controlRow}>
                        <TouchableOpacity
                            style={[styles.controlButton, isMuted && styles.controlButtonActive]}
                            onPress={handleMuteToggle}
                        >
                            <Text style={styles.controlButtonText}>
                                {isMuted ? t('chat.operation.unmute') : t('chat.operation.mute')}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.controlButton, styles.exitButton]}
                            onPress={handleExitRoom}
                        >
                            <Text style={styles.controlButtonText}>{t('chat.operation.exit')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    mainContent: {
        flex: 1,
    },
    horizontalScroll: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    videoView: {
        width: 300,
        height: 500,
        margin: 10,
        position: 'relative',
        backgroundColor: '#000',
        borderRadius: 8,
        overflow: 'hidden',
    },
    video: {
        width: '100%',
        height: '100%',
    },
    userLabel: {
        position: 'absolute',
        top: 10,
        left: 10,
        backgroundColor: 'rgba(0,0,0,0.5)',
        color: '#fff',
        padding: 5,
        borderRadius: 4,
    },
    muteButton: {
        position: 'absolute',
        bottom: 10,
        right: 10,
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 5,
        borderRadius: 4,
    },
    muteButtonText: {
        color: '#fff',
        fontSize: 12,
    },
    audioOffIndicator: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -50 }, { translateY: -10 }],
        backgroundColor: 'rgba(0,0,0,0.7)',
        padding: 8,
        borderRadius: 4,
    },
    audioOffText: {
        color: '#fff',
        fontSize: 14,
    },
    cameraSwitchButton: {
        position: 'absolute',
        bottom: 10,
        right: 10,
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 8,
        borderRadius: 4,
    },
    cameraSwitchText: {
        color: '#fff',
        fontSize: 12,
    },
    controlContainer: {
        padding: 15,
        backgroundColor: '#f5f5f5',
    },
    controlRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    controlButton: {
        width: '48%',
        paddingVertical: 12,
        borderRadius: 8,
        backgroundColor: '#007AFF',
        alignItems: 'center',
    },
    controlButtonActive: {
        backgroundColor: '#ff3b30',
    },
    controlButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '500',
    },
    exitButton: {
        backgroundColor: '#ff3b30',
    },
    waitingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        margin: 10,
    },
    waitingText: {
        fontSize: 16,
        color: '#666',
    },
});

export default LiveRoom; 