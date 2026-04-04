import StepViz from '@/components/ui/step-viz';
import { StepOverview, StepHTTP } from './RPCFlowSteps';
import { StepRouter, StepDispatch, StepProvider } from './RPCFlowSteps2';

const STEPS = [
  { label: 'RPC 요청 처리 흐름', body: 'jsonrpsee 기반 타입 안전 RPC. Geth의 리플렉션 라우팅과 달리 컴파일 타임 검증.' },
  { label: 'Step 1: HTTP/WS로 JSON-RPC 요청 수신', body: 'HTTP(8545) 또는 WebSocket(8546). Engine API는 JWT 인증 필수(8551).' },
  { label: 'Step 2: jsonrpsee가 namespace별 라우팅', body: '#[rpc] 매크로가 namespace("eth", "engine")별 자동 라우팅 코드 생성.' },
  { label: 'Step 3: EthApi 또는 EngineApi로 디스패치', body: 'eth_getBalance -> EthApi::balance() / engine_forkchoiceUpdated -> EngineApi.' },
  { label: 'Step 4: Provider 쿼리 -> 응답 반환', body: 'StateProvider trait으로 상태 조회. BundleState -> MDBX -> StaticFile 순서.' },
];

const R = [StepOverview, StepHTTP, StepRouter, StepDispatch, StepProvider];

export default function RPCFlowViz() {
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
