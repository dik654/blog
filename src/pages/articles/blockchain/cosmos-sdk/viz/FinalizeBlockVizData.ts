import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  { label: 'FinalizeBlock 진입', body: 'CometBFT 블록 합의 완료 후 ABCI를 통해 호출됩니다.' },
  { label: 'internalFinalizeBlock — preBlock + beginBlock', body: 'halt 체크 → 상태 초기화 → 모듈별 BeginBlocker 실행.' },
  { label: 'executeTxsWithExecutor — TX 순차 실행', body: '각 TX마다 AnteHandler → runMsgs → PostHandler 파이프라인 실행.' },
  { label: 'endBlock + 결과 조립', body: '검증자 업데이트 후 ResponseFinalizeBlock을 반환합니다.' },
  { label: 'workingHash — app_hash 계산', body: 'MultiStore 서브스토어 해시를 합산해 app_hash를 확정합니다.' },
];

export const STEP_REFS = ['abci-finalizeblock', 'internal-finalizeblock', 'runtx', 'internal-finalizeblock', 'rootmulti-commit'];
export const STEP_LABELS = [
  'abci.go — FinalizeBlock()',
  'abci.go — internalFinalizeBlock()',
  'baseapp.go — RunTx()',
  'abci.go — endBlock()',
  'store.go — workingHash()',
];

export const BOXES = [
  { id: 'finalize', label: 'FinalizeBlock', sub: 'ABCI 진입점', color: '#6366f1', x: 10, y: 10 },
  { id: 'internal', label: 'internalFinalizeBlock', sub: '실제 블록 실행', color: '#8b5cf6', x: 10, y: 58 },
  { id: 'pre', label: 'preBlock', sub: '사전 처리', color: '#10b981', x: 10, y: 106 },
  { id: 'begin', label: 'beginBlock', sub: '모듈 BeginBlocker', color: '#10b981', x: 115, y: 106 },
  { id: 'txs', label: 'executeTxs', sub: 'deliverTx × N', color: '#f59e0b', x: 220, y: 106 },
  { id: 'end', label: 'endBlock', sub: '모듈 EndBlocker', color: '#ec4899', x: 10, y: 154 },
  { id: 'hash', label: 'workingHash', sub: 'app_hash 계산', color: '#ec4899', x: 220, y: 154 },
];
