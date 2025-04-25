import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { TRTCCloudDef } from 'trtc-react-native';
import { useTranslation } from 'react-i18next';

interface VideoSettingsProps {
    visible: boolean;
    onClose: () => void;
    onConfirm: (settings: {
        resolution: number;
        fps: number;
        mirror: boolean;
    }) => void;
}

const resolutions = [
    { label: '360p', value: TRTCCloudDef.TRTC_VIDEO_RESOLUTION_640_360 },
    { label: '540p', value: TRTCCloudDef.TRTC_VIDEO_RESOLUTION_960_540 },
    { label: '720p', value: TRTCCloudDef.TRTC_VIDEO_RESOLUTION_1280_720 },
    { label: '1080p', value: TRTCCloudDef.TRTC_VIDEO_RESOLUTION_1920_1080 },
];

const VideoSettings: React.FC<VideoSettingsProps> = ({ visible, onClose, onConfirm }) => {
    const { t } = useTranslation();
    const [selectedResolution, setSelectedResolution] = useState(TRTCCloudDef.TRTC_VIDEO_RESOLUTION_1280_720);
    const [fps, setFps] = useState(15);
    const [mirror, setMirror] = useState(true);

    const handleConfirm = () => {
        onConfirm({
            resolution: selectedResolution,
            fps,
            mirror,
        });
        onClose();
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <View style={styles.content}>
                    <Text style={styles.title}>{t('settings.title')}</Text>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>{t('settings.resolution')}</Text>
                        <View style={styles.resolutionContainer}>
                            {resolutions.map((res) => (
                                <TouchableOpacity
                                    key={res.value}
                                    style={[
                                        styles.resolutionButton,
                                        selectedResolution === res.value && styles.selectedButton,
                                    ]}
                                    onPress={() => setSelectedResolution(res.value)}
                                >
                                    <Text style={[
                                        styles.buttonText,
                                        selectedResolution === res.value && styles.selectedText,
                                    ]}>
                                        {res.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>{t('settings.frameRate')}</Text>
                        <View style={styles.sliderContainer}>
                            <Slider
                                style={styles.slider}
                                minimumValue={10}
                                maximumValue={24}
                                step={1}
                                value={fps}
                                onValueChange={setFps}
                                minimumTrackTintColor="#007AFF"
                                maximumTrackTintColor="#d3d3d3"
                                thumbTintColor="#007AFF"
                            />
                            <Text style={styles.sliderValue}>{fps} {t('settings.fps')}</Text>
                        </View>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>{t('settings.mirror')}</Text>
                        <View style={styles.switchContainer}>
                            <Text style={styles.switchText}>
                                {mirror ? t('settings.mirrorOn') : t('settings.mirrorOff')}
                            </Text>
                            <TouchableOpacity
                                style={[
                                    styles.switch,
                                    mirror && styles.switchOn,
                                ]}
                                onPress={() => setMirror(!mirror)}
                            >
                                <View style={[
                                    styles.switchThumb,
                                    mirror && styles.switchThumbOn,
                                ]} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[styles.button, styles.cancelButton]}
                            onPress={onClose}
                        >
                            <Text style={styles.buttonText}>{t('common.cancel')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, styles.confirmButton]}
                            onPress={handleConfirm}
                        >
                            <Text style={styles.buttonText}>{t('common.confirm')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    content: {
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 10,
    },
    resolutionContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    resolutionButton: {
        width: '48%',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
        backgroundColor: '#f0f0f0',
        alignItems: 'center',
    },
    selectedButton: {
        backgroundColor: '#007AFF',
    },
    buttonText: {
        color: '#333',
    },
    selectedText: {
        color: '#fff',
    },
    sliderContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    slider: {
        flex: 1,
        height: 40,
    },
    sliderValue: {
        width: 50,
        textAlign: 'right',
        marginLeft: 10,
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    switchText: {
        fontSize: 16,
        color: '#333',
    },
    switch: {
        width: 50,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#e0e0e0',
        justifyContent: 'center',
        paddingHorizontal: 2,
    },
    switchOn: {
        backgroundColor: '#007AFF',
    },
    switchThumb: {
        width: 26,
        height: 26,
        borderRadius: 13,
        backgroundColor: '#fff',
    },
    switchThumbOn: {
        alignSelf: 'flex-end',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    button: {
        flex: 1,
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginHorizontal: 5,
    },
    cancelButton: {
        backgroundColor: '#f0f0f0',
    },
    confirmButton: {
        backgroundColor: '#007AFF',
    },
});

export default VideoSettings; 