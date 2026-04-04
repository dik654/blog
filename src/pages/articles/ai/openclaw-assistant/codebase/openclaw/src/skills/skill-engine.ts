/**
 * 스킬 엔진 — SKILL.md 기반 플러그인 시스템
 *
 * 스킬 우선순위 (높은 순):
 *   1. <workspace>/skills (에이전트별)
 *   2. ~/.openclaw/skills (공유/관리)
 *   3. 번들된 스킬
 *
 * ClawHub: 13,729+ 커뮤니티 스킬 레지스트리
 *   → 동적 로드: 설치 후 재시작 없이 다음 턴부터 사용
 *   → VirusTotal 연동 스킬 스캐닝 (보안)
 */

import { readFile } from 'fs/promises';
import { join } from 'path';
import { parse as parseYaml } from 'yaml';

export interface SkillMeta {
  name: string;
  version?: string;
  description?: string;
  requirements?: string[];
  triggers?: string[];
  maxSpawnDepth?: number;
  sandbox?: 'docker' | 'none';
}

export interface Skill {
  meta: SkillMeta;
  instructions: string;
  dir: string;
}

const SKILL_SEARCH_DIRS = [
  'workspace/skills',     // 에이전트별
  '~/.openclaw/skills',   // 공유/관리
  'bundled/skills',       // 번들
];

export class SkillEngine {
  private skills: Map<string, Skill> = new Map();

  /** SKILL.md 파싱: YAML frontmatter + 마크다운 지침 */
  async loadSkill(dir: string): Promise<Skill> {
    const raw = await readFile(join(dir, 'SKILL.md'), 'utf-8');
    const fmMatch = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!fmMatch) throw new Error(`Invalid SKILL.md in ${dir}`);

    const meta = parseYaml(fmMatch[1]) as SkillMeta;
    return { meta, instructions: fmMatch[2].trim(), dir };
  }

  /** 시스템 프롬프트에 적격 스킬 XML 목록 주입 (스킬당 ~24 토큰) */
  buildSkillPromptBlock(): string {
    const lines = Array.from(this.skills.values()).map(
      (s) => `<skill name="${s.meta.name}">${s.meta.description ?? ''}</skill>`,
    );
    return `<available-skills>\n${lines.join('\n')}\n</available-skills>`;
  }

  /** 스킬 검색 및 등록 (우선순위 순) */
  async discover(searchDirs: string[] = SKILL_SEARCH_DIRS) {
    for (const dir of searchDirs) {
      // 디렉토리 탐색 → SKILL.md 존재하면 로드
      // 이미 같은 이름의 스킬이 있으면 높은 우선순위가 유지됨
    }
  }

  getSkill(name: string): Skill | undefined {
    return this.skills.get(name);
  }
}
