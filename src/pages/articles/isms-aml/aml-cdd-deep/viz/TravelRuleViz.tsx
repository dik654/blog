import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';

const C = {
  send: '#3b82f6',   // 송신 VASP
  recv: '#10b981',   // 수신 VASP
  info: '#6366f1',   // 정보/데이터
  warn: '#ef4444',   // 경고/제한
};

const STEPS = [
  {
    label: 'Travel Rule — VASP 간 신원 정보 동반 전송',
    body: 'FATF R.16을 가상자산에 적용. 블록체인에는 실명이 없으므로 "지갑 주소 → 실명" 연결 고리를 별도 채널로 제공.',
  },
  {
    label: '필수 전송 정보: 송신인 + 수신인',
    body: '송신인(성명, 지갑주소, 계정번호) + 수신인(성명, 지갑주소). 한국은 100만 원 이상 거래에 적용, 5년 보관 의무.',
  },
  {
    label: 'Travel Rule 솔루션: CODE · TRISA · Notabene',
    body: '블록체인 TX에는 실명을 넣을 수 없어 off-chain 메시징 필요. 한국은 CODE가 사실상 표준, 해외는 TRISA/Notabene 병행.',
  },
  {
    label: '미신고 VASP · 개인 지갑 · 규제 확대',
    body: '미신고 VASP 출금 차단, 개인 지갑은 소유권 증명(마이크로 트랜잭션·서명 검증). 100만 원 이하 확대 + 스테이블코인 포함 추진.',
  },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd="url(#tr-arrow)" />;
}

export default function TravelRuleViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="tr-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {/* Step 0: 핵심 개념 */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.info}>Travel Rule: 가상자산 이전 시 정보 동반 전송</text>

              {/* 송신 VASP */}
              <ModuleBox x={15} y={30} w={130} h={55} label="송신 VASP" sub="출금 요청 처리" color={C.send} />

              {/* 블록체인 TX */}
              <rect x={165} y={42} width={150} height={32} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
              <text x={240} y={55} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--foreground)">블록체인 TX</text>
              <text x={240} y={67} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">지갑 주소만 기록 (실명 없음)</text>

              {/* 수신 VASP */}
              <ModuleBox x={335} y={30} w={130} h={55} label="수신 VASP" sub="입금 처리" color={C.recv} />

              {/* 화살표 */}
              <Arrow x1={145} y1={58} x2={163} y2={58} color={C.send} />
              <Arrow x1={315} y1={58} x2={333} y2={58} color={C.recv} />

              {/* off-chain 정보 전송 */}
              <motion.path
                d="M 80 90 Q 240 130 400 90"
                fill="none" stroke={C.info} strokeWidth={1.2} strokeDasharray="4 3"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8 }}
              />
              <rect x={175} y={108} width={130} height={22} rx={4} fill="var(--card)" stroke={C.info} strokeWidth={0.8} />
              <text x={240} y={123} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.info}>Off-chain 신원 정보</text>

              {/* 법적 근거 */}
              <rect x={30} y={150} width={420} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />
              <DataBox x={30} y={160} w={130} h={30} label="FATF R.16 (국제)" color={C.info} />
              <Arrow x1={160} y1={175} x2={178} y2={175} color={C.info} />
              <DataBox x={181} y={160} w={140} h={30} label="특금법 제5조의4 (한국)" color={C.send} />
              <Arrow x1={321} y1={175} x2={339} y2={175} color={C.send} />
              <DataBox x={342} y={160} w={120} h={30} label="2022.03 시행" color={C.recv} />
            </motion.g>
          )}

          {/* Step 1: 필수 전송 정보 */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.info}>필수 전송 정보</text>

              {/* 송신인 정보 */}
              <ModuleBox x={15} y={30} w={210} h={48} label="송신인 정보" sub="송신 VASP가 제공" color={C.send} />
              <DataBox x={25} y={88} w={88} h={28} label="성명 (실명)" color={C.send} />
              <DataBox x={122} y={88} w={100} h={28} label="가상자산 주소" color={C.send} />
              <Arrow x1={69} y1={78} x2={69} y2={86} color={C.send} />
              <Arrow x1={172} y1={78} x2={172} y2={86} color={C.send} />

              {/* 수신인 정보 */}
              <ModuleBox x={255} y={30} w={210} h={48} label="수신인 정보" sub="수신 VASP가 확인" color={C.recv} />
              <DataBox x={265} y={88} w={88} h={28} label="성명 (실명)" color={C.recv} />
              <DataBox x={362} y={88} w={100} h={28} label="가상자산 주소" color={C.recv} />
              <Arrow x1={309} y1={78} x2={309} y2={86} color={C.recv} />
              <Arrow x1={412} y1={78} x2={412} y2={86} color={C.recv} />

              {/* 적용 기준 */}
              <rect x={30} y={135} width={420} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              <ActionBox x={30} y={145} w={130} h={36} label="적용 기준" sub="100만 원 이상" color={C.send} />
              <ActionBox x={175} y={145} w={130} h={36} label="정보 보관" sub="종료일로부터 5년" color={C.info} />
              <ActionBox x={320} y={145} w={130} h={36} label="위반 시 제재" sub="최대 3천만 원 과태료" color={C.warn} />

              <text x={240} y={205} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                FATF는 송금액·날짜·거래유형도 권고 — 향후 시행령 개정으로 확대 가능
              </text>
            </motion.g>
          )}

          {/* Step 2: 솔루션 */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.info}>Travel Rule 솔루션 — Off-chain 메시징</text>

              {/* 4개 솔루션 */}
              <ModuleBox x={15} y={30} w={105} h={52} label="CODE" sub="한국 VASP 공동 표준" color={C.send} />
              <ModuleBox x={133} y={30} w={105} h={52} label="TRISA" sub="분산형 P2P + mTLS" color={C.info} />
              <ModuleBox x={251} y={30} w={105} h={52} label="Notabene" sub="SaaS, 다중 프로토콜" color={C.recv} />
              <ModuleBox x={369} y={30} w={100} h={52} label="Sygna Bridge" sub="아시아 중심" color={C.recv} />

              {/* 적용 지역 */}
              <text x={67} y={95} textAnchor="middle" fontSize={8} fill={C.send}>한국</text>
              <text x={185} y={95} textAnchor="middle" fontSize={8} fill={C.info}>글로벌</text>
              <text x={303} y={95} textAnchor="middle" fontSize={8} fill={C.recv}>글로벌</text>
              <text x={419} y={95} textAnchor="middle" fontSize={8} fill={C.recv}>아시아</text>

              {/* 한국 구조 */}
              <rect x={30} y={108} width={420} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />
              <text x={240} y={126} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--muted-foreground)">한국 운영 구조</text>

              <ActionBox x={30} y={135} w={140} h={40} label="국내 VASP 간" sub="CODE 프로토콜 사용" color={C.send} />
              <Arrow x1={170} y1={155} x2={195} y2={155} color={C.send} />

              <DataBox x={198} y={140} w={85} h={30} label="정보 교환" color={C.info} />
              <Arrow x1={283} y1={155} x2={308} y2={155} color={C.info} />

              <ActionBox x={311} y={135} w={148} h={40} label="해외 VASP 간" sub="TRISA / Notabene 병행" color={C.recv} />

              <text x={240} y={200} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                업비트·빗썸·코인원·코빗 등 주요 거래소가 CODE로 상호 연동
              </text>
            </motion.g>
          )}

          {/* Step 3: 미신고 VASP + 규제 확대 */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* 미신고 VASP */}
              <AlertBox x={10} y={10} w={145} h={48} label="미신고 VASP" sub="출금 차단 or 추가 확인" color={C.warn} />
              <Arrow x1={155} y1={34} x2={170} y2={34} color={C.warn} />

              {/* 개인 지갑 */}
              <AlertBox x={173} y={10} w={145} h={48} label="개인 지갑 (Unhosted)" sub="소유권 증명 필수" color={C.warn} />
              <Arrow x1={318} y1={34} x2={333} y2={34} color={C.info} />

              {/* 소유권 검증 */}
              <ActionBox x={336} y={12} w={130} h={44} label="소유권 검증" sub="마이크로TX / 서명 검증" color={C.info} />

              {/* 규제 확대 타임라인 */}
              <rect x={30} y={78} width={420} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />
              <text x={240} y={96} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--muted-foreground)">규제 확대 타임라인</text>

              {/* 타임라인 */}
              <DataBox x={10} y={105} w={90} h={28} label="2022.03" color={C.send} />
              <text x={55} y={146} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">100만 원+ 시행</text>

              <Arrow x1={100} y1={119} x2={118} y2={119} color={C.send} />
              <DataBox x={121} y={105} w={90} h={28} label="2025.12" color={C.info} />
              <text x={166} y={146} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">100만 원 이하 확대</text>

              <Arrow x1={211} y1={119} x2={229} y2={119} color={C.info} />
              <DataBox x={232} y={105} w={110} h={28} label="2026 상반기" color={C.recv} />
              <text x={287} y={146} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">2단계 법안 (제재 강화)</text>

              <Arrow x1={342} y1={119} x2={360} y2={119} color={C.warn} />
              <AlertBox x={363} y={102} w={105} h={34} label="스테이블코인" sub="동일 규제 적용" color={C.warn} />

              {/* 핵심 배경 */}
              <rect x={30} y={165} width={420} height={36} rx={6} fill="var(--card)" stroke={C.warn} strokeWidth={0.8} strokeDasharray="4 3" />
              <text x={240} y={180} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.warn}>
                불법 가상자산 거래의 84%가 스테이블코인 경유 (FATF 2026.03)
              </text>
              <text x={240} y={193} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                structuring(거래 분할) 우회 방지를 위한 적용 범위 확대
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
