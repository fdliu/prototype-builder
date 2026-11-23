import { defineStore } from "pinia";

const LICENSE_KEY = "pb_license";
const SECRET = "PROTO-BUILDER-2026";

// 轻量本地校验（djb2 哈希）。注意：纯前端校验无法真正防破解，仅作为 MVP 付费门槛。
function hash(input: string): string {
  let h = 5381;
  for (let i = 0; i < input.length; i++) {
    h = ((h << 5) + h + input.charCodeAt(i)) >>> 0;
  }
  return h.toString(36);
}

function signature(code: string, exp: string): string {
  return hash(SECRET + code + exp).slice(0, 6).padStart(6, "0");
}

export interface LicenseResult {
  valid: boolean;
  expired: boolean;
  expiresAt: number | null; // 到期时间戳（毫秒），永久为 null
}

// 激活码格式：
//   永久：PB-XXXXXXXX-XXXXXX
//   限时：PB-XXXXXXXX-XXXXXX-YYYYMMDD
export function parseLicense(key: string): LicenseResult {
  const s = key.trim().toUpperCase();
  const m = s.match(/^PB-([A-Z0-9]{8})-([A-Z0-9]{6})(?:-(\d{8}))?$/);
  if (!m) return { valid: false, expired: false, expiresAt: null };
  const code = m[1];
  const sig = m[2].toLowerCase();
  const exp = m[3] || "";
  if (sig !== signature(code, exp)) {
    return { valid: false, expired: false, expiresAt: null };
  }

  let expiresAt: number | null = null;
  if (exp) {
    const y = Number(exp.slice(0, 4));
    const mo = Number(exp.slice(4, 6));
    const d = Number(exp.slice(6, 8));
    const end = new Date(y, mo - 1, d, 23, 59, 59, 999).getTime();
    if (!Number.isFinite(end)) {
      return { valid: false, expired: false, expiresAt: null };
    }
    if (Date.now() > end) {
      return { valid: false, expired: true, expiresAt: end };
    }
    expiresAt = end;
  }

  return { valid: true, expired: false, expiresAt };
}

export const useMemberStore = defineStore("member", {
  state: () => ({
    isMember: false,
    license: localStorage.getItem(LICENSE_KEY) || "",
    expiresAt: null as number | null,
  }),
  getters: {
    expiryText: (state) => {
      if (!state.isMember) return "";
      if (!state.expiresAt) return "永久有效";
      const d = new Date(state.expiresAt);
      const pad = (n: number) => String(n).padStart(2, "0");
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} 到期`;
    },
  },
  actions: {
    init() {
      const r = parseLicense(this.license);
      this.isMember = r.valid;
      this.expiresAt = r.expiresAt;
    },
    activate(key: string): "ok" | "expired" | "invalid" {
      const r = parseLicense(key);
      if (r.expired) return "expired";
      if (r.valid) {
        this.isMember = true;
        this.license = key.trim().toUpperCase();
        this.expiresAt = r.expiresAt;
        localStorage.setItem(LICENSE_KEY, this.license);
        return "ok";
      }
      return "invalid";
    },
    logout() {
      this.isMember = false;
      this.license = "";
      this.expiresAt = null;
      localStorage.removeItem(LICENSE_KEY);
    },
  },
});
