import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, StatusBox, AlertBox } from '@/components/viz/boxes';

const C = {
  proxy: '#6366f1',  // DAC / 프록시
  db: '#10b981',     // DB
  block: '#ef4444',  // 차단 / 경고
  user: '#f59e0b',   // 사용자 / 세션
};

const STEPS = [
  {
    label: 'DAC 프록시 구조',
    body: '접근제어 소프트웨어(DAC)가 DB 앞단에 프록시로 배치. 모든 접속을 중계하며 정책 위반 시 차단+알림. DB 내장 기능의 한계(감사로그 성능저하, IP통제 제한, 쿼리필터링 복잡)를 DAC가 해결한다.',
  },
  {
    label: '3중 통제: 세션 + 쿼리 + IP',
    body: '세션(누가: DB계정+OTP), 쿼리(무엇을: SELECT허용/DELETE차단), IP(어디서: 허용IP그룹만). 세 축 모두 만족해야 쿼리가 DB에 도달한다. 하나만 통제하면 우회 가능.',
  },
  {
    label: '계정 분리 + IP 그룹 바인딩',
    body: '서비스계정(readWrite, WAS IP), 관리자계정(DDL, 점프서버IP), 백업계정(SELECT+LOCK, 백업서버IP), 비상계정(ALL, 평소 비활성, CISO승인). 서비스계정은 DELETE 미부여 원칙(Soft Delete).',
  },
  {
    label: '월간 로그 검토 순환',
    body: '비인가접근시도, 대량조회(기준치초과), 권한밖쿼리, 비업무시간접속, 비상계정사용을 월 1회 점검. 정책수립→솔루션구현→로그생성→정기검토→이상징후조치→정책개선 순환.',
  },
];

/* ── 화살표 유틸 ── */
function Arrow({ x1, y1, x2, y2, color, dashed }: {
  x1: number; y1: number; x2: number; y2: number; color: string; dashed?: boolean;
}) {
  return (
    <line x1={x1} y1={y1} x2={x2} y2={y2}
      stroke={color} strokeWidth={1.2} markerEnd="url(#dac-arrow)"
      strokeDasharray={dashed ? '4 3' : undefined} />
  );
}

/* ── 텍스트 배경 사각형 유틸 ── */
function LabelBg({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  return <rect x={x} y={y} width={w} height={h} rx={3} fill="var(--card)" opacity={0.9} />;
}

export default function DbAccessControlViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="dac-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {/* ── Step 0: DAC 프록시 구조 ── */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* 사용자 */}
              <ModuleBox x={10} y={15} w={90} h={48} label="사용자" sub="개발자·DBA" color={C.user} />

              {/* 화살표: 사용자 → DAC */}
              <Arrow x1={100} y1={39} x2={145} y2={39} color={C.proxy} />

              {/* DAC 프록시 (중앙, 강조) */}
              <rect x={148} y={8} width={160} height={62} rx={8} fill="var(--card)" />
              <rect x={148} y={8} width={160} height={62} rx={8}
                fill={`${C.proxy}10`} stroke={C.proxy} strokeWidth={1.2} />
              <rect x={148} y={8} width={160} height={5} rx={0} fill={C.proxy} opacity={0.85}
                clipPath="inset(0 round 8px 8px 0 0)" />
              <text x={228} y={32} textAnchor="middle" fontSize={12} fontWeight={700} fill="var(--foreground)">
                DAC 프록시
              </text>
              <text x={228} y={47} textAnchor="middle" fontSize={8.5} fill="var(--muted-foreground)">
                세션·쿼리·IP 통합 통제
              </text>
              <text x={228} y={60} textAnchor="middle" fontSize={8} fill={C.proxy}>
                정책 위반 → 차단 + 알림
              </text>

              {/* 화살표: DAC → DB */}
              <Arrow x1={308} y1={39} x2={353} y2={39} color={C.db} />

              {/* DB */}
              <ModuleBox x={356} y={15} w={100} h={48} label="DB 서버" sub="3306 포트" color={C.db} />

              {/* 직접 접속 차단선 */}
              <line x1={100} y1={72} x2={356} y2={72}
                stroke={C.block} strokeWidth={0.8} strokeDasharray="4 3" />
              <LabelBg x={170} y={74} w={120} h={14} />
              <text x={230} y={85} textAnchor="middle" fontSize={8} fill={C.block}>
                직접 접속 차단 (방화벽)
              </text>

              {/* DB 내장 기능의 한계 */}
              <rect x={25} y={98} width={430} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />
              <text x={240} y={115} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--muted-foreground)">
                DB 자체 기능의 한계 → DAC가 해결
              </text>

              <AlertBox x={15} y={125} w={135} h={40} label="감사 로그" sub="성능 저하 심각" color={C.block} />
              <AlertBox x={170} y={125} w={135} h={40} label="IP 통제" sub="세밀한 제어 불가" color={C.block} />
              <AlertBox x={325} y={125} w={135} h={40} label="쿼리 필터링" sub="구현 복잡·관리 분산" color={C.block} />

              {/* 화살표: 한계 → DAC 해결 */}
              <Arrow x1={82} y1={170} x2={200} y2={195} color={C.proxy} />
              <Arrow x1={237} y1={170} x2={237} y2={195} color={C.proxy} />
              <Arrow x1={392} y1={170} x2={274} y2={195} color={C.proxy} />

              <ActionBox x={175} y={192} w={130} h={28} label="DAC가 통합 해결" color={C.proxy} />
            </motion.g>
          )}

          {/* ── Step 1: 3중 통제 ── */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* 3축 라벨 */}
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">
                3축 동시 만족 → 쿼리 통과
              </text>

              {/* 세션 축 (왼쪽 위) */}
              <ActionBox x={15} y={30} w={130} h={46} label="세션 (누가)" sub="DB계정 + OTP 인증" color={C.user} />
              <text x={80} y={92} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                접속자 신원 확인
              </text>

              {/* 쿼리 축 (오른쪽 위) */}
              <ActionBox x={335} y={30} w={130} h={46} label="쿼리 (무엇을)" sub="SELECT허용 / DELETE차단" color={C.proxy} />
              <text x={400} y={92} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                실행 SQL 필터링
              </text>

              {/* IP 축 (가운데 아래) */}
              <ActionBox x={175} y={100} w={130} h={46} label="IP (어디서)" sub="허용 IP 그룹만 접속" color={C.db} />
              <text x={240} y={160} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                출발지 IP 검증
              </text>

              {/* 3축 → DB 수렴 화살표 */}
              <motion.line x1={80} y1={76} x2={218} y2={172}
                stroke={C.user} strokeWidth={1.2} markerEnd="url(#dac-arrow)"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }} />

              <motion.line x1={400} y1={76} x2={262} y2={172}
                stroke={C.proxy} strokeWidth={1.2} markerEnd="url(#dac-arrow)"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }} />

              <motion.line x1={240} y1={146} x2={240} y2={172}
                stroke={C.db} strokeWidth={1.2} markerEnd="url(#dac-arrow)"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }} />

              {/* DB 도달 박스 */}
              <motion.g initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 }}>
                <DataBox x={195} y={175} w={90} h={30} label="DB 도달" color={C.db} />
              </motion.g>

              {/* 우회 경고 */}
              <AlertBox x={330} y={170} w={140} h={38} label="1축만 통제?" sub="나머지 축으로 우회 가능" color={C.block} />
            </motion.g>
          )}

          {/* ── Step 2: 계정 분리 + IP 그룹 ── */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={14} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">
                계정별 권한 + 허용 IP 바인딩
              </text>

              {/* 서비스 계정 */}
              <ModuleBox x={5} y={25} w={105} h={34} label="서비스 계정" sub="readWrite" color={C.db} />
              <text x={195} y={40} fontSize={8} fill="var(--muted-foreground)">SELECT/INSERT/UPDATE</text>
              <text x={195} y={52} fontSize={8} fill={C.block} fontWeight={600}>DELETE 미부여 (Soft Delete)</text>
              <Arrow x1={110} y1={42} x2={185} y2={42} color={C.db} />
              <DataBox x={370} y={28} w={100} h={28} label="WAS IP" color={C.db} />
              <Arrow x1={330} y1={42} x2={370} y2={42} color={C.db} dashed />

              {/* 관리자 계정 */}
              <ModuleBox x={5} y={68} w={105} h={34} label="관리자 계정" sub="DDL 포함" color={C.proxy} />
              <text x={195} y={83} fontSize={8} fill="var(--muted-foreground)">스키마 변경, 인덱스 관리</text>
              <text x={195} y={95} fontSize={8} fill="var(--muted-foreground)">기간 한정 접근</text>
              <Arrow x1={110} y1={85} x2={185} y2={85} color={C.proxy} />
              <DataBox x={370} y={71} w={100} h={28} label="점프서버 IP" color={C.proxy} />
              <Arrow x1={330} y1={85} x2={370} y2={85} color={C.proxy} dashed />

              {/* 백업 계정 */}
              <ModuleBox x={5} y={111} w={105} h={34} label="백업 계정" sub="SELECT+LOCK" color={C.user} />
              <text x={195} y={126} fontSize={8} fill="var(--muted-foreground)">읽기 전용, 데이터 변경 불가</text>
              <text x={195} y={138} fontSize={8} fill="var(--muted-foreground)">일일 백업 수행용</text>
              <Arrow x1={110} y1={128} x2={185} y2={128} color={C.user} />
              <DataBox x={370} y={114} w={100} h={28} label="백업서버 IP" color={C.user} />
              <Arrow x1={330} y1={128} x2={370} y2={128} color={C.user} dashed />

              {/* 비상 계정 */}
              <rect x={3} y={153} width={109} height={38} rx={8} fill="var(--card)" />
              <rect x={3} y={153} width={109} height={38} rx={8}
                fill={`${C.block}06`} stroke={C.block} strokeWidth={0.8} strokeDasharray="4 3" />
              <text x={57} y={170} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.block}>
                비상 계정
              </text>
              <text x={57} y={183} textAnchor="middle" fontSize={8} fill={C.block} opacity={0.7}>
                ALL, 평소 비활성
              </text>
              <text x={195} y={169} fontSize={8} fill={C.block} fontWeight={600}>CISO 승인 필수</text>
              <text x={195} y={181} fontSize={8} fill="var(--muted-foreground)">사용 후 전수 감사</text>
              <Arrow x1={112} y1={172} x2={185} y2={172} color={C.block} dashed />
              <AlertBox x={370} y={157} w={100} h={28} label="긴급 IP" sub="평소 빈 그룹" color={C.block} />
              <Arrow x1={330} y1={172} x2={370} y2={172} color={C.block} dashed />

              {/* 최소 권한 원칙 바 */}
              <rect x={50} y={200} width={380} height={18} rx={6} fill="var(--card)" stroke={C.proxy} strokeWidth={0.5} />
              <text x={240} y={213} textAnchor="middle" fontSize={8.5} fontWeight={600} fill={C.proxy}>
                최소 권한 원칙: 계정별로 필요한 최소 권한 + 접속 IP만 허용
              </text>
            </motion.g>
          )}

          {/* ── Step 3: 월간 로그 검토 순환 ── */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* 검토 항목 5개 (상단 좌측) */}
              <text x={110} y={14} textAnchor="middle" fontSize={9} fontWeight={700} fill="var(--foreground)">
                월간 검토 5대 항목
              </text>

              <StatusBox x={10} y={22} w={95} h={36} label="비인가 접근" color={C.block} progress={0.7} />
              <StatusBox x={115} y={22} w={95} h={36} label="대량 조회" color={C.user} progress={0.5} />
              <StatusBox x={10} y={65} w={95} h={36} label="권한밖 쿼리" color={C.proxy} progress={0.4} />
              <StatusBox x={115} y={65} w={95} h={36} label="비업무시간" color={C.user} progress={0.3} />
              <DataBox x={55} y={108} w={110} h={26} label="비상계정 사용" color={C.block} />

              {/* 순환 다이어그램 (우측) */}
              <text x={360} y={14} textAnchor="middle" fontSize={9} fontWeight={700} fill="var(--foreground)">
                PDCA 순환 구조
              </text>

              {/* 6단계 순환을 원형 배치 */}
              {(() => {
                const cx = 360, cy = 118, r = 72;
                const items = [
                  { label: '정책 수립', color: C.proxy },
                  { label: '솔루션 구현', color: C.proxy },
                  { label: '로그 생성', color: C.db },
                  { label: '정기 검토', color: C.user },
                  { label: '이상 조치', color: C.block },
                  { label: '정책 개선', color: C.proxy },
                ];
                const n = items.length;
                return (
                  <g>
                    {/* 순환 원 배경 */}
                    <circle cx={cx} cy={cy} r={r - 15} fill="none"
                      stroke="var(--border)" strokeWidth={0.5} strokeDasharray="3 3" />

                    {items.map((item, i) => {
                      const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
                      const x = cx + r * Math.cos(angle);
                      const y = cy + r * Math.sin(angle);

                      // 화살표: 현재 → 다음
                      const nextAngle = ((i + 1) / n) * Math.PI * 2 - Math.PI / 2;
                      const nx = cx + r * Math.cos(nextAngle);
                      const ny = cy + r * Math.sin(nextAngle);

                      // 시작/끝을 약간 줄여서 노드와 겹치지 않게
                      const dx = nx - x, dy = ny - y;
                      const len = Math.sqrt(dx * dx + dy * dy);
                      const gap = 22;
                      const sx = x + (dx / len) * gap;
                      const sy = y + (dy / len) * gap;
                      const ex = nx - (dx / len) * gap;
                      const ey = ny - (dy / len) * gap;

                      return (
                        <g key={i}>
                          {/* 화살표 (순환) */}
                          <motion.line x1={sx} y1={sy} x2={ex} y2={ey}
                            stroke={item.color} strokeWidth={1} markerEnd="url(#dac-arrow)"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.6 }}
                            transition={{ delay: 0.15 * i }} />

                          {/* 노드 */}
                          <motion.g
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 * i }}>
                            <circle cx={x} cy={y} r={18} fill="var(--card)"
                              stroke={item.color} strokeWidth={1} />
                            <text x={x} y={y + 1} textAnchor="middle"
                              fontSize={7.5} fontWeight={600} fill={item.color}>
                              {item.label}
                            </text>
                          </motion.g>
                        </g>
                      );
                    })}
                  </g>
                );
              })()}

              {/* 검토 항목 → 순환의 "정기 검토" 연결 */}
              <Arrow x1={165} y1={120} x2={270} y2={120} color="var(--muted-foreground)" dashed />
              <LabelBg x={195} y={110} w={50} h={13} />
              <text x={220} y={120} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">
                입력
              </text>

              {/* 핵심 메시지 */}
              <rect x={30} y={196} width={420} height={20} rx={6} fill="var(--card)" stroke={C.proxy} strokeWidth={0.5} />
              <text x={240} y={210} textAnchor="middle" fontSize={8.5} fontWeight={600} fill={C.proxy}>
                "도구를 샀다"가 아니라 "무엇을 발견하고 어떻게 대응했는가"가 심사 핵심
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
