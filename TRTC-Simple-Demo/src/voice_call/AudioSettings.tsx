import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { useTranslation } from 'react-i18next';

interface AudioSettingsProps {
    visible: boolean;
    onClose: () => void;
    onConfirm: (settings: {
        captureVolume: number;
        playoutVolume: number;
    }) => void;
}

const AudioSettings: React.FC<AudioSettingsProps> = ({ visible, onClose, onConfirm }) => {
    const { t } = useTranslation();
    const [captureVolume, setCaptureVolume] = useState(100);
    const [playoutVolume, setPlayoutVolume] = useState(100);

    const handleConfirm = () => {
        onConfirm({
            captureVolume,
            playoutVolume,
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
                    <Text style={styles.title}>{t('settings.audio.title')}</Text>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>{t('settings.audio.captureVolume')}</Text>
                        <View style={styles.sliderContainer}>
                            <Slider
                                style={styles.slider}
                                minimumValue={0}
                                maximumValue={100}
                                step={1}
                                value={captureVolume}
                                onValueChange={setCaptureVolume}
                                minimumTrackTintColor="#007AFF"
                                maximumTrackTintColor="#d3d3d3"
                                thumbTintColor="#007AFF"
                            />
                            <Text style={styles.sliderValue}>{captureVolume}</Text>
                        </View>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>{t('settings.audio.playoutVolume')}</Text>
                        <View style={styles.sliderContainer}>
                            <Slider
                                style={styles.slider}
                                minimumValue={0}
                                maximumValue={100}
                                step={1}
                                value={playoutVolume}
                                onValueChange={setPlayoutVolume}
                                minimumTrackTintColor="#007AFF"
                                maximumTrackTintColor="#d3d3d3"
                                thumbTintColor="#007AFF"
                            />
                            <Text style={styles.sliderValue}>{playoutVolume}</Text>
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
    buttonText: {
        color: '#333',
    },
});

export default AudioSettings; 