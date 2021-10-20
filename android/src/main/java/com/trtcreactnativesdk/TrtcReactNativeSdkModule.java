package com.trtcreactnativesdk;
import com.trtcreactnativesdk.listener.CustomTRTCCloudListener;

import androidx.annotation.NonNull;
import android.content.Context;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.module.annotations.ReactModule;
import com.tencent.liteav.audio.TXAudioEffectManager;
import com.tencent.liteav.beauty.TXBeautyManager;
import com.tencent.liteav.device.TXDeviceManager;
import com.tencent.rtmp.TXLog;
import com.tencent.rtmp.ui.TXCloudVideoView;
import com.tencent.trtc.TRTCCloud;
import com.tencent.trtc.TRTCCloudDef;
import com.tencent.trtc.TRTCCloudListener;
import android.widget.Toast;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.Arguments;
import com.google.gson.Gson;

@ReactModule(name = TrtcReactNativeSdkModule.NAME)
public class TrtcReactNativeSdkModule extends ReactContextBaseJavaModule {
    public static final String NAME = "TrtcReactNativeSdk";
    private TRTCCloud trtcCloud;
    private TXDeviceManager txDeviceManager;
    private TXBeautyManager txBeautyManager;
    private TXAudioEffectManager txAudioEffectManager;
    private ReactApplicationContext trtReactContext;
    private static final String TAG = "TRTCCloudRN";
    private CustomTRTCCloudListener trtcListener;
    public TrtcReactNativeSdkModule(ReactApplicationContext reactContext) {
        super(reactContext);
        trtReactContext= reactContext;
        trtcCloud = TRTCCloud.sharedInstance(getReactApplicationContext());
        trtcListener = new CustomTRTCCloudListener(reactContext);
    }

    @Override
    @NonNull
    public String getName() {
        return NAME;
    }

    // Example method
    // See https://reactnative.dev/docs/native-modules-android
    @ReactMethod
    public void sharedInstance(Promise promise) {
      trtcCloud = TRTCCloud.sharedInstance(getReactApplicationContext());
      trtcCloud.setListener(trtcListener);
      promise.resolve(null);
    }
    @ReactMethod
    public void destroySharedInstance(Promise promise) {
      TRTCCloud.destroySharedInstance();
      trtcCloud.setListener(trtcListener);
      trtcCloud = null;
      promise.resolve(null);
    }

    @ReactMethod
    public void getSDKVersion(Promise promise) {
      trtcCloud = TRTCCloud.sharedInstance(getReactApplicationContext());
      String version = trtcCloud.getSDKVersion();
      promise.resolve(version);
    }
    @ReactMethod
    public void enterRoom(ReadableMap params, int scene, Promise promise) {
      trtcCloud = TRTCCloud.sharedInstance(getReactApplicationContext());
      TRTCCloudDef.TRTCParams trtcP = new TRTCCloudDef.TRTCParams();
      trtcP.sdkAppId = params.getInt("sdkAppId");
      trtcP.userId = params.getString("userId");
      trtcP.userSig = params.getString("userSig");
      String roomId = params.getString("roomId");
      trtcP.roomId = (int) (Long.parseLong(roomId) & 0xFFFFFFFF);
      trtcP.strRoomId = params.getString("strRoomId");
      trtcP.role = params.getInt("role");
      trtcP.streamId = params.getString("streamId");
      trtcP.userDefineRecordId = params.getString("userDefineRecordId");
      trtcP.privateMapKey = params.getString("privateMapKey");
      trtcP.businessInfo = params.getString("businessInfo");

      trtcCloud.enterRoom(trtcP, scene);
      promise.resolve(null);
    }
    @ReactMethod
    public void exitRoom(Promise promise) {
      trtcCloud.exitRoom();
      promise.resolve(null);
    }
    @ReactMethod
    public void connectOtherRoom(ReadableMap params, Promise promise) {
      String param = params.getString("param");
      trtcCloud.ConnectOtherRoom(param);
      promise.resolve(null);
    }
    @ReactMethod
    public void disconnectOtherRoom(Promise promise) {
      trtcCloud.DisconnectOtherRoom();
      promise.resolve(null);
    }
    @ReactMethod
    public void switchRole(ReadableMap params, Promise promise) {
      int role = params.getInt("role");
      trtcCloud.switchRole(role);
      promise.resolve(null);
    }
    @ReactMethod
    public void setDefaultStreamRecvMode(ReadableMap params, Promise promise) {
      boolean autoRecvAudioc = params.getBoolean("autoRecvAudio");
      boolean autoRecvVideo = params.getBoolean("autoRecvVideo");
      trtcCloud.setDefaultStreamRecvMode(autoRecvAudioc, autoRecvVideo);
      promise.resolve(null);
    }
    @ReactMethod
    public void switchRoom(ReadableMap params, Promise promise) {
      String config = params.getString("config");
      trtcCloud.switchRoom(new Gson().fromJson(config, TRTCCloudDef.TRTCSwitchRoomConfig.class));
      promise.resolve(null);
    }
    @ReactMethod
    public void startPublishing(ReadableMap params, Promise promise) {
      String streamId = params.getString("streamId");
      int streamType =params.getInt("streamType");
      trtcCloud.startPublishing(streamId, streamType);
      promise.resolve(null);
    }
    /**
     * 停止向腾讯云的直播 CDN 推流
     */
    @ReactMethod
    private void stopPublishing(Promise promise) {
      trtcCloud.stopPublishing();
      promise.resolve(null);
    }

    /**
     * 开始向腾讯云的直播 CDN 推流
     */
    @ReactMethod
    private void startPublishCDNStream(ReadableMap params, Promise promise) {
      String param = params.getString("param");
      trtcCloud.startPublishCDNStream(new Gson().fromJson(param, TRTCCloudDef.TRTCPublishCDNParam.class));
      promise.resolve(null);
    }

    /**
     * 停止向非腾讯云地址转推
     */
    @ReactMethod
    private void stopPublishCDNStream(Promise promise) {
      trtcCloud.stopPublishCDNStream();
      promise.resolve(null);
    }
    /**
     * 设置云端的混流转码参数
     */
    @ReactMethod
    private void setMixTranscodingConfig(String config, Promise promise) {
//      trtcCloud.setMixTranscodingConfig(new Gson().fromJson(config, TRTCCloudDef.TRTCTranscodingConfig.class));
      promise.resolve(null);
    }
    /**
     * 停止本地视频采集及预览
     */
    @ReactMethod
    private void stopLocalPreview(Promise promise) {
      trtcCloud.stopLocalPreview();
      promise.resolve(null);
    }

    /**
     * 停止显示远端视频画面，同时不再拉取该远端用户的视频数据流
     */
    @ReactMethod
    private void stopRemoteView(ReadableMap params, Promise promise) {
      String userId = params.getString("userId");
      int streamType = params.getInt("streamType");
      trtcCloud.stopRemoteView(userId, streamType);
      promise.resolve(null);
    }

    /**
     * 停止显示所有远端视频画面，同时不再拉取远端用户的视频数据流
     */
    @ReactMethod
    private void stopAllRemoteView(Promise promise) {
      trtcCloud.stopAllRemoteView();
      promise.resolve(null);
    }

    /**
     * 静音/取消静音指定的远端用户的声音
     */
    @ReactMethod
    private void muteRemoteAudio(ReadableMap params, Promise promise) {
      String userId = params.getString("userId");
      boolean mute = params.getBoolean("mute");
      trtcCloud.muteRemoteAudio(userId, mute);
      promise.resolve(null);
    }

    /**
     * 静音/取消静音所有用户的声音
     */
    @ReactMethod
    private void muteAllRemoteAudio(ReadableMap params, Promise promise) {
        boolean mute = params.getBoolean("mute");
        trtcCloud.muteAllRemoteAudio(mute);
        promise.resolve(null);
    }

    /**
     * 设置某个远程用户的播放音量
     */
    @ReactMethod
    private void setRemoteAudioVolume(ReadableMap params, Promise promise) {
        String userId = params.getString("userId");
        int volume = params.getInt("volume");
        trtcCloud.setRemoteAudioVolume(userId, volume);
        promise.resolve(null);
    }

    /**
     * 设置 SDK 采集音量。
     */
    @ReactMethod
    private void setAudioCaptureVolume(ReadableMap params, Promise promise) {
        int volume = params.getInt("volume");
        trtcCloud.setAudioCaptureVolume(volume);
        promise.resolve(null);
    }

    /**
     * 获取 SDK 采集音量。
     */
    @ReactMethod
    private void getAudioCaptureVolume(Promise promise) {
      promise.resolve(trtcCloud.getAudioCaptureVolume());
    }

    /**
     * 设置 SDK 播放音量。
     */
    @ReactMethod
    private void setAudioPlayoutVolume(ReadableMap params, Promise promise) {
      int volume = params.getInt("volume");
      trtcCloud.setAudioPlayoutVolume(volume);
      promise.resolve(null);
    }

    /**
     * 获取 SDK 播放音量。
     */
    @ReactMethod
    private void getAudioPlayoutVolume(Promise promise) {
      promise.resolve(trtcCloud.getAudioPlayoutVolume());
    }

    /**
     * 开启本地音频的采集和上行
     */
    @ReactMethod
    private void startLocalAudio(ReadableMap params, Promise promise) {
      int quality = params.getInt("quality");
      trtcCloud.startLocalAudio(quality);
      promise.resolve(null);
    }

    /**
     * 关闭本地音频的采集和上行
     */
    @ReactMethod
    private void stopLocalAudio(Promise promise) {
        trtcCloud.stopLocalAudio();
        promise.resolve(null);
    }
    /**
     * 静音/取消静音本地的音频
     */
    @ReactMethod
    private void muteLocalAudio(ReadableMap params, Promise promise) {
      boolean mute = params.getBoolean("mute");
      trtcCloud.muteLocalAudio(mute);
      promise.resolve(null);
    }
    /**
     * 设置音频路由。
     */
    @ReactMethod
    private void setAudioRoute(ReadableMap params, Promise promise) {
      int route = params.getInt("route");
      trtcCloud.setAudioRoute(route);
      promise.resolve(null);
    }

    /**
     * 启用音量大小提示。
     */
    @ReactMethod
    private void enableAudioVolumeEvaluation(ReadableMap params, Promise promise) {
        int intervalMs = params.getInt("intervalMs");
        trtcCloud.enableAudioVolumeEvaluation(intervalMs);
        promise.resolve(null);
    }

    /**
     * 开始录音。
     */
    @ReactMethod
    private void startAudioRecording(ReadableMap params, Promise promise) {
        String filePath = params.getString("filePath");
        TRTCCloudDef.TRTCAudioRecordingParams recordParam = new TRTCCloudDef.TRTCAudioRecordingParams();
        recordParam.filePath = filePath;
        int value = trtcCloud.startAudioRecording(recordParam);
        promise.resolve(value);
    }

    /**
     * 停止录音。
     */
    @ReactMethod
    private void stopAudioRecording(Promise promise) {
        trtcCloud.stopAudioRecording();
        promise.resolve(null);
    }

    /**
     * 开启本地媒体录制。
     */
    @ReactMethod
    private void startLocalRecording(ReadableMap params, Promise promise) {
      // String param = params.getString("filePath");
      //  trtcCloud.startLocalRecording(
      //           new Gson().fromJson(param, TRTCCloudDef.TRTCLocalRecordingParams.class));
      //   promise.resolve(null);
    }

    /**
     * 停止录制。
     */
    @ReactMethod
    private void stopLocalRecording(ReadableMap params, Promise promise) {
        // trtcCloud.stopLocalRecording();
        // promise.resolve(null);
    }

    /**
     * 设置通话时使用的系统音量类型。
     */
    @ReactMethod
    private void setSystemVolumeType(ReadableMap params, Promise promise) {
        int type = params.getInt("type");
        trtcCloud.setSystemVolumeType(type);
        promise.resolve(null);
    }

    //获取设备管理对象
    @ReactMethod
    private void getDeviceManager(Promise promise) {
      txDeviceManager = trtcCloud.getDeviceManager();
      promise.resolve(null);
    }

    //获取美颜管理对象
    @ReactMethod
    private void getBeautyManager(Promise promise) {
      txBeautyManager = trtcCloud.getBeautyManager();
      promise.resolve(null);
    }

    //获取音效管理类 TXAudioEffectManager
    @ReactMethod
    private void getAudioEffectManager(Promise promise) {
      txAudioEffectManager = trtcCloud.getAudioEffectManager();
      promise.resolve(null);
    }

}
