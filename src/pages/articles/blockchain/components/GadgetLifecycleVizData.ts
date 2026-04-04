export const PHASES = [
  {
    id: 'configure', label: 'configure()', phase: 'keygen 시',
    color: '#6366f1',
    desc: '회로 구조 정의. 열 쿼리 + 룩업 제약 등록. 이 단계는 한 번만 실행됩니다.',
    steps: [
      { icon: '①', text: 'query_word_rlc() — 어드바이스 열 쿼리 (a, b, c)' },
      { icon: '②', text: 'AddWordsGadget::construct() — a + b = c 제약 정의' },
      { icon: '③', text: 'PairSelectGadget — SUB면 a↔c 교환 선택자' },
      { icon: '④', text: 'cb.stack_pop/push() — RwTable 룩업 제약 등록' },
      { icon: '⑤', text: 'StepStateTransition — pc+1, gas-3, stack+1 전환' },
    ],
  },
  {
    id: 'assign', label: 'assign_exec_step()', phase: 'prove 시',
    color: '#0ea5e9',
    desc: '실행 트레이스로 셀 채움. bus-mapping이 제공한 ExecStep을 회로 셀에 할당.',
    steps: [
      { icon: '①', text: 'block.get_rws(step, 0) — 스택 팝 a 값 취득' },
      { icon: '②', text: 'block.get_rws(step, 1) — 스택 팝 b 값 취득' },
      { icon: '③', text: 'a.overflowing_add(b) — 실제 ADD 연산' },
      { icon: '④', text: 'add_words.assign(region, offset, [a,b], c)' },
      { icon: '⑤', text: 'same_context.assign_exec_step() — 상태 전환 셀' },
    ],
  },
];

export const STACK_STEPS = [
  { op: 'stack_pop', val: 'a', color: '#6366f1', dir: '↓ pop' },
  { op: 'stack_pop', val: 'b', color: '#6366f1', dir: '↓ pop' },
  { op: 'ADD (a+b=c)', val: '', color: '#10b981', dir: '⚙' },
  { op: 'stack_push', val: 'c', color: '#0ea5e9', dir: '↑ push' },
];
