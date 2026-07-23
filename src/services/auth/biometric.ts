// src/services/auth/biometric.ts — 指纹认证（WebAuthn，§11.2）
// Android Chrome 完整支持；创建 publicKey 凭证，使用平台认证器。

/** 是否支持 WebAuthn 平台认证器 */
export function isBiometricSupported(): boolean {
  return typeof window !== 'undefined' && 'PublicKeyCredential' in window;
}

/** 注册指纹凭证 */
export async function registerBiometric(): Promise<boolean> {
  if (!isBiometricSupported()) throw new Error('当前设备不支持指纹认证');
  const challenge = crypto.getRandomValues(new Uint8Array(32));
  const userId = crypto.getRandomValues(new Uint8Array(16));
  try {
    await navigator.credentials.create({
      publicKey: {
        challenge,
        rp: { name: '猎头人才库' },
        user: { id: userId, name: 'owner', displayName: '猎头顾问' },
        pubKeyCredParams: [{ type: 'public-key', alg: -7 }],
        authenticatorSelection: {
          authenticatorAttachment: 'platform',
          userVerification: 'required'
        }
      }
    });
    return true;
  } catch {
    return false;
  }
}

/** 使用指纹验证解锁 */
export async function verifyBiometric(): Promise<boolean> {
  if (!isBiometricSupported()) return false;
  const challenge = crypto.getRandomValues(new Uint8Array(32));
  try {
    const cred = await navigator.credentials.get({
      publicKey: { challenge, userVerification: 'required' }
    });
    return !!cred;
  } catch {
    return false;
  }
}
