import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, StatusBox, AlertBox } from '@/components/viz/boxes';

const C = { blue: '#3b82f6', red: '#ef4444', green: '#22c55e', amber: '#f59e0b' };

const STEPS = [
  {
    label: '구조화(Structuring) + 빠른 이동(Rapid Movement)',
    body: '구조화: 보고 기준 금액 바로 아래로 분할 입금(스머핑). 빠른 이동: 입금→매수→외부 출금이 수분 이내에 완료되는 경유지 패턴.',
  },
  {
    label: 'Fan-out / Fan-in — 자금 분산과 집중',
    body: 'Fan-out: 1개 계정 → 다수 외부 지갑으로 소액 분산. Fan-in: 다수 외부 지갑 → 1개 계정으로 집중. 추적 난이도를 높이는 핵심 수법.',
  },
  {
    label: '믹서·프라이버시 코인·크로스체인',
    body: '믹서(Tornado Cash): 자금을 섞어 출처 불명화. 프라이버시 코인(Monero/Zcash): 거래 자체 암호화. 크로스체인 브릿지: 체인 간 이동으로 단일 체인 분석 회피.',
  },
  {
    label: '행동 기반 — 신규 고액 + 휴면 계정',
    body: '신규 계정이 즉시 대규모 거래(깡통 계좌 의심). 휴면 계정이 갑자기 활성화(계정 탈취 또는 명의 매매 의심).',
  },
  {
    label: '세탁 3단계 — 배치 → 계층화 → 통합',
    body: '배치(Placement): 범죄 수익 → 가상자산 매수. 계층화(Layering): 믹서·크로스체인·DEX 경유. 통합(Integration): 거래소에서 원화 환전.',
  },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1.2} markerEnd="url(#dp-arrow)" />;
}

export default function DetectionPatternsViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="dp-arrow" viewBox="0 0 10 10" refX={8} refY={5} markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Structuring */}
              <text x={130} y={18} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.amber}>구조화 (Structuring)</text>
              <DataBox x={15} y={28} w={70} h={28} label="990만 원" color={C.red} />
              <DataBox x={95} y={28} w={70} h={28} label="980만 원" color={C.red} />
              <DataBox x={175} y={28} w={70} h={28} label="970만 원" color={C.red} />
              <Arrow x1={50} y1={58} x2={130} y2={78} color={C.red} />
              <Arrow x1={130} y1={58} x2={130} y2={78} color={C.red} />
              <Arrow x1={210} y1={58} x2={130} y2={78} color={C.red} />
              <AlertBox x={80} y={78} w={100} h={30} label="기준 1천만 원" sub="80~99% 범위 반복" color={C.red} />

              {/* Rapid Movement */}
              <text x={375} y={18} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.amber}>빠른 이동 (Rapid)</text>
              <ActionBox x={280} y={28} w={75} h={30} label="원화 입금" color={C.blue} />
              <Arrow x1={357} y1={43} x2={368} y2={43} color={C.amber} />
              <ActionBox x={370} y={28} w={55} h={30} label="매수" color={C.amber} />
              <Arrow x1={427} y1={43} x2={438} y2={43} color={C.red} />
              <ActionBox x={440} y={28} w={35} h={30} label="출금" sub="" color={C.red} />
              <AlertBox x={310} y={74} w={140} h={30} label="30분 이내 전액 출금" sub="경유지 패턴" color={C.red} />

              {/* Combined alert */}
              <DataBox x={130} y={130} w={220} h={34} label="두 패턴 동시 발생 → 최고 경보" sub="구조화+빠른이동 = 세탁 강한 의심" color={C.red} />
              <text x={240} y={190} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">24시간 내 동일 계정에서 기준 금액의 80~99% 범위 거래 3회 이상</text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Fan-out (left) */}
              <text x={120} y={18} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.red}>Fan-out (분산 출금)</text>
              <ModuleBox x={75} y={28} w={90} h={36} label="계정 A" sub="대량 입금" color={C.red} />
              <Arrow x1={120} y1={66} x2={30} y2={90} color={C.red} />
              <Arrow x1={120} y1={66} x2={80} y2={90} color={C.red} />
              <Arrow x1={120} y1={66} x2={130} y2={90} color={C.red} />
              <Arrow x1={120} y1={66} x2={180} y2={90} color={C.red} />
              {[0, 1, 2, 3].map((i) => (
                <AlertBox key={`fo-${i}`} x={5 + i * 55} y={92} w={50} h={28} label={`지갑 ${i + 1}`} color={C.amber} />
              ))}
              <text x={120} y={140} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">1시간 내 10+개 주소 → 경보</text>

              {/* Fan-in (right) */}
              <text x={365} y={18} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.blue}>Fan-in (집중 입금)</text>
              {[0, 1, 2, 3].map((i) => (
                <AlertBox key={`fi-${i}`} x={270 + i * 55} y={28} w={50} h={28} label={`지갑 ${i + 1}`} color={C.amber} />
              ))}
              <Arrow x1={295} y1={58} x2={365} y2={85} color={C.blue} />
              <Arrow x1={350} y1={58} x2={365} y2={85} color={C.blue} />
              <Arrow x1={405} y1={58} x2={365} y2={85} color={C.blue} />
              <Arrow x1={460} y1={58} x2={365} y2={85} color={C.blue} />
              <ModuleBox x={320} y={86} w={90} h={36} label="계정 B" sub="원화 환전 시도" color={C.blue} />
              <text x={365} y={140} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">24시간 내 5+개 주소 → 경보</text>

              {/* Bottom note */}
              <DataBox x={130} y={158} w={220} h={34} label="분산↔집중은 세탁의 양면" sub="Fan-out(계층화) → Fan-in(통합)" color={C.amber} />
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Three obfuscation methods */}
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">자금 흐름 난독화 3가지</text>

              {/* Mixer */}
              <ActionBox x={15} y={32} w={60} h={30} label="자금 A" color={C.blue} />
              <ActionBox x={15} y={70} w={60} h={30} label="자금 B" color={C.green} />
              <Arrow x1={77} y1={47} x2={90} y2={62} color={C.amber} />
              <Arrow x1={77} y1={85} x2={90} y2={70} color={C.amber} />
              <AlertBox x={92} y={48} w={60} h={36} label="믹서" sub="Tornado" color={C.red} />
              <Arrow x1={154} y1={66} x2={168} y2={55} color={C.red} />
              <Arrow x1={154} y1={66} x2={168} y2={80} color={C.red} />
              <text x={186} y={55} fontSize={8} fill="var(--muted-foreground)">섞인 A'</text>
              <text x={186} y={83} fontSize={8} fill="var(--muted-foreground)">섞인 B'</text>

              {/* Privacy coin */}
              <ModuleBox x={230} y={38} w={110} h={42} label="프라이버시 코인" sub="Monero·Zcash" color={C.red} />
              <text x={285} y={96} textAnchor="middle" fontSize={8} fill={C.red}>거래 내역 암호화</text>
              <text x={285} y={108} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">링 서명 / zk-SNARK</text>

              {/* Cross-chain */}
              <ActionBox x={365} y={32} w={45} h={28} label="ETH" color={C.blue} />
              <Arrow x1={412} y1={46} x2={418} y2={52} color={C.amber} />
              <AlertBox x={420} y={38} w={50} h={28} label="브릿지" color={C.amber} />
              <Arrow x1={445} y1={68} x2={430} y2={76} color={C.amber} />
              <ActionBox x={390} y={78} w={50} h={28} label="AVAX" color={C.green} />
              <Arrow x1={415} y1={108} x2={415} y2={116} color={C.green} />
              <ActionBox x={390} y={118} w={50} h={28} label="USDT" color={C.green} />
              <text x={415} y={162} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">다른 거래소 환전</text>

              {/* Bottom */}
              <DataBox x={80} y={170} w={320} h={30} label="1~2홉 이내 믹서 연결 / 브릿지 직후 출금 → 경보" color={C.red} />
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* New high-value account */}
              <text x={130} y={18} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.amber}>신규 고액 거래</text>
              <StatusBox x={20} y={28} w={90} h={42} label="계정 생성" sub="Day 0" color={C.blue} progress={0.1} />
              <Arrow x1={112} y1={49} x2={128} y2={49} color={C.red} />
              <AlertBox x={130} y={30} w={100} h={38} label="1천만 원+" sub="7일 이내 입금" color={C.red} />
              <text x={130} y={88} fontSize={8} fill={C.red}>깡통 계좌 의심</text>
              <text x={130} y={100} fontSize={8} fill="var(--muted-foreground)">정상: 소액→점진적 증가</text>

              {/* Dormant account */}
              <text x={370} y={18} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.amber}>휴면 계정 활성화</text>
              <StatusBox x={290} y={28} w={90} h={42} label="180일+ 미사용" sub="휴면 상태" color={C.blue} progress={0} />
              <Arrow x1={382} y1={49} x2={398} y2={49} color={C.red} />
              <AlertBox x={400} y={30} w={70} h={38} label="갑작스런" sub="대규모 거래" color={C.red} />
              <text x={370} y={88} fontSize={8} fill={C.red}>계정 탈취 또는 명의 매매</text>
              <text x={370} y={100} fontSize={8} fill="var(--muted-foreground)">IP/디바이스 변경 시 추가 경보</text>

              {/* Combined scoring */}
              <Arrow x1={130} y1={112} x2={240} y2={135} color={C.amber} />
              <Arrow x1={370} y1={112} x2={240} y2={135} color={C.amber} />
              <DataBox x={140} y={130} w={200} h={34} label="패턴 조합 → 위험도 산정" sub="신규고액+빠른이동+믹서 = 최고 등급" color={C.red} />
              <text x={240} y={190} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">단일 패턴보다 조합이 FDS 핵심 경쟁력</text>
            </motion.g>
          )}

          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* 3-stage ML flow */}
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">가상자산 자금세탁 3단계</text>

              {/* Placement */}
              <ModuleBox x={15} y={30} w={130} h={48} label="1. 배치 (Placement)" sub="범죄 수익 → 가상자산 매수" color={C.blue} />
              <Arrow x1={147} y1={54} x2={173} y2={54} color={C.blue} />

              {/* Layering */}
              <ModuleBox x={175} y={30} w={130} h={48} label="2. 계층화 (Layering)" sub="믹서·브릿지·DEX 경유" color={C.amber} />
              <Arrow x1={307} y1={54} x2={333} y2={54} color={C.amber} />

              {/* Integration */}
              <ModuleBox x={335} y={30} w={130} h={48} label="3. 통합 (Integration)" sub="거래소 원화 환전" color={C.green} />

              {/* Detail boxes below */}
              <ActionBox x={15} y={100} w={130} h={30} label="P2P 거래 / 명의 차용" color={C.blue} />
              <ActionBox x={175} y={100} w={130} h={30} label="크로스체인 + 프라이버시" color={C.amber} />
              <ActionBox x={335} y={100} w={130} h={30} label="스테이블코인 현금화" color={C.green} />

              {/* Hop chain */}
              <text x={240} y={155} textAnchor="middle" fontSize={9} fill={C.red}>자금세탁의 80%가 중개 지갑·여러 홉(Hop)을 경유</text>
              {[0, 1, 2, 3, 4].map((i) => (
                <g key={`hop-${i}`}>
                  <circle cx={120 + i * 65} cy={175} r={10} fill="var(--card)" stroke={i === 0 ? C.red : i === 4 ? C.green : C.amber} strokeWidth={1} />
                  <text x={120 + i * 65} y={179} textAnchor="middle" fontSize={8} fill="var(--foreground)">{`${i + 1}홉`}</text>
                  {i < 4 && <Arrow x1={132 + i * 65} y1={175} x2={175 + i * 65} y2={175} color={C.amber} />}
                </g>
              ))}
              <text x={240} y={205} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">온체인 거래 그래프 분석이 필수적인 이유</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
