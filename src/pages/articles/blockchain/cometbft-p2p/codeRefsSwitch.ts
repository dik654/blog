import type { CodeRef } from '@/components/code/types';
import switchGo from './codebase/cometbft/p2p/switch.go?raw';

export const switchRefs: Record<string, CodeRef> = {
  'switch-struct': {
    path: 'p2p/switch.go', code: switchGo, lang: 'go',
    highlight: [16, 36],
    desc: 'Switch 구조체 — 피어 관리와 Reactor 라우팅의 중심',
    annotations: [
      { lines: [20, 21], color: 'sky', note: 'reactors map + chDescs: 이름→Reactor 매핑과 전체 채널 디스크립터 목록' },
      { lines: [22, 23], color: 'emerald', note: 'reactorsByCh: byte(channelID)→Reactor. 수신 메시지의 채널ID로 O(1) 라우팅' },
      { lines: [24, 25], color: 'amber', note: 'peers/dialing: PeerSet은 동시성 안전 피어 집합, CMap은 dial 중인 주소 추적' },
    ],
  },
  'switch-add-reactor': {
    path: 'p2p/switch.go', code: switchGo, lang: 'go',
    highlight: [57, 73],
    desc: 'AddReactor() — Reactor의 채널 목록을 reactorsByCh에 등록',
    annotations: [
      { lines: [61, 62], color: 'sky', note: 'reactor.GetChannels(): 각 Reactor가 선언한 ChannelDescriptor 목록 획득' },
      { lines: [63, 65], color: 'emerald', note: '중복 channelID 검사: 이미 등록된 ID면 panic — 프로토콜 레벨 강제' },
      { lines: [67, 68], color: 'amber', note: 'chDescs 전체 목록에 추가 + reactorsByCh[chID] = reactor 매핑 완성' },
    ],
  },
  'switch-onstart': {
    path: 'p2p/switch.go', code: switchGo, lang: 'go',
    highlight: [75, 86],
    desc: 'OnStart() — 모든 Reactor.Start() 후 acceptRoutine 고루틴 시작',
    annotations: [
      { lines: [77, 82], color: 'sky', note: 'reactor.Start(): 각 Reactor의 OnStart() 호출. 하나라도 실패하면 전체 중단' },
      { lines: [84, 84], color: 'emerald', note: 'go acceptRoutine(): 별도 고루틴에서 들어오는 TCP 연결을 수락 → 피어 생성' },
    ],
  },
  'switch-dial': {
    path: 'p2p/switch.go', code: switchGo, lang: 'go',
    highlight: [88, 108],
    desc: 'DialPeersAsync() — 주소 셔플 후 동시에 dial',
    annotations: [
      { lines: [91, 94], color: 'sky', note: 'NewNetAddressStrings(): 문자열 주소 파싱 → NetAddress. 실패는 로그만' },
      { lines: [96, 98], color: 'emerald', note: 'rng.Shuffle(): 항상 같은 순서로 연결하면 특정 피어에 부하 집중 → 랜덤화' },
      { lines: [99, 106], color: 'amber', note: 'go func(addr): 각 주소에 대해 별도 고루틴으로 동시 dial — 비동기 연결' },
    ],
  },
  'switch-broadcast': {
    path: 'p2p/switch.go', code: switchGo, lang: 'go',
    highlight: [110, 116],
    desc: 'Broadcast() — 모든 연결된 피어에 메시지 전파',
    annotations: [
      { lines: [112, 114], color: 'sky', note: 'peers.ForEach(): PeerSet의 모든 피어를 순회하며 peer.Send() 호출' },
    ],
  },
};
