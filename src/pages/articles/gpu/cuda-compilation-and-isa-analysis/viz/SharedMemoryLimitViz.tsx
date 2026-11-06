import SceneShell from "./SceneShell";

/**
 * 본문 대응: #capabilities — SM 상한 164/228 KB, block opt-in 상한 163/227 KB, 48 KB 경계, 196 KB 사례.
 * 숫자가 모두 본문에 있어 같은 KB 축에 실제 길이로 그린다. KB는 1024바이트 단위.
 */
const SCALE = 250;
const W = 360;
const LEFT = 62;
const AXIS_MAX = 240;
const px = (kb: number) => LEFT + (kb / AXIS_MAX) * SCALE;
const GROUPS = [
  { name: "8.0", sm: 164, block: 163, top: 28 },
  { name: "9.0", sm: 228, block: 227, top: 94 },
] as const;

const SCENES = [
  { label: "48 KB 경계", summary: "넘으면 설정 확인", note: "Block당 48 KB를 넘는 shared memory는 동적 할당과 해당 함수의 opt-in 설정(따로 켜는 설정)을 확인해야 합니다. 이 선은 상한이 아니라 추가 확인이 시작되는 자리입니다.", on: null },
  { label: "8.0에 196 KB", summary: "196 > 163 → 한도 초과", note: "196 KB를 한 block에 쓰면 8.0의 block당 opt-in 상한 163 KB를 넘습니다. SM 전체 164 KB를 block 하나의 허용량으로 읽지 않습니다.", on: 0 },
  { label: "9.0에 196 KB", summary: "196 ≤ 227 → 이 한도 안", note: "9.0의 block당 상한 227 KB 안에 들어갑니다. 이 자원 한도 하나를 통과했을 뿐이며 다른 launch 조건까지 통과했다는 뜻은 아닙니다.", on: 1 },
] as const;

export default function SharedMemoryLimitViz() {
  return (
    <SceneShell
      eyebrow="같은 축의 세 숫자"
      title="196 KB 한 block은 8.0에서 넘치고 9.0에서는 이 한도 안에 듭니다"
      description="가로축은 shared memory 용량(KB, 1 KB=1024바이트)입니다. SM 전체 상한, block 하나의 opt-in 상한, 48 KB 경계는 서로 다른 숫자입니다."
      ariaLabel="compute capability 8.0과 9.0의 SM 상한과 block 상한을 196 KB 사례 및 48 KB 경계와 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <svg viewBox={`0 0 ${W} 180`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            {GROUPS.map((group, index) => {
              const bright = scene.on === null || scene.on === index;
              return (
                <g key={group.name} opacity={bright ? 1 : 0.3}>
                  <text x={4} y={group.top + 22} fontSize={13} fontWeight={700} fill="#64748b">{group.name}</text>
                  <rect x={LEFT} y={group.top} width={px(group.sm) - LEFT} height={16} rx={2} fill="#94a3b8" />
                  <text x={px(48) + 5} y={group.top + 12} fontSize={10.5} fill="#0f172a">SM 상한 {group.sm}</text>
                  <rect x={LEFT} y={group.top + 20} width={px(group.block) - LEFT} height={16} rx={2} fill="#2563eb" />
                  <text x={px(48) + 5} y={group.top + 32} fontSize={10.5} fill="#ffffff">block 상한 {group.block}</text>
                </g>
              );
            })}
            <line x1={px(48)} x2={px(48)} y1={18} y2={140} stroke="#d97706" strokeWidth={1.25} strokeDasharray="3 2" />
            <text x={px(48)} y={13} textAnchor="middle" fontSize={11} fontWeight={700} fill="#d97706">48</text>
            <line x1={px(196)} x2={px(196)} y1={18} y2={140} stroke="#dc2626" strokeWidth={1.25} opacity={active === 0 ? 0.35 : 1} />
            <text x={px(196)} y={13} textAnchor="middle" fontSize={11} fontWeight={700} fill="#dc2626" opacity={active === 0 ? 0.35 : 1}>사례 196</text>
            <line x1={LEFT} x2={px(AXIS_MAX)} y1={146} y2={146} stroke="#94a3b8" strokeWidth={1} />
            {[0, 60, 120, 180, 240].map((kb) => (
              <g key={kb}>
                <line x1={px(kb)} x2={px(kb)} y1={146} y2={150} stroke="#94a3b8" strokeWidth={1} />
                <text x={px(kb)} y={163} textAnchor="middle" fontSize={10.5} fill="#64748b">{kb}</text>
              </g>
            ))}
            <text x={W - 2} y={177} textAnchor="end" fontSize={10.5} fill="#64748b">KB</text>
          </svg>
        );
      }}
    />
  );
}
