import StepViz from '@/components/ui/step-viz';
import { StepOverview, StepDiscovery } from './NetworkStackSteps';
import { StepConnect, StepEncrypt, StepProtocol } from './NetworkStackSteps2';

const STEPS = [
  { label: '네트워크 스택 -- 4단계 연결 과정', body: 'tokio 비동기 런타임 위 단일 이벤트 루프로 수천 세션을 처리합니다.' },
  { label: 'Step 1: UDP로 피어 발견 (Kademlia DHT)', body: 'bootnodes에서 FIND_NODE를 반복하여 Kademlia 버킷에 피어를 추가합니다.' },
  { label: 'Step 2: 발견된 피어에 TCP 연결', body: 'discv4에서 발견된 (IP, port)로 TcpStream::connect 병렬 다이얼링합니다.' },
  { label: 'Step 3: RLPx 암호화 채널 설정 (ECIES)', body: 'auth/ack 교환으로 대칭키를 공유하고 이후 모든 프레임을 AES-CTR 암호화합니다.' },
  { label: 'Step 4: eth/68 프로토콜 메시지 교환 시작', body: 'Status 메시지로 체인 ID와 최신 블록을 교환한 후 블록/TX 요청-응답을 시작합니다.' },
];

const R = [StepOverview, StepDiscovery, StepConnect, StepEncrypt, StepProtocol];

export default function NetworkStackViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const S = R[step];
        return (
          <svg viewBox="0 0 430 115" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            <S />
          </svg>
        );
      }}
    </StepViz>
  );
}
