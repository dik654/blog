import type { CodeRef } from '@/components/code/types';
import statesGo from './codebase/lotus/storage/pipeline/states.go?raw';
import wdpostGo from './codebase/lotus/storage/wdpost/wdpost_run.go?raw';

export const codeRefs: Record<string, CodeRef> = {
  'sector-states': {
    path: 'lotus/storage/pipeline/states.go',
    code: statesGo,
    lang: 'go',
    highlight: [11, 41],
    desc: 'Sealing 상태 머신 — 섹터 라이프사이클 8단계 정의',
    annotations: [
      { lines: [12, 13], color: 'sky',
        note: 'SectorState 타입 — string 기반 열거형' },
      { lines: [14, 23], color: 'emerald',
        note: '8단계: Empty → Packing → PC1 → PC2 → WaitSeed → Committing → Proving → Expired' },
      { lines: [27, 33], color: 'amber',
        note: 'handlePreCommit1 — SealPreCommit1 호출, SDR 인코딩 (CPU 3-5h)' },
      { lines: [34, 36], color: 'violet',
        note: '실패 시 SectorSealPreCommit1Failed 이벤트 전송' },
      { lines: [38, 41], color: 'rose',
        note: '성공 → SectorPreCommit1 이벤트 → PreCommit2 상태로 전이' },
    ],
  },
  'winning-post': {
    path: 'lotus/storage/wdpost/wdpost_run.go',
    code: wdpostGo,
    lang: 'go',
    highlight: [11, 39],
    desc: 'MineOne() — 에폭별 추첨 → PoSt 증명 → 블록 생성',
    annotations: [
      { lines: [11, 15], color: 'sky',
        note: 'WinPostScheduler — FullNodeAPI + Prover + minerAddr' },
      { lines: [21, 25], color: 'emerald',
        note: '1단계: VRF로 ElectionProof 생성 — 에폭 랜덤값 기반' },
      { lines: [27, 29], color: 'amber',
        note: '💡 WinCount < 1이면 return nil — 포아송 분포 추첨 탈락' },
      { lines: [31, 36], color: 'violet',
        note: '2단계: GenerateWinningPoSt — 랜덤 섹터 챌린지 응답' },
      { lines: [38, 39], color: 'rose',
        note: '3단계: createBlock — 블록 헤더 + 메시지 선택 + 서명' },
    ],
  },
};
