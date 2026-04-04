export interface TraitMethodItem {
  method: string;
  desc: string;
  detail: string;
}

export const STAGE_METHODS: TraitMethodItem[] = [
  {
    method: 'execute()',
    desc: '정방향 실행',
    detail: 'ExecInput(target + checkpoint)을 받아 작업 수행. done=true가 될 때까지 반복 호출된다. commit_threshold 단위로 중간 저장한다.',
  },
  {
    method: 'unwind()',
    desc: '역방향 롤백',
    detail: 'reorg 발생 시 특정 블록까지 되돌린다. Geth는 전체 상태를 되돌리지만, Reth는 Stage별로 부분 롤백이 가능하다.',
  },
  {
    method: 'id()',
    desc: 'Stage 식별자',
    detail: 'StageId 열거형을 반환한다. Pipeline이 체크포인트를 Stage별로 관리할 때 이 ID를 키로 사용한다.',
  },
];
