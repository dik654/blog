/**
 * Auth Profile 시스템 — 멀티 프로바이더 관리
 *
 * 여러 AI 프로바이더를 동시 지원하며,
 * Rate limit/장애/타임아웃 시 자동 페일오버합니다.
 */

export interface AuthProfile {
  id: string;
  provider: 'anthropic' | 'openai' | 'google' | 'ollama' | string;
  apiKey?: string;
  baseUrl?: string;
  cooldownUntil?: number;
}

export interface ModelConfig {
  primary: string;
  fallbacks: string[];
}

const COOLDOWN_MS = 60_000; // 실패 후 1분 쿨다운

export class AuthProfileManager {
  private profiles: Map<string, AuthProfile> = new Map();
  private cooldowns: Map<string, number> = new Map();

  constructor(private config: { model: ModelConfig }) {}

  /** 사용 가능한 프로파일을 우선순위 순으로 반환 */
  getAvailableProfiles(): AuthProfile[] {
    const now = Date.now();
    return [this.config.model.primary, ...this.config.model.fallbacks]
      .map((id) => this.profiles.get(id))
      .filter((p): p is AuthProfile => {
        if (!p) return false;
        const cd = this.cooldowns.get(p.id);
        // 쿨다운 만료 시 자동 재활성화
        return !cd || cd < now;
      });
  }

  /** 자동 페일오버: 첫 번째 사용 가능한 프로파일 선택 */
  async resolveModel(): Promise<AuthProfile> {
    const available = this.getAvailableProfiles();
    if (available.length === 0) {
      throw new Error('All model profiles are in cooldown');
    }
    return available[0];
  }

  /** 실패한 프로파일을 쿨다운 */
  markFailed(profileId: string) {
    this.cooldowns.set(profileId, Date.now() + COOLDOWN_MS);
  }

  /** 프로파일 등록 */
  register(profile: AuthProfile) {
    this.profiles.set(profile.id, profile);
  }
}
