export const C = { Proposer: '#6366f1', Validator: '#0ea5e9', Committed: '#10b981' };

export const STEPS = [
  {
    label: 'Propose: 리더가 블록 제안',
    body: 'Proposer(라운드 로빈으로 선출)가 새 블록을 생성하여 모든 검증자에게 브로드캐스트합니다.',
  },
  {
    label: 'Prevote: 검증자 투표',
    body: '각 검증자가 제안된 블록을 검증한 후 Prevote(block_hash) 또는 Prevote(nil)을 전파합니다.',
  },
  {
    label: 'Polka 달성: +2/3 Prevote 수집',
    body: '전체 투표권의 2/3 이상 Prevote가 동일 블록에 모이면 "Polka"가 달성됩니다.',
  },
  {
    label: 'Precommit: 최종 커밋 투표',
    body: 'Polka를 확인한 검증자들이 Precommit(block_hash)을 전송하고 해당 블록에 Lock을 겁니다.',
  },
  {
    label: 'Commit: +2/3 Precommit → 즉시 최종성',
    body: '+2/3 Precommit이 수집되면 블록이 커밋됩니다. 포크 없이 즉시 최종성이 보장됩니다.',
  },
];

export const NODES = [
  { x: 170, y: 35, label: 'P', sub: 'Proposer', color: C.Proposer },
  { x: 65, y: 120, label: 'V1', sub: 'Validator', color: C.Validator },
  { x: 170, y: 200, label: 'V2', sub: 'Validator', color: C.Validator },
  { x: 275, y: 120, label: 'V3', sub: 'Validator', color: C.Validator },
];
