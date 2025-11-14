import React from 'react';
import { Platform, PermissionsAndroid } from 'react-native';
import { useTranslation } from 'react-i18next';
import './i18n';

import { NavigationProvider } from './navigation/NavigationContext';
import Router from './navigation/Router';

function App(): React.JSX.Element {
  const { t } = useTranslation();

  async function initInfo() {
    if (Platform.OS === 'android') {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS
          .RECORD_AUDIO as 'android.permission.RECORD_AUDIO',
        PermissionsAndroid.PERMISSIONS.CAMERA as 'android.permission.CAMERA',
      ]);
      console.log('platform android');
    }
  }

  React.useEffect(() => {
    initInfo();
  }, []);

  return (
    <NavigationProvider>
      <Router />
    </NavigationProvider>
  );
}

export default App;
