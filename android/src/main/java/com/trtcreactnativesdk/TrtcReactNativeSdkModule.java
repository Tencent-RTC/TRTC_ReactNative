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

@ReactModule(name = TrtcReactNativeSdkModule.NAME)
public class TrtcReactNativeSdkModule extends ReactContextBaseJavaModule {
    public static final String NAME = "TrtcReactNativeSdk";
    private TRTCCloud trtcCloud;
    private ReactApplicationContext trtReactContext;
    private static final String TAG = "TRTCCloudRN";
    private CustomTRTCCloudListener trtcListener;
    public TrtcReactNativeSdkModule(ReactApplicationContext reactContext) {
        super(reactContext);
        trtReactContext= reactContext;
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
    public void test(Promise promise) {
      trtcCloud = TRTCCloud.sharedInstance(getReactApplicationContext());
      String version = trtcCloud.getSDKVersion();
      Toast.makeText(getReactApplicationContext(), version, 50000).show();
      promise.resolve(version);
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
      trtcP.roomId = params.getInt("roomId");
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
    public void invokeMethod(String method, ReadableMap arguments,Promise promise) {
        //TXLog.i(TAG, "|method=" + method+ "|arguments=" + arguments);
        promise.resolve(method +"----"+ arguments.getString("a"));
        WritableMap params = Arguments.createMap();
        params.putString("eventProperty", "someValue");
        sendEvent("EventReminder", params);
    }

    private void sendEvent(String eventName,WritableMap params) {
        trtReactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, params);
    }

    public static native int nativeMultiply(int a, int b);
    public static native String test();
    public static native void invokeMethod(String method, ReadableMap arguments);
}
