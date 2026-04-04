export const C = { user: '#f59e0b', api: '#6366f1', tools: '#10b981', perm: '#ef4444' };

export const STEPS = [
  {
    label: '사용자 입력: 자연어 명령',
    body: '사용자가 터미널에서 자연어로 작업을 지시합니다. Claude Code는 이를 Claude API로 전달할 메시지로 변환합니다.',
  },
  {
    label: 'Claude API 호출: 메시지 + 도구 정의 전송',
    body: '사용자 메시지와 함께 사용 가능한 도구 정의(Read, Write, Bash, Grep 등)를 Claude API에 전송합니다. ~200K 토큰 컨텍스트 윈도우를 활용합니다.',
  },
  {
    label: '응답 분석: 텍스트 or 도구 호출?',
    body: 'Claude의 응답을 파싱하여 일반 텍스트인지, 도구 호출(tool_use) 요청인지 판별합니다. 텍스트이면 사용자에게 출력하고 대기합니다.',
  },
  {
    label: '도구 실행: 권한 확인 -> 실행 -> 결과 수집',
    body: '도구 호출 시 권한 모드(Ask/Auto-Allow/YOLO)에 따라 사용자 승인 여부를 결정합니다. 승인 후 도구를 실행하고 결과를 수집합니다.',
  },
  {
    label: '루프 반복: 평균 21.2회 도구 호출/요청',
    body: '도구 실행 결과를 대화 컨텍스트에 추가하고 다시 Claude API를 호출합니다. 하나의 요청당 평균 21.2회 도구 호출이 반복됩니다.',
  },
];
