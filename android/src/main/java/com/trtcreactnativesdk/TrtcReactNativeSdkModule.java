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

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.widget.Toast;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.Arguments;
import com.google.gson.Gson;

import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;

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
      trtcCloud = null;
      promise.resolve(null);
    }

    @ReactMethod
    public void getSDKVersion(Promise promise) {
      String version = trtcCloud.getSDKVersion();
      promise.resolve(version);
    }
    @ReactMethod
    public void enterRoom(ReadableMap params, int scene, Promise promise) {
      trtcCloud.callExperimentalAPI("{\"api\": \"setFramework\", \"params\": {\"framework\": 22}}");
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
    /**
     * 设置云端的混流转码参数
     */
    @ReactMethod
    private void setMixTranscodingConfig(ReadableMap params, Promise promise) {
      String config = params.getString("config");
      System.out.println(config);
      trtcCloud.setMixTranscodingConfig(new Gson().fromJson(config, TRTCCloudDef.TRTCTranscodingConfig.class));
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
     * 暂停/恢复推送本地的视频数据
     */
    @ReactMethod
    private void muteLocalVideo(ReadableMap params, Promise promise) {
      boolean mute = params.getBoolean( "mute");
      trtcCloud.muteLocalVideo(mute);
      promise.resolve(null);
    }

  /**
   * 设置暂停推送本地视频时要推送的图片
   */
  @ReactMethod
  private void setVideoMuteImage(ReadableMap params, Promise promise) {
    final String imageUrl = params.getString("imageUrl");
    final int fps = params.getInt( "fps");
    if (imageUrl.equals("")) {
      trtcCloud.setVideoMuteImage(null, fps);
    } else {
        new Thread() {
          @Override
          public void run() {
            try {
              URL url = new URL(imageUrl);
              HttpURLConnection connection = (HttpURLConnection) url.openConnection();
              connection.setDoInput(true);
              connection.connect();
              InputStream input = connection.getInputStream();
              Bitmap myBitmap = BitmapFactory.decodeStream(input);
              trtcCloud.setVideoMuteImage(myBitmap, fps);
            } catch (IOException e) {
              TXLog.e(TAG, "|method=setVideoMuteImage|error=" + e);
            }
          }
        }.start();
    }
    promise.resolve(null);
  }

  /**
   * 添加水印
   */
  @ReactMethod
  private void setWatermark(ReadableMap params, Promise promise) {
    final String imageUrl = params.getString("imageUrl");
    final int streamType = params.getInt("streamType");
    String xStr = params.getString("x");
    final float x = Float.parseFloat(xStr);
    String yStr = params.getString("y");
    final float y = Float.parseFloat(yStr);
    String widthStr = params.getString("width");
    final float width = Float.parseFloat(widthStr);
    new Thread() {
      @Override
      public void run() {
        try {
          URL url = new URL(imageUrl);
          HttpURLConnection connection = (HttpURLConnection) url.openConnection();
          connection.setDoInput(true);
          connection.connect();
          InputStream input = connection.getInputStream();
          Bitmap myBitmap = BitmapFactory.decodeStream(input);
          trtcCloud.setWatermark(myBitmap, streamType, x, y, width);
        } catch (IOException e) {
          TXLog.e(TAG,"|method=setWatermark|error=" + e);
        }
      }
    }.start();
    promise.resolve(null);
  }

    /**
     * 暂停/恢复接收指定的远端视频流
     */
    @ReactMethod
    private void muteRemoteVideoStream(ReadableMap params, Promise promise) {
      String userId = params.getString("userId");
      boolean mute = params.getBoolean("mute");
      trtcCloud.muteRemoteVideoStream(userId, mute);
      promise.resolve(null);
    }

    /**
     * 暂停/恢复接收所有远端视频流
     */
    @ReactMethod
    private void muteAllRemoteVideoStreams(ReadableMap params, Promise promise) {
      boolean mute = params.getBoolean("mute");
      trtcCloud.muteAllRemoteVideoStreams(mute);
      promise.resolve(null);
    }

    /**
     * 设置视频编码器相关参数
     * 该设置决定了远端用户看到的画面质量（同时也是云端录制出的视频文件的画面质量）
     */
    @ReactMethod
    private void setVideoEncoderParam(ReadableMap params, Promise promise) {
      String param = params.getString("param");
      trtcCloud.setVideoEncoderParam(new Gson().fromJson(param, TRTCCloudDef.TRTCVideoEncParam.class));
      promise.resolve(null);
    }

    /**
     * 设置网络流控相关参数。
     * 该设置决定 SDK 在各种网络环境下的调控策略（例如弱网下选择“保清晰”或“保流畅”）
     */
    @ReactMethod
    private void setNetworkQosParam(ReadableMap params, Promise promise) {
      String param = params.getString("param");
      trtcCloud.setNetworkQosParam(new Gson().fromJson(param, TRTCCloudDef.TRTCNetworkQosParam.class));
      promise.resolve(null);
    }

    /**
     * 设置视频编码输出的画面方向，即设置远端用户观看到的和服务器录制的画面方向
     */
    @ReactMethod
    private void setVideoEncoderRotation(ReadableMap params, Promise promise) {
      int rotation = params.getInt("rotation");
      trtcCloud.setVideoEncoderRotation(rotation);
      promise.resolve(null);
    }

    /**
     * 设置编码器输出的画面镜像模式。
     */
    @ReactMethod
    private void setVideoEncoderMirror(ReadableMap params, Promise promise) {
      boolean mirror = params.getBoolean("mirror");
      trtcCloud.setVideoEncoderMirror(mirror);
      promise.resolve(null);
    }

    /**
     * 设置重力感应的适应模式。
     */
    @ReactMethod
    private void setGSensorMode(ReadableMap params, Promise promise) {
      int mode = params.getInt("mode");
      trtcCloud.setGSensorMode(mode);
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

    /**
     * 开始进行网络测速（视频通话期间请勿测试，以免影响通话质量）
     */
    @ReactMethod
    private void startSpeedTest(ReadableMap params, Promise promise) {
      int sdkAppId = params.getInt("sdkAppId");
      String userId = params.getString("userId");
      String userSig = params.getString("userSig");
      trtcCloud.startSpeedTest(sdkAppId, userId, userSig);
      promise.resolve(null);
    }

    /**
     * 停止服务器测速
     */
    @ReactMethod
    private void stopSpeedTest(Promise promise) {
      trtcCloud.stopSpeedTest();
      promise.resolve(null);
    }

    /**
     * 设置 Log 输出级别
     */
    @ReactMethod
    private void setLogLevel(ReadableMap params, Promise promise) {
      int level = params.getInt("level");
      trtcCloud.setLogLevel(level);
      promise.resolve(null);
    }

    /**
     * 启用或禁用控制台日志打印
     */
    @ReactMethod
    private void setConsoleEnabled(ReadableMap params, Promise promise) {
      boolean enabled = params.getBoolean("enabled");
      TRTCCloud.setConsoleEnabled(enabled);
      promise.resolve(null);
    }

    /**
     * 修改日志保存路径
     */
    @ReactMethod
    private void setLogDirPath(ReadableMap params, Promise promise) {
      String path = params.getString("path");
      TRTCCloud.setLogDirPath(path);
      promise.resolve(null);
    }

    /**
     * 启用或禁用 Log 的本地压缩。
     */
    @ReactMethod
    private void setLogCompressEnabled(ReadableMap params, Promise promise) {
      boolean enabled = params.getBoolean("enabled");
      TRTCCloud.setLogCompressEnabled(enabled);
      promise.resolve(null);
    }

    /**
     * 启用或禁用 Log 的本地压缩。
     */
    @ReactMethod
    private void callExperimentalAPI(ReadableMap params, Promise promise) {
      String jsonStr = params.getString("jsonStr");
      trtcCloud.callExperimentalAPI(jsonStr);
      promise.resolve(null);
    }

    /**
     * 开启耳返
     */
    @ReactMethod
    private void enableVoiceEarMonitor(ReadableMap params, Promise promise) {
      boolean enable = params.getBoolean("enable");
      txAudioEffectManager.enableVoiceEarMonitor(enable);
      promise.resolve(null);
    }

  /**
   * 设置耳返音量。
   */
  @ReactMethod
  private void setVoiceEarMonitorVolume(ReadableMap params, Promise promise) {
    int volume = params.getInt("volume");
    txAudioEffectManager.setVoiceEarMonitorVolume(volume);
    promise.resolve(null);
  }

  /**
   * 设置人声的混响效果（KTV、小房间、大会堂、低沉、洪亮...）
   */
  @ReactMethod
  private void setVoiceReverbType(ReadableMap params, Promise promise) {
    int type = params.getInt("type");
    TXAudioEffectManager.TXVoiceReverbType reverbType =
      TXAudioEffectManager.TXVoiceReverbType.TXLiveVoiceReverbType_0;
    switch (type) {
      case 0:
        reverbType = TXAudioEffectManager.TXVoiceReverbType.TXLiveVoiceReverbType_0;
        break;
      case 1:
        reverbType = TXAudioEffectManager.TXVoiceReverbType.TXLiveVoiceReverbType_1;
        break;
      case 2:
        reverbType = TXAudioEffectManager.TXVoiceReverbType.TXLiveVoiceReverbType_2;
        break;
      case 3:
        reverbType = TXAudioEffectManager.TXVoiceReverbType.TXLiveVoiceReverbType_3;
        break;
      case 4:
        reverbType = TXAudioEffectManager.TXVoiceReverbType.TXLiveVoiceReverbType_4;
        break;
      case 5:
        reverbType = TXAudioEffectManager.TXVoiceReverbType.TXLiveVoiceReverbType_5;
        break;
      case 6:
        reverbType = TXAudioEffectManager.TXVoiceReverbType.TXLiveVoiceReverbType_6;
        break;
      case 7:
        reverbType = TXAudioEffectManager.TXVoiceReverbType.TXLiveVoiceReverbType_7;
        break;
      default:
        reverbType = TXAudioEffectManager.TXVoiceReverbType.TXLiveVoiceReverbType_0;
        break;
    }
    txAudioEffectManager.setVoiceReverbType(reverbType);
    promise.resolve(null);
  }

  /**
   * 设置人声的变声特效（萝莉、大叔、重金属、外国人...）
   */
  @ReactMethod
  private void setVoiceChangerType(ReadableMap params, Promise promise) {
    int type = params.getInt("type");
    TXAudioEffectManager.TXVoiceChangerType changerType =
      TXAudioEffectManager.TXVoiceChangerType.TXLiveVoiceChangerType_0;
    switch (type) {
      case 0:
        changerType = TXAudioEffectManager.TXVoiceChangerType.TXLiveVoiceChangerType_0;
        break;
      case 1:
        changerType = TXAudioEffectManager.TXVoiceChangerType.TXLiveVoiceChangerType_1;
        break;
      case 2:
        changerType = TXAudioEffectManager.TXVoiceChangerType.TXLiveVoiceChangerType_2;
        break;
      case 3:
        changerType = TXAudioEffectManager.TXVoiceChangerType.TXLiveVoiceChangerType_3;
        break;
      case 4:
        changerType = TXAudioEffectManager.TXVoiceChangerType.TXLiveVoiceChangerType_4;
        break;
      case 5:
        changerType = TXAudioEffectManager.TXVoiceChangerType.TXLiveVoiceChangerType_5;
        break;
      case 6:
        changerType = TXAudioEffectManager.TXVoiceChangerType.TXLiveVoiceChangerType_6;
        break;
      case 7:
        changerType = TXAudioEffectManager.TXVoiceChangerType.TXLiveVoiceChangerType_7;
        break;
      case 8:
        changerType = TXAudioEffectManager.TXVoiceChangerType.TXLiveVoiceChangerType_8;
        break;
      case 9:
        changerType = TXAudioEffectManager.TXVoiceChangerType.TXLiveVoiceChangerType_9;
        break;
      case 10:
        changerType = TXAudioEffectManager.TXVoiceChangerType.TXLiveVoiceChangerType_10;
        break;
      case 11:
        changerType = TXAudioEffectManager.TXVoiceChangerType.TXLiveVoiceChangerType_11;
        break;
      default:
        changerType = TXAudioEffectManager.TXVoiceChangerType.TXLiveVoiceChangerType_0;
        break;
    }
    txAudioEffectManager.setVoiceChangerType(changerType);
    promise.resolve(null);
  }
  /**
   * 设置麦克风采集人声的音量
   */
  @ReactMethod
  private void setVoiceCaptureVolume(ReadableMap params, Promise promise) {
    int volume = params.getInt("volume");
    txAudioEffectManager.setVoiceCaptureVolume(volume);
    promise.resolve(null);
  }

  /**
   * 设置背景音乐的播放进度回调接口
   */
  @ReactMethod
  private void setMusicObserver(ReadableMap params, Promise promise) {
    int id = params.getInt("id");
    txAudioEffectManager.setMusicObserver(id, new TXAudioEffectManager.TXMusicPlayObserver() {
      @Override
      public void onStart(int i, int i1) {
        trtcListener.onMusicObserverStart(i, i1);
      }

      @Override
      public void onPlayProgress(int i, long l, long l1) {
        trtcListener.onMusicObserverPlayProgress(i, l,l1);
      }

      @Override
      public void onComplete(int i, int i1) {
        trtcListener.onMusicObserverComplete(i, i1);
      }
    });
    promise.resolve(null);
  }


  /**
   * 开始播放背景音乐
   */
  @ReactMethod
  private void startPlayMusic(ReadableMap params, Promise promise) {
    String musicParam = params.getString(  "musicParam");
    TXAudioEffectManager.AudioMusicParam audioMusicParam =
      new Gson().fromJson(musicParam, TXAudioEffectManager.AudioMusicParam.class);
    boolean isSuccess = txAudioEffectManager.startPlayMusic(audioMusicParam);
    promise.resolve(isSuccess);
    txAudioEffectManager.setMusicObserver(audioMusicParam.id, new TXAudioEffectManager.TXMusicPlayObserver() {
      @Override
      public void onStart(int i, int i1) {
        trtcListener.onMusicObserverStart(i, i1);
      }

      @Override
      public void onPlayProgress(int i, long l, long l1) {
        trtcListener.onMusicObserverPlayProgress(i, l,l1);
      }

      @Override
      public void onComplete(int i, int i1) {
        trtcListener.onMusicObserverComplete(i, i1);
      }
    });
  }

  /**
   * 停止播放背景音乐
   */
  @ReactMethod
  private void stopPlayMusic(ReadableMap params, Promise promise) {
    int id = params.getInt("id");
    txAudioEffectManager.stopPlayMusic(id);
    promise.resolve(null);
  }

  /**
   * 暂停播放背景音乐
   */
  @ReactMethod
  private void pausePlayMusic(ReadableMap params, Promise promise) {
    int id = params.getInt("id");
    txAudioEffectManager.pausePlayMusic(id);
    promise.resolve(null);
  }

  /**
   * 恢复播放背景音乐
   */
  @ReactMethod
  private void resumePlayMusic(ReadableMap params, Promise promise) {
    int id = params.getInt("id");
    txAudioEffectManager.resumePlayMusic(id);
    promise.resolve(null);
  }

  /**
   * 设置背景音乐的远端音量大小，即主播可以通过此接口设置远端观众能听到的背景音乐的音量大小。
   */
  @ReactMethod
  private void setMusicPublishVolume(ReadableMap params, Promise promise) {
    int id = params.getInt("id");
    int volume = params.getInt("volume");
    txAudioEffectManager.setMusicPublishVolume(id, volume);
    promise.resolve(null);
  }

  /**
   * 设置背景音乐的本地音量大小，即主播可以通过此接口设置主播自己本地的背景音乐的音量大小。
   */
  @ReactMethod
  private void setMusicPlayoutVolume(ReadableMap params, Promise promise) {
    int id = params.getInt("id");
    int volume = params.getInt("volume");
    txAudioEffectManager.setMusicPlayoutVolume(id, volume);
    promise.resolve(null);
  }

  /**
   * 设置全局背景音乐的本地和远端音量的大小
   */
  @ReactMethod
  private void setAllMusicVolume(ReadableMap params, Promise promise) {
    int volume = params.getInt("volume");
    txAudioEffectManager.setAllMusicVolume(volume);
    promise.resolve(null);
  }

  /**
   * 调整背景音乐的音调高低
   */
  @ReactMethod
  private void setMusicPitch(ReadableMap params, Promise promise) {
    int id = params.getInt("id");
    String pitchParam = params.getString("pitch");
    float pitch = Float.parseFloat(pitchParam);
    txAudioEffectManager.setMusicPitch(id, pitch);
    promise.resolve(null);
  }

  /**
   * 调整背景音乐的变速效果
   */
  @ReactMethod
  private void setMusicSpeedRate(ReadableMap params, Promise promise) {
    int id = params.getInt("id");
    String speedRateParam = params.getString("speedRate");
    float speedRate = Float.parseFloat(speedRateParam);
    txAudioEffectManager.setMusicSpeedRate(id, speedRate);
    promise.resolve(null);
  }

  /**
   * 获取背景音乐当前的播放进度（单位：毫秒）
   */
  @ReactMethod
  private void getMusicCurrentPosInMS(ReadableMap params, Promise promise) {
    int id = params.getInt("id");
    long time = txAudioEffectManager.getMusicCurrentPosInMS(id);
    promise.resolve(String.valueOf(time));
  }

  /**
   * 设置背景音乐的播放进度（单位：毫秒）
   */
  @ReactMethod
  private void seekMusicToPosInMS(ReadableMap params, Promise promise) {
    int id = params.getInt("id");
    int pts = params.getInt("pts");
    txAudioEffectManager.seekMusicToPosInMS(id, pts);
    promise.resolve(null);
  }

  /**
   * 获取景音乐文件的总时长（单位：毫秒）
   */
  @ReactMethod
  private void getMusicDurationInMS(ReadableMap params, Promise promise) {
    String path = params.getString("path");
    long time = txAudioEffectManager.getMusicDurationInMS(path);
    promise.resolve(String.valueOf(time));
  }

  /**
   * 设置美颜类型
   */
  @ReactMethod
  private void setBeautyStyle(ReadableMap params, Promise promise) {
    int beautyStyle = params.getInt("beautyStyle");
    txBeautyManager.setBeautyStyle(beautyStyle);
    promise.resolve(null);
  }
  /**
   * 设置指定素材滤镜特效
   */
  @ReactMethod
  private void setFilter(ReadableMap params, Promise promise) {
    final String imageUrl = params.getString("imageUrl");
      new Thread() {
        @Override
        public void run() {
          try {
            URL url = new URL(imageUrl);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setDoInput(true);
            connection.connect();
            InputStream input = connection.getInputStream();
            Bitmap myBitmap = BitmapFactory.decodeStream(input);
            txBeautyManager.setFilter(myBitmap);
          } catch (IOException e) {
            TXLog.e(TAG,"|method=setFilter|error=" + e);
          }
        }
      }.start();
    promise.resolve(null);
  }

  /**
   * 设置滤镜浓度
   */
  @ReactMethod
  private void setFilterStrength(ReadableMap params, Promise promise) {
    String strength = params.getString("strength");
    float strengthFloat = Float.parseFloat(strength);
    txBeautyManager.setFilterStrength(strengthFloat);
    promise.resolve(null);
  }

  /**
   * 设置美颜级别
   */
  @ReactMethod
  private void setBeautyLevel(ReadableMap params, Promise promise) {
    int beautyLevel = params.getInt("beautyLevel");
    txBeautyManager.setBeautyLevel(beautyLevel);
    promise.resolve(null);
  }

  /**
   * 设置美白级别
   */
  @ReactMethod
  private void setWhitenessLevel(ReadableMap params, Promise promise) {
    int whitenessLevel = params.getInt("whitenessLevel");
    txBeautyManager.setWhitenessLevel(whitenessLevel);
    promise.resolve(null);
  }

  /**
   * 开启清晰度增强
   */
  @ReactMethod
  private void enableSharpnessEnhancement(ReadableMap params, Promise promise) {
    boolean enable = params.getBoolean("enable");
    txBeautyManager.enableSharpnessEnhancement(enable);
    promise.resolve(null);
  }

  /**
   * 设置红润级别
   */
  @ReactMethod
  private void setRuddyLevel(ReadableMap params, Promise promise) {
    int ruddyLevel = params.getInt("ruddyLevel");
    txBeautyManager.setRuddyLevel(ruddyLevel);
    promise.resolve(null);
  }
}
