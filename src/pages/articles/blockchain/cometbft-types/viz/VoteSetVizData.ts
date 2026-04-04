export const C = { vote: '#f59e0b', ok: '#10b981', err: '#ef4444', val: '#8b5cf6' };

export const STEPS = [
  {
    label: 'Vote 구조체 — 서명된 투표 메시지',
    body: 'Type(Prevote/Precommit) + Height + Round + BlockID',
  },
  {
    label: 'VoteSet — height/round별 투표 수집 컨테이너',
    body: 'votes []*Vote + votesBitArray: 중복 방지',
  },
  {
    label: 'AddVote() — 서명 검증 후 집계',
    body: '1. height/round/type 일치 확인',
  },
  {
    label: '2/3+ 다수결 판정',
    body: 'votesByBlock[blockKey].sum > TotalVP * 2/3',
  },
];

export const STEP_REFS: Record<number, string> = {
  0: 'vote-struct', 1: 'voteset-struct', 2: 'addvote', 3: 'addvote',
};

export const STEP_LABELS: Record<number, string> = {
  0: 'vote.go — Vote struct',
  1: 'vote.go — VoteSet struct',
  2: 'vote.go — addVote() 서명 검증',
  3: 'vote.go — maj23 판정',
};
