import type { CodeRef } from '@/components/code/types';
import peerGo from './codebase/cometbft/p2p/peer.go?raw';

export const peerRefs: Record<string, CodeRef> = {
  'peer-struct': {
    path: 'p2p/peer.go', code: peerGo, lang: 'go',
    highlight: [38, 51],
    desc: 'peer 구조체 — MConnection을 감싸는 피어 추상화',
    annotations: [
      { lines: [42, 43], color: 'sky', note: 'outbound/conn: dial로 연결했는지 여부 + 원본 TCP 소켓' },
      { lines: [44, 44], color: 'emerald', note: 'mconn: MConnection 포인터 — 실제 다중화 전송을 위임받는 핵심 필드' },
      { lines: [46, 46], color: 'amber', note: 'channels []byte: 상대 피어가 지원하는 채널 ID 목록. 핸드셰이크 시 교환' },
      { lines: [50, 50], color: 'violet', note: 'Data *CMap: 범용 키-값 저장. ConsensusReactor가 PeerState를 저장하는 데 활용' },
    ],
  },
  'peer-send': {
    path: 'p2p/peer.go', code: peerGo, lang: 'go',
    highlight: [53, 77],
    desc: 'Send() / TrySend() — proto.Marshal 후 MConnection에 위임',
    annotations: [
      { lines: [56, 59], color: 'sky', note: 'Send(): IsRunning 체크 → proto.Marshal(e.Message) 직렬화' },
      { lines: [60, 64], color: 'emerald', note: 'mconn.Send(): 채널 sendQueue에 블로킹 삽입. 큐 꽉 차면 10초 타임아웃' },
      { lines: [68, 76], color: 'amber', note: 'TrySend(): 동일 흐름이나 mconn.TrySend() — 큐 꽉 차면 즉시 false 반환' },
    ],
  },
  'peer-onstart': {
    path: 'p2p/peer.go', code: peerGo, lang: 'go',
    highlight: [79, 88],
    desc: 'peer.OnStart() — mconn.Start()로 sendRoutine/recvRoutine 시작',
    annotations: [
      { lines: [80, 83], color: 'sky', note: 'BaseService.OnStart(): 중복 시작 방지 (이미 Running이면 에러)' },
      { lines: [84, 86], color: 'emerald', note: 'mconn.Start(): MConnection.OnStart() 호출 → go sendRoutine/recvRoutine' },
    ],
  },
};
