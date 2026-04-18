import SimpleStepViz from '@/components/viz/SimpleStepViz';
import type { StepDef } from '@/components/ui/step-viz';
const steps: StepDef[] = [
  { label: 'Skill 실행 파이프라인 5단계', body: 'Step 1: Selection — LLM이 user intent 파싱, skill index 매칭\nStep 2: Loading — SKILL.md 읽기, helper scripts 로드, 환경 준비\nStep 3: Preparation — SKILL.md를 context에 주입, LLM이 계획 수립\nStep 4: Execution — tool 호출 (shell, scripts), 중간 결과 수집\nStep 5: Integration — 결과 조합, 포맷팅, 에러 처리, 사용자 반환\n\nTool invocations: simple 1-3회, complex 10+, workflow 수십 회\n에러 처리: script fail → retry, wrong args → correct, missing deps → install\nPermissions: 사용자 권한, sandboxing, 위험 작업 → 사용자 확인\nExtensions: before_run/after_run hooks, custom validators\nState: 파일 기반 상태 유지, cross-invocation memory' },
];
const visuals = [
  { title: '실행 5단계', color: '#ef4444', rows: [
    { label: '1. Selection', value: 'user intent → skill index 매칭' },
    { label: '2. Loading', value: 'SKILL.md + scripts 로드' },
    { label: '3. Preparation', value: 'context 주입, LLM 계획 수립' },
    { label: '4. Execution', value: 'tool 호출, 중간 결과 수집' },
    { label: '5. Integration', value: '결과 조합, 에러 처리, 반환' },
    { label: '호출 횟수', value: 'simple: 1-3, complex: 10+' },
  ]},
];
export default function ExecutionDetailViz() { return <SimpleStepViz steps={steps} visuals={visuals} />; }
