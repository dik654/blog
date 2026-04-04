import StepViz from '@/components/ui/step-viz';
import { TrustChainStep, KeyHierarchyStep, KeyRequestStep } from './KeyManagerStepsVizParts';

const C = { s: '#6366f1', e: '#10b981', a: '#f59e0b' };

const STEPS = [
  { label: 'SGX 기반 신뢰 체인', body: 'MRENCLAVE: 엔클레이브 코드+초기 데이터 해시(무결성).\nMRSIGNER: 서명 키 해시(개발자 신원). 키 매니저가 Quote의 MRENCLAVE를 검증.' },
  { label: 'HKDF-SHA512 키 계층', body: 'KM Root Secret(SGX EGETKEY 봉인) → Runtime Secret(HKDF runtime_id) → Contract Secret(HKDF contract_address) → 용도별 키 파생.' },
  { label: '키 요청-발급 흐름', body: '1. 컴퓨트 워커 → KM: CallGetOrCreateKey.\n2. KM: SGX Quote 검증.\n3. KM: 키 파생 후 AEAD 암호화 전달.\n4. 컴퓨트 워커: 키로 TX 복호화 + EVM 실행.' },
  { label: 'dm-verity 무결성 검증', body: '루트 블록 해시를 MRENCLAVE에 포함. 각 블록 읽기 시 해시 검증 → 변조 즉시 감지. 파일시스템 변조 불가.' },
];

export default function KeyManagerStepsViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 540 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && <TrustChainStep />}
          {step === 1 && <KeyHierarchyStep />}
          {step === 2 && <KeyRequestStep />}
          {step === 3 && (
            <g>
              <rect x={100} y={15} width={340} height={40} rx={8}
                fill={`${C.s}10`} stroke={C.s} strokeWidth={1.5} />
              <text x={270} y={40} textAnchor="middle" fontSize={11} fontWeight={700}
                fill={C.s}>dm-verity 읽기 전용 루트 FS</text>
              {[0, 1, 2, 3, 4].map((i) => {
                const x = 110 + i * 70;
                return (
                  <g key={i}>
                    <rect x={x} y={75} width={50} height={28} rx={4}
                      fill={`${C.e}12`} stroke={`${C.e}60`} strokeWidth={0.8} />
                    <text x={x + 25} y={93} textAnchor="middle" fontSize={10}
                      fill={C.e}>Block {i}</text>
                    <line x1={x + 25} y1={55} x2={x + 25} y2={75}
                      stroke={C.e} strokeWidth={0.6} strokeDasharray="3,2" />
                  </g>
                );
              })}
              <text x={270} y={125} textAnchor="middle" fontSize={10}
                fill={C.a} fontWeight={600}>루트 해시 ⊂ MRENCLAVE → 변조 즉시 감지</text>
            </g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
