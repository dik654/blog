import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  { label: 'RunTx 전체 파이프라인', body: '캐시 분기 → AnteHandler → runMsgs → PostHandler → 커밋 순서로 실행됩니다.' },
  { label: '① AnteHandler — 서명/fee 검증', body: 'cacheTxContext()로 분기 후 검증. 실패 시 롤백합니다.' },
  { label: '② runMsgs — Msg별 핸들러 실행', body: '2중 캐시 분기 후 MsgServiceRouter로 모듈 MsgServer를 호출합니다.' },
  { label: '③ PostHandler — 후처리', body: '성공/실패 무관하게 Tip 정산, 이벤트 보강 등을 수행합니다.' },
  { label: '④ 성공 시 캐시 커밋', body: 'err == nil이면 msCache.Write()로 상태를 확정합니다.' },
];

export const STEP_REFS = ['runtx', 'runtx', 'runmsgs', 'runtx', 'runtx'];
export const STEP_LABELS = ['baseapp.go — RunTx()', 'baseapp.go — AnteHandler', 'baseapp.go — runMsgs()', 'baseapp.go — PostHandler', 'baseapp.go — msCache.Write()'];

export const PIPE = [
  { label: 'getContext', sub: 'GasMeter 설정', color: '#6366f1', x: 10 },
  { label: 'AnteHandler', sub: '서명 · nonce · fee', color: '#8b5cf6', x: 82 },
  { label: 'runMsgs', sub: 'Msg → MsgServer', color: '#10b981', x: 154 },
  { label: 'PostHandler', sub: 'tip · 이벤트', color: '#f59e0b', x: 226 },
  { label: 'Cache Write', sub: '상태 확정', color: '#ec4899', x: 298 },
];
