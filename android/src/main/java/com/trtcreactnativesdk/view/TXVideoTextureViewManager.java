package com.trtcreactnativesdk.view;

import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.tencent.rtmp.ui.TXCloudVideoView;

/**
 * @Description 视频渲染控制器
 */
public class TXVideoTextureViewManager extends SimpleViewManager<TXVideoTextureView> {
    public static final String REACT_CLASS = "TXVideoTextureView";
    public TXCloudVideoView videoView;

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    protected TXVideoTextureView createViewInstance(ThemedReactContext reactContext) {
        return new TXVideoTextureView(reactContext);
    }
    @Override
    public void onDropViewInstance(TXVideoTextureView trtcVideoView) {
        super.onDropViewInstance(trtcVideoView);
        trtcVideoView.stopPlayView();
    }
    @ReactProp(name = "renderMode")
    public void setRenderMode(final TXVideoTextureView trtcVideoView, int renderMode) {
        trtcVideoView.setRenderMode(renderMode);
    }
    @ReactProp(name = "mirrorMode")
    public void setMirrorMode(final TXVideoTextureView trtcVideoView, int mirrorMode) {
        trtcVideoView.setMirrorMode(mirrorMode);
    }
    @ReactProp(name = "userId")
    public void setUid(final TXVideoTextureView trtcVideoView, final String userId) {
        trtcVideoView.setUid(userId);
    }
}
