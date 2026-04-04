export const PUBLISH_STEPS = [
  {
    id: 'build',
    label: '1. 메시지 구성',
    desc: 'data_transform으로 변환 후 build_raw_message()로 서명된 메시지 생성.',
    detail: 'max_transmit_size를 초과하면 MessageTooLarge 에러 반환.',
    color: '#06b6d4',
  },
  {
    id: 'msgid',
    label: '2. msg_id 계산',
    desc: 'config.message_id()로 메시지 고유 ID 생성. duplicate_cache에서 중복 체크.',
    detail: '이미 발행한 메시지면 PublishError::Duplicate 반환.',
    color: '#8b5cf6',
  },
  {
    id: 'select',
    label: '3. 수신자 선택',
    desc: 'publish_peers()가 mesh + fanout + floodsub 피어를 합산.',
    detail: 'filter_publish_candidates()로 블랙리스트/백오프 피어 제외.',
    color: '#10b981',
  },
  {
    id: 'idontwant',
    label: '4. IDONTWANT 선전송',
    desc: '메시지가 임계치보다 크면, 수신자에게 IDONTWANT를 먼저 브로드캐스트.',
    detail: '왜? 느린 피어가 같은 메시지를 다시 보내는 것을 방지. 대역폭 절약.',
    color: '#f59e0b',
  },
  {
    id: 'send',
    label: '5. RPC 전송',
    desc: 'RpcOut::Publish로 실제 메시지 전송. publish_queue_duration만큼 타임아웃.',
    detail: 'mcache에도 저장하여 이후 IHAVE 교환에 활용.',
    color: '#ef4444',
  },
];
