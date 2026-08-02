import type { CodeRef } from '@/components/code/types';
import fileOpsRs from './codebase/file_ops.rs?raw';
import toolsFileWiringRs from './codebase/tools_file_wiring.rs?raw';

export const codeRefs: Record<string, CodeRef> = {
  'production-wiring': {
    path: 'claw-code/rust/crates/tools/src/lib.rs · 1213-1232, 2069-2100 발췌',
    code: toolsFileWiringRs,
    lang: 'rust',
    highlight: [1, 52],
    desc: '현재 production tool dispatcher와 adapter의 고정 발췌. 각 file tool은 permission check 뒤 workspace wrapper가 아니라 일반 runtime helper를 직접 호출합니다.',
    annotations: [
      { lines: [1, 20], color: 'sky', note: 'tool name을 분기하고 optional permission enforcer를 통과한 뒤 각 run_* adapter로 전달합니다.' },
      { lines: [21, 52], color: 'rose', note: 'adapter는 read_file, write_file, edit_file, glob_search, grep_search를 직접 호출합니다. *_in_workspace wrapper 호출은 이 경로에 없습니다.' },
    ],
  },
  'read-contract': {
    path: 'claw-code/rust/crates/runtime/src/file_ops.rs',
    code: fileOpsRs,
    lang: 'rust',
    highlight: [175, 221],
    desc: '현재 read_file 구현. 크기와 NUL 기반 binary probe를 먼저 확인한 뒤 UTF-8 문자열로 읽고 줄 구간을 반환합니다.',
    annotations: [
      { lines: [182, 193], color: 'sky', note: '전체 파일을 메모리에 올리기 전에 metadata 크기로 컨텍스트·메모리 상한을 지킵니다.' },
      { lines: [195, 203], color: 'amber', note: 'binary probe 통과와 UTF-8 디코딩 성공은 다른 조건입니다. 비 UTF-8 텍스트는 read_to_string에서 별도로 실패합니다.' },
      { lines: [205, 219], color: 'emerald', note: 'offset과 limit을 파일 바이트가 아니라 줄 배열에 적용해 LLM이 읽을 창을 제한합니다.' },
    ],
  },
  'write-contract': {
    path: 'claw-code/rust/crates/runtime/src/file_ops.rs',
    code: fileOpsRs,
    lang: 'rust',
    highlight: [224, 255],
    desc: '현재 write_file 구현. 부모 디렉터리를 만든 뒤 대상 파일에 직접 씁니다. temp+rename이나 fsync는 없습니다.',
    annotations: [
      { lines: [224, 234], color: 'sky', note: '입력 크기를 먼저 거부해 과도한 메모리와 출력 패치 생성을 제한합니다.' },
      { lines: [236, 241], color: 'rose', note: '검증 뒤 create_dir_all과 직접 write를 수행합니다. 경로 교체 race, 부분 갱신, 전원 장애 내구성은 이 코드만으로 보장되지 않습니다.' },
      { lines: [243, 254], color: 'emerald', note: 'structured_patch는 쓰기 후 설명용 결과입니다. 쓰기 자체를 원자적으로 만드는 장치는 아닙니다.' },
    ],
  },
  'edit-contract': {
    path: 'claw-code/rust/crates/runtime/src/file_ops.rs',
    code: fileOpsRs,
    lang: 'rust',
    highlight: [258, 296],
    desc: '현재 edit_file 구현. 읽기→문자열 매칭→직접 쓰기의 낙관적 편집이며 동시 변경 검증은 하지 않습니다.',
    annotations: [
      { lines: [264, 277], color: 'sky', note: '파일 전체를 읽고 old_string 존재 여부를 확인합니다. 이때 얻은 내용은 이후 쓰기까지 고정된 스냅샷이 아닙니다.' },
      { lines: [279, 284], color: 'rose', note: '읽기 뒤 다른 프로세스가 파일을 바꾸면 최신 변경을 덮어쓸 수 있습니다. hash/version 재검증이나 잠금이 필요한 이유입니다.' },
      { lines: [286, 295], color: 'emerald', note: '반환 패치는 사후 감사에 유용하지만 concurrent modification을 예방하지는 않습니다.' },
    ],
  },
  'path-boundary': {
    path: 'claw-code/rust/crates/runtime/src/file_ops.rs',
    code: fileOpsRs,
    lang: 'rust',
    highlight: [536, 628],
    desc: '경로 정규화와 workspace wrapper 후보. 세 wrapper는 #[allow(dead_code)]이며 production read/write/edit 경로에는 아직 배선되지 않았습니다.',
    annotations: [
      { lines: [536, 565], color: 'sky', note: '존재하는 경로는 canonicalize하고, 새 파일은 부모를 canonicalize한 뒤 basename을 붙입니다. 부모도 없으면 raw 경로로 돌아가는 분기를 주의해야 합니다.' },
      { lines: [568, 613], color: 'rose', note: '세 wrapper는 #[allow(dead_code)]입니다. production dispatcher에 배선되지 않았고, 배선하더라도 검증 뒤 일반 I/O를 다시 호출해 check-use race가 남습니다.' },
      { lines: [616, 628], color: 'amber', note: 'is_symlink_escape는 최종 path 자체가 symlink인지 먼저 봅니다. 별도 테스트는 ancestor symlink와 open-time 교체까지 포함해야 합니다.' },
    ],
  },
  'glob-contract': {
    path: 'claw-code/rust/crates/runtime/src/file_ops.rs',
    code: fileOpsRs,
    lang: 'rust',
    highlight: [299, 348],
    desc: '현재 glob_search 구현. glob crate 패턴을 확장하고 파일만 dedupe한 뒤 수정 시각 내림차순으로 최대 100개를 반환합니다.',
    annotations: [
      { lines: [299, 314], color: 'sky', note: '검색 root는 normalize_path하고 brace group은 자체 expand한 뒤 glob crate에 전달합니다.' },
      { lines: [316, 325], color: 'amber', note: 'glob 결과를 dedupe하지만 이 함수 안에는 blacklist나 gitignore filter가 없습니다.' },
      { lines: [328, 348], color: 'emerald', note: '수정 시각으로 정렬한 뒤 100개만 반환하고 truncated flag로 잘림을 알립니다.' },
    ],
  },
  'grep-contract': {
    path: 'claw-code/rust/crates/runtime/src/file_ops.rs',
    code: fileOpsRs,
    lang: 'rust',
    highlight: [351, 473],
    desc: '현재 grep_search 구현. ripgrep subprocess/library가 아니라 regex crate와 WalkDir로 UTF-8 파일을 순차 검색합니다.',
    annotations: [
      { lines: [352, 381], color: 'sky', note: 'regex, optional glob/file type, output mode와 context를 구성합니다.' },
      { lines: [387, 389], color: 'amber', note: 'WalkDir에서 모은 파일을 read_to_string으로 읽으며 실패한 파일은 조용히 skip합니다.' },
      { lines: [407, 450], color: 'emerald', note: '줄별 match와 context를 모으고, content/files/count mode에 맞춰 결과를 만듭니다.' },
      { lines: [460, 473], color: 'rose', note: '검색 파일 수집은 전체 WalkDir traversal입니다. early-stop sink나 gitignore 병렬 검색은 현재 코드에 없습니다.' },
    ],
  },
};
