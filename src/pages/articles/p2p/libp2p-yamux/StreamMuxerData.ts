export const POLL_STEPS = [
  {
    id: 'inbound',
    label: 'poll_inbound()',
    desc: '인바운드 스트림 수신',
    detail: '버퍼에 이미 스트림이 있으면 즉시 반환. 없으면 내부 폴링으로 새 스트림을 기다린다.',
    why: '왜 버퍼 우선? ACK 지연 없이 이미 도착한 스트림을 즉시 처리하기 위해.',
    color: '#10b981',
    flow: ['buffer 확인', 'pop_front()', '없으면 poll_inner()', 'waker 등록'],
  },
  {
    id: 'outbound',
    label: 'poll_outbound()',
    desc: '아웃바운드 스트림 생성',
    detail: 'Either<yamux012, yamux013>에 따라 적절한 버전의 poll_new_outbound()를 호출.',
    why: '왜 Either? 두 버전 yamux를 동시에 지원하기 위한 이중 디스패치.',
    color: '#f59e0b',
    flow: ['Either 분기', 'poll_new_outbound()', 'Stream 래핑', '반환'],
  },
  {
    id: 'poll',
    label: 'poll()',
    desc: '이벤트 루프 구동',
    detail: '인바운드 스트림을 내부 폴링하고, 버퍼가 256개 미만이면 저장. 초과 시 drop.',
    why: '왜 256개 제한? 무한 버퍼링은 메모리 폭발. 상한을 넘으면 리셋으로 백프레셔 전달.',
    color: '#8b5cf6',
    flow: ['poll_inner()', '버퍼 < 256?', 'push_back()', 'waker.wake()'],
  },
];
