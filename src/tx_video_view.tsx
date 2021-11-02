import React, { Component } from 'react';
import type { ViewProps } from 'react-native';

import { RtcVideoView } from './common/tx_video_view_native';

export interface TXRemoteViewProps {
  userId: string;
  type?: number;
}

export interface TXLocalViewProps {
  type?: number;
}

/**
 * 本地视频渲染器，不需要传用户id
 */
class LocalView extends Component<ViewProps & TXLocalViewProps, {}> {
  render() {
    return <RtcVideoView {...this.props} userId="" />;
  }
}

/**
 * 远端视频渲染器，需要传用户id
 */
class RemoteView extends Component<ViewProps & TXRemoteViewProps, {}> {
  render() {
    return <RtcVideoView {...this.props} />;
  }
}

export default {
  LocalView,
  RemoteView,
};
