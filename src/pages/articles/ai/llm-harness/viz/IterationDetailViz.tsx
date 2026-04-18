import SimpleStepViz from '@/components/viz/SimpleStepViz';
import type { StepDef } from '@/components/ui/step-viz';
const steps: StepDef[] = [
  { label: 'Iterative Improvement Loop 6단계', body: '1. Measure Baseline: 초기 metrics 수집, 약점 식별\n2. Identify Issues: 실패 분석, 사용자 피드백, 수동 검토\n3. Hypothesize Fixes: prompt 개선, model 변경, tool 추가, guardrail 조정\n4. Implement Changes: A/B 테스트 준비, 버전 관리, 점진적 롤아웃\n5. Measure Impact: baseline 비교, 통계적 유의성, 부작용 확인\n6. Decide & Iterate: ship or rollback, 학습 기록, 다음 반복 시작\n\nDSPy: 프로그래밍적 prompt 최적화 (compiler-like), 자동 self-improving\nObservability: LangSmith, W&B, Helicone, OpenLLMetry\n\n주기: tiny fixes=daily, prompt=weekly, model=monthly, architecture=quarterly\n안티패턴: 변수 다수 동시 변경, baseline 없음, A/B 미실행, 단일 metric 과최적화' },
];
const visuals = [
  { title: 'Iteration Loop 6단계', color: '#ef4444', rows: [
    { label: '1. Measure', value: '초기 metrics 수집, 약점 식별' },
    { label: '2. Identify', value: '실패 분석, 사용자 피드백' },
    { label: '3. Hypothesize', value: 'prompt/model/tool/guardrail 변경' },
    { label: '4. Implement', value: 'A/B 준비, 점진적 롤아웃' },
    { label: '5. Measure', value: 'baseline 비교, 부작용 확인' },
    { label: '6. Decide', value: 'ship or rollback → 다음 반복' },
  ]},
];
export default function IterationDetailViz() { return <SimpleStepViz steps={steps} visuals={visuals} />; }
