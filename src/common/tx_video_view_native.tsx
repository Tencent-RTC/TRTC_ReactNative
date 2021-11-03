import React, { Component } from 'react';
import { Platform, requireNativeComponent, ViewProps } from 'react-native';
import { TRTCCloudDef } from '../trtc_cloud_def';

export interface TXVideoViewProps {
  userId: string;
  viewType?: number;
  streamType: number;
}

interface TXRenderViewProps {
  data: { userId: string; streamType: number };
}

/**
 * @ignore
 */
const TXSurfaceView = requireNativeComponent<TXRenderViewProps>('TXVideoView');

/**
 * @ignore
 */
export class RtcVideoView extends Component<ViewProps & TXVideoViewProps, {}> {
  render() {
    const { viewType, userId, streamType, ...otherProps } = this.props;
    if (
      Platform.OS === 'android' &&
      viewType === TRTCCloudDef.TRTC_VideoView_TextureView
    ) {
      return <TXTextureView data={{ userId, streamType }} {...otherProps} />;
    } else {
      return <TXSurfaceView data={{ userId, streamType }} {...otherProps} />;
    }
  }
}

/**
 * @ignore
 */
const TXTextureView =
  requireNativeComponent<TXRenderViewProps>('TXVideoTextureView');
