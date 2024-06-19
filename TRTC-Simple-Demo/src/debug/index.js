/*eslint-disable*/

// Attention: do not use the code below in your commercial app. This is because:
//
//            The code may be able to calculate UserSig correctly, but it is only for quick testing of the SDK’s basic features, not for commercial apps.
//            `SECRETKEY` in client code can be easily decompiled and reversed, especially on web.
//             Once your key is disclosed, attackers will be able to steal your Tencent Cloud traffic.
//
//            The correct method is to deploy the `UserSig` calculation code and encryption key on your project server so that your app can request from your server a `UserSig` that is calculated whenever one is needed.
//            Given that it is more difficult to hack a server than a client app, server-end calculation can better protect your key.
//
// Reference: https://trtc.io/document/35166
import { SDKAPPID, SECRETKEY, EXPIRETIME } from './config';
import LibGenerateTestUserSig from './lib-generate-test-usersig.min.js';

// a soft reminder to guide developer to configure sdkAppId/secretKey
if (SDKAPPID === '' || SECRETKEY === '') {
  alert(
    'Please configure your account information first: SDKAPPID and SECRETKEY ' +
      '\r\n\r\nPlease configure your SDKAPPID/SECRETKEY in src/app/config.js'
  );
}

const generator = new LibGenerateTestUserSig(SDKAPPID, SECRETKEY, EXPIRETIME);

export default function getLatestUserSig(userID) {
  const userSig = generator.genTestUserSig(userID);
  return {
    userSig,
    privateMapKey: 255,
  };
}
