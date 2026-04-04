import type { CodeRef } from '@/components/code/types';
import sessionRs from './codebase/risc0/zkvm/src/host/server/session.rs?raw';

export const sessionCodeRefs: Record<string, CodeRef> = {
  'session-struct': {
    path: 'risc0/zkvm/src/host/server/session.rs',
    code: sessionRs,
    lang: 'rust',
    highlight: [47, 108],
    annotations: [
      { lines: [47, 52],   color: 'sky',     note: 'Session 구조체 -- 전체 실행 트레이스를 캡슐화' },
      { lines: [52, 60],   color: 'emerald', note: 'segments + input + journal -- 세그먼트 벡터와 공개 입출력' },
      { lines: [64, 70],   color: 'amber',   note: 'assumptions + hooks -- 조건부 증명과 이벤트 훅' },
      { lines: [72, 85],   color: 'violet',  note: 'row_count, insn_count, pre/post_state -- 실행 메트릭과 상태' },
    ],
    desc:
`Session은 zkVM 실행의 전체 트레이스를 담는 컨테이너입니다.

segments: 실행이 시스템에 의해 분할된 Segment들 (각각 독립적으로 증명 가능)
journal: 게스트가 commit한 공개 출력 데이터
assumptions: env::verify로 만든 조건부 증명 참조 목록
row_count: 회로에서 사용한 총 행 수 (증명 비용의 척도)

마지막 Segment의 ExitCode가 Halted/Paused이면 정상 종료, SystemSplit이면 중간 분할입니다.`,
  },

  'segment-struct': {
    path: 'risc0/zkvm/src/host/server/session.rs',
    code: sessionRs,
    lang: 'rust',
    highlight: [118, 144],
    annotations: [
      { lines: [118, 125], color: 'sky',     note: 'Segment 구조체 -- 단일 증명 단위의 실행 청크' },
      { lines: [127, 143], color: 'emerald', note: 'po2() -- 2의 거듭제곱 크기, get_info() -- 행/명령어 수 메트릭' },
    ],
    desc:
`Segment는 ZKP 시스템에 대한 단일 호출로 증명되는 실행 청크입니다.

po2: 실행 트레이스의 행 수를 2의 거듭제곱으로 표현 (예: po2=20이면 2^20 = 약 100만 행)
inner: rv32im 회로의 내부 세그먼트 데이터
output: 이 세그먼트의 출력 (마지막 세그먼트만 journal 포함)

하나의 Session은 여러 Segment로 분할되며, 각각 병렬로 증명한 뒤 join으로 합칩니다.`,
  },
};
