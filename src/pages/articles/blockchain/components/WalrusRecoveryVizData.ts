export const N = 10; // total nodes (simplified)
export const OFFLINE = [2, 5, 8]; // offline node indices

export type Step = 'idle' | 'read' | 'decode' | 'merkle' | 'send';

export const STEPS: { id: Step; label: string; desc: string }[] = [
  { id: 'read', label: '①  자신의 슬라이버 읽기', desc: '복구에 참여하는 노드(donor)가 보유한 SliverPair에서 심볼을 읽습니다.' },
  { id: 'decode', label: '②  RS 복구 심볼 계산', desc: 'recovery_symbol_for_sliver(): RS 인코딩을 적용해 타겟 노드용 심볼을 계산합니다.' },
  { id: 'merkle', label: '③  Merkle 포함 증명 첨부', desc: 'Blake2b256 Merkle 트리에서 해당 심볼의 경로 증명을 생성합니다.' },
  { id: 'send', label: '④  RecoverySymbol 전송', desc: '타겟 노드가 f+1개 이상의 복구 심볼을 수집하면 슬라이버를 재구성할 수 있습니다.' },
];

export const LEGEND = [
  { label: '정상', cls: 'bg-blue-500/20 border border-blue-500/50' },
  { label: '오프라인', cls: 'bg-gray-500/20 border border-gray-500/50' },
  { label: '복구 대상', cls: 'bg-amber-500/20 border border-amber-500' },
  { label: 'donor', cls: 'bg-green-500/20 border border-green-500' },
];
