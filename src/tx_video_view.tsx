import { requireNativeComponent } from 'react-native';
import React, { memo } from 'react';
import PropTypes from 'prop-types';

const TXVideoView = requireNativeComponent('TXVideoView');
// export default TXVideoView;

const TXLocalView = memo((props) => {
  return <TXVideoView {...props} />;
});

export default TXLocalView;
