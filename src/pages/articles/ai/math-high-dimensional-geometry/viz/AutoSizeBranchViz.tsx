import SceneShell from "./SceneShell";

/**
 * 본문 대응: #source — 자동 크기 함수의 정수 변환과 fit의 거부 분기.
 * 4ln(n)/c → astype(np.int64)로 소수부 버림 → n_components_ > n_features면 ValueError (random_projection.py 145–146행, 402–403행).
 */
const BLUE = "#2563eb";
const AMBER = "#d97706";
const RED = "#dc2626";
const GRAY = "#64748b";
const W = 340;
const H = 204;
const lx = (value: number) => 50 + (value - 319) * 190;
const AXIS = 96;

function Box({ x, y, w, h, tone, children }: { x: number; y: number; w: number; h: number; tone: string; children: string }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={4} fill="none" stroke={tone} strokeWidth={1.25} />
      <text x={x + w / 2} y={y + h / 2 + 5} textAnchor="middle" fontSize={12} fontWeight={700} fill={tone}>{children}</text>
    </g>
  );
}

const SCENES = [
  { label: "식의 값", summary: "4ln(4)/c ≈ 319.914", note: "n=4, ε=0.2를 넣은 식의 값은 정수가 아닙니다. 부등식 k≥319.914를 지키는 가장 작은 정수는 320입니다." },
  { label: "소수부를 버림", summary: "코드 319 · 올림 320", note: "코드는 astype(np.int64)로 양수의 소수부를 버려 319를 돌려줍니다. 319는 319.914보다 작습니다. 백만 점과 ε=0.1에서도 코드는 11,841, 올림은 11,842입니다." },
  { label: "입력 크기와 비교", summary: "319 > 4 → ValueError", note: "fit의 자동 모드는 고른 크기가 입력 좌표 수보다 크면 예외를 냅니다. 319가 4보다 크므로 행렬을 만들기 전에 멈춥니다." },
  { label: "규칙이 보는 것", summary: "n·ε·D만 봄", note: "자동 규칙에는 점의 수, 허용 오차, 입력 칸 수만 들어갑니다. 점들이 한 직선에 있다는 구조는 들어가지 않으므로 이 예외는 압축 불가능 판정이 아닙니다." },
] as const;

export default function AutoSizeBranchViz() {
  return (
    <SceneShell
      eyebrow="자동 크기 선택의 경로"
      title="319.914가 319가 되고, 319는 4보다 커서 멈춥니다"
      description="수식에서 정수로, 정수에서 분기로 이어지는 코드 경로입니다. n=4, ε=0.2를 넣었습니다."
      note="고정한 원문의 분기와 독립 산술을 대조한 그림이며, 본문처럼 라이브러리를 설치해 실행한 결과가 아닙니다."
      ariaLabel="자동 크기 함수의 소수부 버림과 ValueError 분기"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {active < 2 && (
            <g>
              <line x1={30} x2={310} y1={AXIS} y2={AXIS} stroke="#94a3b8" strokeWidth={1} />
              {[319, 320].map((tick) => (
                <g key={tick}>
                  <line x1={lx(tick)} x2={lx(tick)} y1={AXIS - 8} y2={AXIS + 8} stroke={GRAY} strokeWidth={1} />
                  <text x={lx(tick)} y={AXIS + 26} textAnchor="middle" fontSize={13} fill={GRAY}>{tick}</text>
                </g>
              ))}
              <rect x={lx(319.914)} y={AXIS - 4} width={W - 30 - lx(319.914)} height={8} fill={BLUE} opacity={0.18} />
              <circle cx={lx(319.914)} cy={AXIS - 34} r={5} fill="var(--background)" stroke={AMBER} strokeWidth={1.25} />
              <text x={lx(319.914) + 10} y={AXIS - 30} fontSize={13} fontWeight={700} fill={AMBER}>약 319.914</text>
              <path d={`M ${lx(319.914)} ${AXIS - 28} V ${AXIS - 6}`} fill="none" stroke={AMBER} strokeWidth={1} strokeDasharray="3 3" />
              <text x={W - 30} y={AXIS + 52} textAnchor="end" fontSize={12} fill={BLUE}>색칠한 쪽이 충분조건을 만족</text>
              {active === 1 && (
                <g>
                  <path d={`M ${lx(319.914) - 4} ${AXIS - 36} Q ${lx(319.4)} ${AXIS - 62} ${lx(319)} ${AXIS - 12}`} fill="none" stroke={RED} strokeWidth={1.25} />
                  <circle cx={lx(319)} cy={AXIS} r={5} fill={RED} />
                  <text x={lx(319)} y={AXIS - 62} textAnchor="middle" fontSize={12} fontWeight={700} fill={RED}>코드: 버림</text>
                  <circle cx={lx(320)} cy={AXIS} r={5} fill={BLUE} />
                  <text x={lx(320) + 10} y={AXIS - 10} fontSize={12} fontWeight={700} fill={BLUE}>올림</text>
                </g>
              )}
            </g>
          )}
          {active === 2 && (
            <g>
              <Box x={110} y={6} w={120} h={32} tone={RED}>고른 크기 319</Box>
              <path d="M 170 38 V 62" fill="none" stroke={GRAY} strokeWidth={1} />
              <Box x={84} y={62} w={172} h={32} tone={GRAY}>{"319 > 입력 칸 수 4 ?"}</Box>
              <path d="M 110 94 L 66 130" fill="none" stroke={RED} strokeWidth={1.25} />
              <path d="M 230 94 L 274 130" fill="none" stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 3" />
              <text x={70} y={112} textAnchor="end" fontSize={12} fontWeight={700} fill={RED}>참</text>
              <text x={270} y={112} fontSize={12} fill={GRAY}>거짓</text>
              <Box x={12} y={130} w={132} h={36} tone={RED}>ValueError · 멈춤</Box>
              <rect x={196} y={130} width={132} height={36} rx={4} fill="none" stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 3" />
              <text x={262} y={153} textAnchor="middle" fontSize={12} fill={GRAY}>행렬을 만들기</text>
            </g>
          )}
          {active === 3 && (
            <g>
              {["점의 수 n=4", "허용 오차 ε=0.2", "입력 칸 수 D=4"].map((text, index) => (
                <g key={text}>
                  <Box x={8} y={8 + index * 44} w={136} h={32} tone={BLUE}>{text}</Box>
                  <path d={`M 144 ${24 + index * 44} L 204 68`} fill="none" stroke={BLUE} strokeWidth={1} />
                </g>
              ))}
              <Box x={204} y={46} w={126} h={44} tone={GRAY}>자동 규칙</Box>
              <rect x={8} y={146} width={136} height={32} rx={4} fill="none" stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 3" />
              <text x={76} y={167} textAnchor="middle" fontSize={12} fill={GRAY}>네 점이 한 직선 위</text>
              <path d="M 144 162 L 196 162" fill="none" stroke={RED} strokeWidth={1} strokeDasharray="3 3" />
              <text x={204} y={167} fontSize={12} fontWeight={700} fill={RED}>들어가지 않음</text>
            </g>
          )}
        </svg>
      )}
    />
  );
}
