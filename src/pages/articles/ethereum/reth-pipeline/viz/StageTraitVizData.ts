export const C = { pipeline: '#6366f1', exec: '#f59e0b', done: '#10b981', reorg: '#ef4444' };

export const STEPS = [
  {
    label: 'Pipeline::run() — 메인 루프',
    body: '6개 Stage를 순서대로 실행하며 CL의 FCU tip 해시가 목표입니다.',
  },
  {
    label: 'stage.execute(provider, input)',
    body: 'ExecInput(target, checkpoint)으로 실행하고 done 여부를 ExecOutput으로 반환합니다.',
  },
  {
    label: 'done == false → 루프 중단',
    body: 'target 미도달 시 이번 순회를 중단하고 다음 루프에서 동일 Stage부터 이어서 실행합니다.',
  },
  {
    label: 'stage.unwind(provider, input)',
    body: 'CL의 reorg 신호 시 해당 Stage 데이터만 롤백하고 체크포인트를 과거로 되돌립니다.',
  },
];
