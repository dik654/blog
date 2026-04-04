import type { CodeRef } from '@/components/code/types';
import entryStdC from './codebase/optee_os/core/tee/entry_std.c?raw';

export const taSessionCodeRefs: Record<string, CodeRef> = {
  'entry-open-session': {
    path: 'optee_os/core/tee/entry_std.c',
    code: entryStdC,
    highlight: [27, 66],
    lang: 'c',
    annotations: [
      { lines: [38, 40], color: 'sky', note: 'UUID + 클라이언트 ID 메타 파라미터 추출' },
      { lines: [43, 45], color: 'emerald', note: '공유 메모리 파라미터 복사 (NW -> SW)' },
      { lines: [48, 53], color: 'amber', note: 'tee_ta_open_session -- TA 로드 + 세션 생성' },
      { lines: [55, 56], color: 'violet', note: 'PRNG 지터 엔트로피 추가 (예측 불가성 강화)' },
    ],
    desc:
`TA 세션 열기의 핵심 진입점입니다.

Normal World에서 TEEC_OpenSession() 호출 시 이 함수에 도달합니다:
1. 메타 파라미터에서 TA UUID와 클라이언트 신원 추출
2. 공유 메모리 파라미터를 Secure World로 복사
3. tee_ta_open_session()으로 TA 로드 + 세션 생성
4. 세션 열기/닫기의 비예측성을 PRNG 지터로 활용`,
  },

  'entry-invoke-command': {
    path: 'optee_os/core/tee/entry_std.c',
    code: entryStdC,
    highlight: [89, 113],
    lang: 'c',
    annotations: [
      { lines: [96, 98], color: 'sky', note: '파라미터 복사 (Normal -> Secure World)' },
      { lines: [100, 103], color: 'emerald', note: '세션 ID로 TA 세션 조회 + 잠금' },
      { lines: [105, 106], color: 'amber', note: 'tee_ta_invoke_command -- TA 내 함수 실행' },
      { lines: [108, 108], color: 'violet', note: '세션 참조 해제 (다른 스레드 사용 가능)' },
    ],
    desc:
`TA 명령 실행 진입점입니다.

TEEC_InvokeCommand() 호출 시:
1. arg->params를 Secure World 구조체로 복사
2. 세션 ID로 열린 세션 목록에서 해당 TA 세션 탐색
3. tee_ta_invoke_command()로 TA의 TA_InvokeCommandEntryPoint 호출
4. 세션 참조 카운트 해제

세션을 못 찾으면 TEE_ERROR_BAD_PARAMETERS를 반환합니다.`,
  },

  'entry-std-dispatch': {
    path: 'optee_os/core/tee/entry_std.c',
    code: entryStdC,
    highlight: [121, 147],
    lang: 'c',
    annotations: [
      { lines: [126, 126], color: 'sky', note: 'Standard Call에서 인터럽트 허용' },
      { lines: [128, 129], color: 'emerald', note: 'OPEN_SESSION 명령 분기' },
      { lines: [130, 134], color: 'amber', note: 'CLOSE/INVOKE/CANCEL 분기' },
      { lines: [142, 143], color: 'violet', note: '미지원 명령 에러 처리' },
    ],
    desc:
`Standard Call의 최상위 디스패치 함수입니다.

SMC를 통해 전달된 optee_msg_arg의 cmd 필드로 분기합니다:
- OPEN_SESSION: TA 세션 열기
- CLOSE_SESSION: 세션 닫기
- INVOKE_COMMAND: TA 함수 실행
- CANCEL: 진행 중인 연산 취소

__weak 심볼이므로 플랫폼별 커스텀 처리가 가능합니다.`,
  },

  'entry-close-session': {
    path: 'optee_os/core/tee/entry_std.c',
    code: entryStdC,
    highlight: [68, 85],
    lang: 'c',
    annotations: [
      { lines: [74, 76], color: 'sky', note: '파라미터가 있으면 에러 (닫기에 불필요)' },
      { lines: [78, 79], color: 'emerald', note: 'PRNG 지터 엔트로피 추가' },
      { lines: [81, 82], color: 'amber', note: '세션 찾기 + 닫기 (TA 자원 해제)' },
    ],
    desc:
`세션 닫기 진입점입니다.

TEEC_CloseSession() 호출 시:
1. 파라미터 검증 (닫기에는 파라미터 불필요)
2. session ID로 열린 세션 탐색
3. tee_ta_close_session()으로 TA 자원 해제

마지막 세션이 닫히면 TA 컨텍스트도 해제됩니다.`,
  },
};
