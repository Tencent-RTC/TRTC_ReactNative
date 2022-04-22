/*eslint-disable*/
/**
 * Module:   GenerateTestUserSig
 *
 * Description: generates UserSig for testing. UserSig is a security signature designed by Tencent Cloud for its cloud services.
 *           It is calculated based on `SDKAppID`, `UserID`, and `EXPIRETIME` using the HMAC-SHA256 encryption algorithm.
 *
 * Attention: do not use the code below in your commercial app. This is because:
 *
 *            The code may be able to calculate UserSig correctly, but it is only for quick testing of the SDK’s basic features, not for commercial apps.
 *            `SECRETKEY` in client code can be easily decompiled and reversed, especially on web.
 *             Once your key is disclosed, attackers will be able to steal your Tencent Cloud traffic.
 *
 *            The correct method is to deploy the `UserSig` calculation code and encryption key on your project server so that your app can request from your server a `UserSig` that is calculated whenever one is needed.
 *           Given that it is more difficult to hack a server than a client app, server-end calculation can better protect your key.
 *
 * Reference: https://cloud.tencent.com/document/product/647/17275#Server
 */
const SDKAPPID = 0;

/**
 * Signature validity period, which should not be set too short
 * <p>
 * Unit: second
 * Default value: 604800 (7 days)
 */
const EXPIRETIME = 604800;

/**
 * Follow the steps below to obtain the key required for UserSig calculation.
 *
 * Step 1. Log in to the [TRTC console](https://console.cloud.tencent.com/rav), and create an application if you don’t have one.
 * Step 2. Find your application, click “Application Info”, and click the “Quick Start” tab.
 * Step 3. Copy and paste the key to the code, as shown below.
 *
 * Note: this method is for testing only. Before commercial launch, please migrate the UserSig calculation code and key to your backend server to prevent key disclosure and traffic stealing.
 * Reference: https://cloud.tencent.com/document/product/647/17275#Server
 */
const SECRETKEY = '';

export { SDKAPPID, EXPIRETIME, SECRETKEY };
