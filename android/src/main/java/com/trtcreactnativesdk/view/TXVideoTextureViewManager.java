package com.trtcreactnativesdk.view;

import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.tencent.rtmp.ui.TXCloudVideoView;

/**
 * @Description 视频渲染控制器
 */
public class TXVideoTextureViewManager extends SimpleViewManager<TXVideoTextureView> {
    public static final String REACT_CLASS = "TXVideoTextureView";

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
    @ReactProp(name = "renderParams")
    public void setRenderParams(final TXVideoTextureView trtcVideoView, ReadableMap renderParams) {
      trtcVideoView.setRenderParams(renderParams);
    }
    @ReactProp(name = "data")
    public void startView(final TXVideoTextureView trtcVideoView, ReadableMap data) {
      trtcVideoView.startView(data);
    }
}
