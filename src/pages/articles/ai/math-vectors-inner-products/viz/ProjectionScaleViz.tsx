import { Arrow, Plane } from "./PlaneParts";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #projection — u=(3,4). v=(1,0): c=3. v=(2,0): c=6/4=1.5. 분모 없이 6×(2,0)=(12,0).
 * 기준 화살표를 c개 이어 붙인 띠로 배율을 보인다. 남은 부분의 내적은 (0,4)·v=0, (−9,4)·(2,0)=−18.
 */
const SCENES = [
  { label: "기준 (1,0)", summary: "(3 ÷ 1) × (1,0) = (3,0)", vLen: 1, c: 3, note: "내적 3, 기준 길이의 제곱 1이라 배율은 3입니다. 길이 1짜리 기준을 세 개 이으면 (3,0)입니다." },
  { label: "기준 (2,0)", summary: "(6 ÷ 4) × (2,0) = (3,0)", vLen: 2, c: 1.5, note: "기준이 두 배가 되자 내적은 6, 분모는 4가 됩니다. 길이 2짜리 기준을 1.5개 이으면 결과는 여전히 (3,0)입니다." },
  { label: "분모를 빼면", summary: "6 × (2,0) = (12,0)", vLen: 2, c: 6, note: "내적 6에 기준을 바로 곱하면 (12,0)까지 나갑니다. 기준의 크기를 두 번 반영한 결과라 남은 (−9,4)와 기준의 내적이 −18이 되어 직각도 아닙니다." },
  { label: "직각이 되는 배율", summary: "(u−cv)·v = 0 → c = 1.5", vLen: 2, c: 1.5, note: "배율 c는 남은 u−cv가 기준과 직각이 되도록 정한 값입니다. c=1.5이면 남은 부분은 (0,4)이고 (0,4)·(2,0)=0입니다. 두 부분을 더하면 다시 (3,4)입니다." },
] as const;

export default function ProjectionScaleViz() {
  return (
    <SceneShell
      eyebrow="기준 길이 보정"
      title="기준 화살표를 몇 개 이을지 정하는 것이 v·v로 나눈 배율입니다"
      description="u=(3,4)가 기준선 위에 남기는 부분을 구합니다. 아래 띠 한 토막이 기준 화살표 하나입니다. 모눈 한 칸은 두 축에서 같은 길이입니다."
      ariaLabel="기준 길이에 따른 투영 배율과 결과 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const end = scene.vLen * scene.c;
        const pieces = Array.from({ length: Math.ceil(scene.c) }, (_, index) => index);
        const right = active === 3 || active === 0 || active === 1;
        return (
          <Plane
            minX={0}
            maxX={13}
            minY={-2}
            maxY={5}
            unit={26}
            className="mx-auto h-auto w-full max-w-[560px]"
            label={`${scene.label}: ${scene.summary}`}
            render={(sx, sy) => (
              <>
                <Arrow x1={sx(0)} y1={sy(0)} x2={sx(3)} y2={sy(4)} color="#475569" />
                <text x={sx(3) - 8} y={sy(4) + 3} textAnchor="end" fontSize={12} fontWeight={700} fill="#475569">u=(3,4)</text>
                <Arrow x1={sx(0)} y1={sy(0)} x2={sx(end)} y2={sy(0)} color={active === 2 ? "#dc2626" : "#2563eb"} />
                <text x={right ? sx(3) - 5 : sx(end)} y={sy(0) - 8} textAnchor={right ? "end" : "middle"} fontSize={12} fontWeight={700} fill={active === 2 ? "#dc2626" : "#2563eb"}>({end},0)</text>
                <Arrow x1={sx(end)} y1={sy(0)} x2={sx(3)} y2={sy(4)} color={right ? "#d97706" : "#dc2626"} dashed opacity={active === 3 ? 1 : 0.75} />
                {right && <path d={`M ${sx(3) - 9} ${sy(0)} V ${sy(0) - 9} H ${sx(3)}`} fill="none" stroke="#d97706" strokeWidth={1} />}
                <text x={right ? sx(3) + 7 : sx(7.5) + 8} y={right ? sy(2) : sy(2) - 4} fontSize={12} fill={right ? "#d97706" : "#dc2626"}>{right ? "남은 (0,4)" : "남은 (−9,4)"}</text>
                {pieces.map((piece) => {
                  const start = piece * scene.vLen;
                  const stop = Math.min(start + scene.vLen, end);
                  return (
                    <g key={piece}>
                      <rect x={sx(start) + 1} y={sy(-0.6)} width={sx(stop) - sx(start) - 2} height={12} rx={2} fill="#2563eb" opacity={piece % 2 === 0 ? 0.8 : 0.45} />
                    </g>
                  );
                })}
                <text x={sx(0)} y={sy(-1.75)} fontSize={12} fill="#64748b">기준 길이 {scene.vLen}짜리 토막 {scene.c}개</text>
              </>
            )}
          />
        );
      }}
    />
  );
}
