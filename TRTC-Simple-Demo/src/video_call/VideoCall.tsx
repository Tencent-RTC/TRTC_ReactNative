import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    Text,
    Dimensions,
    Alert
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import TRTCCloud, {
    TRTCCloudListener,
    TRTCCloudDef,
    TXVideoView,
} from 'trtc-react-native';
import VideoSettings from './VideoSettings';
import { useTranslation } from 'react-i18next';

interface RemoteUser {
    userId: string;
    videoAvailable: boolean;
}

const { width } = Dimensions.get('window');
const REMOTE_VIEW_WIDTH = Math.floor(width / 3) - 20; // 每行显示约3个远端视图

const VideoRoom = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { t } = useTranslation();
    const { roomId, userId: localUserId } = route.params as {
        roomId: string;
        userId: string;
    };

    const [remoteUsers, setRemoteUsers] = useState<RemoteUser[]>([]);
    const [isFrontCamera, setIsFrontCamera] = useState(true);
    const [isMicOpen, setIsMicOpen] = useState(true);
    const [isEarpiece, setIsEarpiece] = useState(false); // 默认扬声器
    const [settingsVisible, setSettingsVisible] = useState(false);

    // --- RTC Listeners --- (使用 useCallback 优化)
    const onRtcListener = useCallback((type: TRTCCloudListener, params: any) => {
        if (type === TRTCCloudListener.onRemoteUserEnterRoom) {
            setRemoteUsers((prev) => [
                ...prev,
                { userId: params.userId, videoAvailable: false }, // 初始视频不可用
            ]);
        } else if (type === TRTCCloudListener.onRemoteUserLeaveRoom) {
            setRemoteUsers((prev) =>
                prev.filter((user) => user.userId !== params.userId)
            );
        } else if (type === TRTCCloudListener.onUserVideoAvailable) {
            setRemoteUsers((prev) => {
                // 检查用户是否还在列表中
                if (!prev.some(user => user.userId === params.userId)) {
                    return prev;
                }
                return prev.map((user) =>
                    user.userId === params.userId
                        ? { ...user, videoAvailable: params.available }
                        : user
                );
            });
        }
    }, []);

    const exitRoom = async () => {
        const trtcCloud = TRTCCloud.sharedInstance();
        try {
            trtcCloud.stopLocalAudio();
            await trtcCloud.exitRoom();
            console.log('[VideoRoom] exitRoom success');
        } catch (err) {
            console.error('[VideoRoom] exitRoom failed:', err);
            throw err;
        }
    };

    const handleHangup = async () => {
        try {
            await exitRoom();
            navigation.goBack();
        } catch (err) {
            Alert.alert(t('common.error'), t('common.exitRoomFailed'));
        }
    };

    useEffect(() => {
        const trtcCloud = TRTCCloud.sharedInstance();

        // 启动本地音视频
        trtcCloud.startLocalAudio(TRTCCloudDef.TRTC_AUDIO_QUALITY_DEFAULT)
            .then(() => console.log('[VideoRoom] startLocalAudio success'))
            .catch((error) => console.error('[VideoRoom] startLocalAudio failed:', error));
        trtcCloud.getDeviceManager().isFrontCamera().then(isFront => {
            console.log('[VideoRoom] Camera initial state - isFront:', isFront);
            setIsFrontCamera(isFront);
        });


        // 注册监听器
        trtcCloud.registerListener(onRtcListener);

        // 处理导航返回
        const unsubscribeNav = navigation.addListener('beforeRemove', async () => {
            console.log('[VideoRoom] Navigating back...');
            try {
                await exitRoom();
            } catch (err) {
                console.error('[VideoRoom] exitRoom failed on back nav:', err);
            }
        });

        return () => {
            console.log('[VideoRoom] Cleaning up...');
            const trtcCloud = TRTCCloud.sharedInstance();
            trtcCloud.unRegisterListener(onRtcListener);
            unsubscribeNav();

            // 只在组件卸载时（非导航返回）调用 exitRoom
            if (!navigation.isFocused()) {
                exitRoom().catch(err => {
                    console.error('[VideoRoom] exitRoom failed on unmount:', err);
                });
            }
        };
    }, [navigation, onRtcListener]);

    // --- Button Handlers ---
    const handleCameraSwitch = async () => {
        const trtcCloud = TRTCCloud.sharedInstance();
        try {
            await trtcCloud.getDeviceManager().switchCamera(!isFrontCamera);
            setIsFrontCamera(!isFrontCamera);
            console.log('[VideoRoom] Switched camera');
        } catch (error) {
            console.error('[VideoRoom] switchCamera failed:', error);
            Alert.alert(t('common.error'), t('room.switchCamera'));
        }
    };

    const handleMicToggle = async () => {
        const trtcCloud = TRTCCloud.sharedInstance();
        try {
            await trtcCloud.muteLocalAudio(isMicOpen);
            setIsMicOpen(!isMicOpen);
            console.log(`[VideoRoom] Mic ${!isMicOpen ? 'ON' : 'OFF'}`);
        } catch (error) {
            console.error('[VideoRoom] muteLocalAudio failed:', error);
            Alert.alert(t('common.error'), t('room.switchMic'));
        }
    };

    const handleAudioRouteToggle = async () => {
        const trtcCloud = TRTCCloud.sharedInstance();
        try {
            const targetRoute = isEarpiece
                ? TRTCCloudDef.TRTC_AUDIO_ROUTE_SPEAKER
                : TRTCCloudDef.TRTC_AUDIO_ROUTE_EARPIECE;
            await trtcCloud.getDeviceManager().setAudioRoute(targetRoute);
            setIsEarpiece(!isEarpiece);
            console.log(`[VideoRoom] Audio route set to ${!isEarpiece ? 'Earpiece' : 'Speaker'}`);
        } catch (error) {
            console.error('[VideoRoom] setAudioRoute failed:', error);
            Alert.alert(t('common.error'), t('room.switchAudioRoute'));
        }
    };

    const handleSettingsConfirm = async (settings: {
        resolution: number;
        fps: number;
        mirror: boolean;
    }) => {
        const trtcCloud = TRTCCloud.sharedInstance();
        try {
            const videoBitrate = getVideoBitrate(settings.resolution);
            await trtcCloud.setVideoEncoderParam({
                videoFps: settings.fps,
                videoResolution: settings.resolution,
                minVideoBitrate: 0,
                enableAdjustRes: false,
                videoResolutionMode: TRTCCloudDef.TRTC_VIDEO_RESOLUTION_MODE_PORTRAIT,
                videoBitrate,
            });
            await trtcCloud.setVideoEncoderMirror(settings.mirror);
        } catch (error) {
            console.error('[VideoRoom] setVideoEncoderParam failed:', error);
            Alert.alert(t('common.error'), t('room.setVideoParams'));
        }
    };

    const getVideoBitrate = (resolution: number): number => {
        switch (resolution) {
            case TRTCCloudDef.TRTC_VIDEO_RESOLUTION_640_360:
                return 800;
            case TRTCCloudDef.TRTC_VIDEO_RESOLUTION_960_540:
                return 900;
            case TRTCCloudDef.TRTC_VIDEO_RESOLUTION_1280_720:
                return 1250;
            case TRTCCloudDef.TRTC_VIDEO_RESOLUTION_1920_1080:
                return 1900;
            default:
                return 1250;
        }
    };

    // --- Render ---
    return (
        <SafeAreaView style={styles.container}>
            {/* 本地视频视图 */}
            <View style={styles.localViewContainer}>
                <TXVideoView.LocalView style={styles.localVideo} />
                <Text style={styles.userIdText}>{localUserId} {t('chat.operation.me')}</Text>
                <TouchableOpacity
                    style={styles.settingsButton}
                    onPress={() => setSettingsVisible(true)}
                >
                    <Text style={styles.settingsButtonText}>{t('room.videoSettings')}</Text>
                </TouchableOpacity>
            </View>

            {/* 远端视频区域 - 条件渲染 */}
            <View style={styles.remoteAreaContainer}>
                {remoteUsers.length > 0 ? (
                    <ScrollView
                        horizontal
                        style={styles.remoteViewScroll}
                        contentContainerStyle={styles.remoteViewContainer}
                        showsHorizontalScrollIndicator={false}
                    >
                        {remoteUsers.map((user) =>
                            user.videoAvailable ? (
                                <View key={user.userId} style={styles.remoteViewItem}>
                                    <TXVideoView.RemoteView
                                        style={styles.remoteVideo}
                                        userId={user.userId}
                                        streamType={TRTCCloudDef.TRTC_VIDEO_STREAM_TYPE_BIG}
                                    />
                                    <Text style={styles.userIdText}>{user.userId}</Text>
                                </View>
                            ) : (
                                <View key={user.userId} style={[styles.remoteViewItem, styles.placeholderView]}>
                                    <Text style={styles.placeholderText}>{user.userId}\n({t('room.videoUnavailable')})</Text>
                                </View>
                            )
                        )}
                    </ScrollView>
                ) : (
                    <View style={styles.noRemoteUsersContainer}>
                        <Text style={styles.noRemoteUsersText}>
                            {t('room.waitingOthers')}
                        </Text>
                    </View>
                )}
            </View>

            {/* 控制按钮 */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[
                        styles.button,
                        !isFrontCamera && styles.buttonActive
                    ]}
                    onPress={handleCameraSwitch}
                >
                    <Text style={styles.buttonText}>
                        {isFrontCamera ? t('room.backCamera') : t('room.frontCamera')}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.button,
                        !isMicOpen && styles.micButtonActive
                    ]}
                    onPress={handleMicToggle}
                >
                    <Text style={styles.buttonText}>
                        {isMicOpen ? t('room.muteMic') : t('room.unmuteMic')}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.button,
                        isEarpiece && styles.audioButtonActive
                    ]}
                    onPress={handleAudioRouteToggle}
                >
                    <Text style={styles.buttonText}>
                        {isEarpiece ? t('room.speaker') : t('room.earpiece')}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.button, styles.hangupButton]}
                    onPress={handleHangup}
                >
                    <Text style={styles.buttonText}>{t('room.hangup')}</Text>
                </TouchableOpacity>
            </View>

            <VideoSettings
                visible={settingsVisible}
                onClose={() => setSettingsVisible(false)}
                onConfirm={handleSettingsConfirm}
            />
        </SafeAreaView>
    );
};

// --- Styles ---
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#222', // 深色背景
    },
    localViewContainer: {
        flex: 1, // 占据大部分空间
        position: 'relative',
    },
    localVideo: {
        flex: 1,
    },
    remoteAreaContainer: {
        maxHeight: REMOTE_VIEW_WIDTH + 40,
        backgroundColor: '#333',
        justifyContent: 'center',
        alignItems: 'center',
    },
    remoteViewScroll: {
        width: '100%',
        paddingVertical: 10,
    },
    remoteViewContainer: {
        paddingHorizontal: 10,
        alignItems: 'center',
    },
    remoteViewItem: {
        width: REMOTE_VIEW_WIDTH,
        height: REMOTE_VIEW_WIDTH,
        marginHorizontal: 5,
        backgroundColor: '#444',
        borderRadius: 8,
        overflow: 'hidden',
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
    },
    remoteVideo: {
        width: '100%',
        height: '100%',
    },
    placeholderView: {
        backgroundColor: '#555',
    },
    placeholderText: {
        color: '#ccc',
        fontSize: 12,
        textAlign: 'center',
    },
    userIdText: {
        position: 'absolute',
        bottom: 5,
        left: 5,
        backgroundColor: 'rgba(0,0,0,0.5)',
        color: 'white',
        fontSize: 10,
        paddingHorizontal: 4,
        paddingVertical: 2,
        borderRadius: 3,
    },
    noRemoteUsersContainer: {
        height: REMOTE_VIEW_WIDTH + 40,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    noRemoteUsersText: {
        color: '#888',
        fontSize: 14,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 15,
        paddingHorizontal: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.3)', // 半透明背景
    },
    button: {
        padding: 10,
        borderRadius: 25,
        backgroundColor: '#007AFF',
        minWidth: 60,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonActive: {
        backgroundColor: '#0055CC', // 深蓝色，用于后置摄像头
    },
    micButtonActive: {
        backgroundColor: '#999999', // 灰色，用于麦克风关闭
    },
    audioButtonActive: {
        backgroundColor: '#66B3FF', // 浅蓝色，用于听筒模式
    },
    hangupButton: {
        backgroundColor: '#ff3b30',
    },
    buttonText: {
        color: '#fff',
        fontSize: 12,
    },
    settingsButton: {
        position: 'absolute',
        bottom: 10,
        right: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 8,
        borderRadius: 4,
    },
    settingsButtonText: {
        color: '#fff',
        fontSize: 12,
    },
});

export default VideoRoom; 