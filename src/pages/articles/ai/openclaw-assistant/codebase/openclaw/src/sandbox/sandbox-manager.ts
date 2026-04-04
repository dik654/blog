/**
 * 샌드박스 관리자 — Docker/Podman 기반 격리 실행
 *
 * 모드 (agents.defaults.sandbox.mode):
 *   "all":      모든 세션을 Docker 컨테이너에서 실행
 *   "non-main": 그룹/채널 세션만 샌드박스, 메인은 호스트
 *   off (기본): 도구를 호스트에서 직접 실행
 *
 * Fail-closed 설계: sandbox 설정인데 런타임 없으면 에러 발생
 * 컨테이너 수명: 24시간 유휴 또는 7일 경과 시 자동 제거
 */

export type SandboxMode = 'all' | 'non-main' | 'off';

export interface SandboxConfig {
  mode: SandboxMode;
  elevated: string[];        // 호스트 실행 허용 도구
  idleTimeoutMin: number;    // 기본 1440 (24h)
  maxAgeMin: number;         // 기본 10080 (7d)
}

export interface SubAgentConfig {
  maxSpawnDepth: number;          // 기본 1
  maxChildrenPerAgent: number;    // 기본 5
  archiveAfterMinutes: number;    // 기본 60
  subagentModel?: string;
}

export class SandboxManager {
  private containers: Map<string, { id: string; createdAt: number; lastUsed: number }> =
    new Map();

  constructor(private config: SandboxConfig) {}

  /** Fail-closed: 런타임 없으면 호스트 실행 대신 에러 */
  async ensureRuntime(): Promise<void> {
    if (this.config.mode === 'off') return;
    const hasDocker = await this.checkDockerAvailable();
    if (!hasDocker) {
      throw new Error(
        'Sandbox mode is enabled but Docker runtime is not available. ' +
        'Install Docker or set sandbox.mode to "off".',
      );
    }
  }

  /** 세션에 대해 샌드박스가 필요한지 판단 */
  needsSandbox(isMainSession: boolean): boolean {
    if (this.config.mode === 'all') return true;
    if (this.config.mode === 'non-main') return !isMainSession;
    return false;
  }

  /** 도구가 elevated 목록에 있으면 호스트 실행 허용 (escape hatch) */
  isElevated(toolName: string): boolean {
    return this.config.elevated.includes(toolName);
  }

  /** 유휴/만료 컨테이너 자동 정리 */
  async cleanup() {
    const now = Date.now();
    for (const [key, c] of this.containers) {
      const idleMs = now - c.lastUsed;
      const ageMs = now - c.createdAt;
      if (idleMs > this.config.idleTimeoutMin * 60_000 ||
          ageMs > this.config.maxAgeMin * 60_000) {
        await this.removeContainer(c.id);
        this.containers.delete(key);
      }
    }
  }

  private async checkDockerAvailable(): Promise<boolean> {
    // docker info 실행하여 확인
    return false;
  }

  private async removeContainer(id: string) {
    // docker rm -f <id>
  }
}
