/** 人机验证 localStorage 记录（H5/PC 同域共享，多标签页共享） */
export const BOT_VERIFICATION_STORAGE_KEY = 'x9-web:bot-verified';

const LEGACY_STORAGE_KEYS = ['x9-web-h5:bot-verified', 'x9-web-pc:bot-verified'];

/** 验证有效时长：4 小时 */
export const BOT_VERIFICATION_VALID_MS = 4 * 60 * 60 * 1000;

export type SystemLike = Record<string, unknown> | null | undefined;

export function isTruthyFlag(val: unknown): boolean {
  return val === true || val === 1 || val === '1';
}

/** getHot.bot_verification_enabled 是否开启 */
export function isBotVerificationEnabled(system: SystemLike): boolean {
  return isTruthyFlag(system?.bot_verification_enabled);
}

/** 读取最近一次验证成功的时间戳 */
export function readVerifiedAt(): number | null {
  if (typeof localStorage === 'undefined') return null;
  try {
    let raw = localStorage.getItem(BOT_VERIFICATION_STORAGE_KEY);
    if (!raw) {
      for (const key of LEGACY_STORAGE_KEYS) {
        raw = localStorage.getItem(key);
        if (raw) break;
      }
    }
    if (!raw) return null;

    const parsed = JSON.parse(raw) as { verifiedAt?: number };
    const verifiedAt = Number(parsed?.verifiedAt);
    return Number.isFinite(verifiedAt) && verifiedAt > 0 ? verifiedAt : null;
  } catch {
    return null;
  }
}

/** 4 小时内是否已验证通过（此期间忽略 bot_verification_enabled） */
export function isVerificationWithinValidPeriod(): boolean {
  const verifiedAt = readVerifiedAt();
  if (!verifiedAt) return false;
  return Date.now() - verifiedAt <= BOT_VERIFICATION_VALID_MS;
}

export function saveBotVerificationRecord(): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(BOT_VERIFICATION_STORAGE_KEY, JSON.stringify({ verifiedAt: Date.now() }));
  LEGACY_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
}

/**
 * 是否应展示验证弹窗（仅在 getHot 完成后判断一次，页面刷新时重新判断）。
 * - 4 小时内已验证 → 直接通过，忽略 bot_verification_enabled
 * - 超过 4 小时或未验证 + enabled=false → 直接通过
 * - 超过 4 小时或未验证 + enabled=true → 弹窗
 * - getHot 异常时 fail-open
 */
export function shouldBlockByBotVerification(
  system: SystemLike,
  systemHotLoaded: boolean,
  getHotFailed = false
): boolean {
  if (getHotFailed) return false;
  if (!systemHotLoaded) return false;
  if (isVerificationWithinValidPeriod()) return false;
  return isBotVerificationEnabled(system);
}
