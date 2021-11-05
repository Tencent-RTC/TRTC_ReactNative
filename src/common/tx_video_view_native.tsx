import React, { Component } from 'react';
import { Platform, requireNativeComponent, ViewProps } from 'react-native';
import { TRTCCloudDef } from '../trtc_cloud_def';

export interface TXVideoViewProps {
  userId: string;
  viewType?: number;
  streamType: number;
  mirror?: boolean;
}

interface TXRenderViewProps {
  data: { userId: string; streamType: number };
}

interface TRTCRenderParams {
  renderParams?: {
    rotation: number;
    fillMode: number;
    mirrorType: number;
    streamType: number;
    userId: string;
  };
}

/**
 * @ignore
 */
const TXSurfaceView = requireNativeComponent<
  TXRenderViewProps & TRTCRenderParams
>('TXVideoView');

/**
 * @ignore
 */
export class RtcVideoView extends Component<ViewProps & TXVideoViewProps, {}> {
  render() {
    const { viewType, userId, streamType, ...otherProps } = this.props;
    // @ts-ignore
    let renderParams = this.props.renderParams;
    if (renderParams) {
      if (!renderParams.fillMode) {
        renderParams.fillMode = TRTCCloudDef.TRTC_VIDEO_RENDER_MODE_FILL;
      }
      if (!renderParams.rotation) {
        renderParams.rotation = TRTCCloudDef.TRTC_VIDEO_ROTATION_0;
      }
      if (!renderParams.mirrorType) {
        renderParams.mirrorType = TRTCCloudDef.TRTC_VIDEO_MIRROR_TYPE_AUTO;
      }
      renderParams.streamType = streamType;
      renderParams.userId = userId;
    }
    if (
      Platform.OS === 'android' &&
      viewType === TRTCCloudDef.TRTC_VideoView_TextureView
    ) {
      return (
        <TXTextureView
          data={{ userId, streamType }}
          renderParams={renderParams}
          {...otherProps}
        />
      );
    } else {
      return (
        <TXSurfaceView
          data={{ userId, streamType }}
          renderParams={renderParams}
          {...otherProps}
        />
      );
    }
  }
}

/**
 * @ignore
 */
const TXTextureView = requireNativeComponent<
  TXRenderViewProps & TRTCRenderParams
>('TXVideoTextureView');
