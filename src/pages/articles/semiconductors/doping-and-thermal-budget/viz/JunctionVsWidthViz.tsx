import SceneShell from "./SceneShell";

/**
 * 본문 대응: #source 마지막 문단 — 1/e 깊이(폭 척도)와 배경 농도와 만나는 깊이는 다르다.
 * 첫 표면=1. C₁(z)=exp[−(z/120)²], C₂(z)=(1/√3)·exp[−(z/207.85)²].
 * 1/e 지점: C₁(120)=0.368, C₂(207.85)=0.577/e≈0.212.
 * 배경 0.01(가정, 첫 표면의 1/100): 120√ln100≈258 nm, 207.85√ln(100/√3)≈419 nm.
 * 세로축은 로그 눈금 1 → 0.001.
 */
const A1 = 120;
const A2 = 207.85;
const K2 = 1 / Math.sqrt(3);
const BG = 0.01;
const J1 = A1 * Math.sqrt(Math.log(100));
const J2 = A2 * Math.sqrt(Math.log(100 / Math.sqrt(3)));
const ZMAX = 500;
const X0 = 54;
const X1 = 362;
const Y0 = 214;
const Y1 = 24;
const FLOOR = 0.001;
const sx = (z: number) => X0 + (z / ZMAX) * (X1 - X0);
const sy = (c: number) => Y1 + (-Math.log10(Math.max(c, FLOOR)) / 3) * (Y0 - Y1);
const c1 = (z: number) => Math.exp(-((z / A1) ** 2));
const c2 = (z: number) => K2 * Math.exp(-((z / A2) ** 2));
const ZS = Array.from({ length: 101 }, (_, i) => i * 5);
const curve = (f: (z: number) => number) =>
  ZS.filter((z) => f(z) >= FLOOR)
    .map((z) => `${sx(z).toFixed(1)},${sy(f(z)).toFixed(1)}`)
    .join(" ");
const LINE1 = curve(c1);
const LINE2 = curve(c2);
const FIRST = "#d97706";
const SECOND = "#2563eb";
const BACK = "#7c3aed";

const SCENES = [
  {
    label: "폭 척도는 1/e 지점",
    summary: "120 nm · 약 208 nm",
    note: "각 곡선이 자기 표면 값의 1/e로 내려가는 깊이가 폭 척도입니다. 첫 단계는 120 nm에서 0.368, 두 단계 뒤는 약 208 nm에서 0.577/e ≈ 0.212입니다.",
  },
  {
    label: "배경 농도를 하나 더 가정하면",
    summary: "첫 단계: 약 258 nm에서 만남",
    note: "반대 종류의 일정한 배경 농도가 첫 표면의 1/100이라고 추가로 가정합니다(가정). 첫 곡선은 120√ln100 ≈ 258 nm에서 이 선과 같아집니다. 120 nm와 다른 깊이입니다.",
  },
  {
    label: "두 단계 뒤",
    summary: "약 419 nm에서 만남",
    note: "같은 가정에서 두 단계 뒤 곡선은 207.85√ln(100/√3) ≈ 419 nm에서 배경과 같아집니다. 만나는 깊이는 폭 척도에서 바로 읽히지 않고 배경과 같아지는 위치를 따로 풀어야 나옵니다.",
  },
] as const;

export default function JunctionVsWidthViz() {
  return (
    <SceneShell
      eyebrow="폭 척도와 만나는 깊이"
      title="1/e 깊이와 배경과 만나는 깊이는 다릅니다"
      description="세로축은 첫 표면 농도를 1로 둔 로그 눈금이라 한 칸 내려갈 때마다 10분의 1입니다. 가로축은 표면에서 잰 깊이입니다. D·시간과 배경 농도는 모두 가정입니다."
      ariaLabel="로그 눈금 농도 곡선에서 1 나누기 e 지점과 배경 농도 교차점 비교"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 376 256" className="mx-auto h-auto w-full max-w-[540px]" role="img" aria-label="로그 눈금 깊이 대 농도 곡선">
          {[1, 0.1, 0.01, 0.001].map((c) => (
            <g key={c}>
              <line x1={X0} y1={sy(c)} x2={X1} y2={sy(c)} stroke="#94a3b8" strokeWidth={1} opacity={0.35} />
              <text x={X0 - 6} y={sy(c) + 5} fontSize={13} textAnchor="end" fill="currentColor">{c}</text>
            </g>
          ))}
          <line x1={X0} y1={Y0} x2={X1} y2={Y0} stroke="#94a3b8" strokeWidth={1} />
          <line x1={X0} y1={Y0} x2={X0} y2={Y1} stroke="#94a3b8" strokeWidth={1} />
          {[0, 100, 200, 300, 400, 500].map((z) => (
            <text key={z} x={sx(z)} y={Y0 + 18} fontSize={14} textAnchor="middle" fill="currentColor">{z}</text>
          ))}
          <text x={X1} y={Y0 + 36} fontSize={14} textAnchor="end" fill="currentColor">깊이 (nm)</text>
          <polyline points={LINE1} fill="none" stroke={FIRST} strokeWidth={1.25} opacity={active === 2 ? 0.4 : 1} />
          <polyline points={LINE2} fill="none" stroke={SECOND} strokeWidth={1.25} opacity={active === 1 ? 0.4 : 1} />
          <line x1={262} y1={24} x2={284} y2={24} stroke={FIRST} strokeWidth={1.25} />
          <text x={290} y={29} fontSize={13} fill={FIRST} fontWeight={700}>첫 단계</text>
          <line x1={262} y1={42} x2={284} y2={42} stroke={SECOND} strokeWidth={1.25} />
          <text x={290} y={47} fontSize={13} fill={SECOND} fontWeight={700}>두 단계 뒤</text>
          {active === 0 ? (
            <g>
              <circle cx={sx(A1)} cy={sy(c1(A1))} r={4} fill={FIRST} />
              <text x={sx(A1) - 8} y={sy(c1(A1)) + 20} fontSize={13} textAnchor="end" fill={FIRST} fontWeight={700}>120 nm</text>
              <circle cx={sx(A2)} cy={sy(c2(A2))} r={4} fill={SECOND} />
              <text x={sx(A2) + 8} y={sy(c2(A2)) - 8} fontSize={13} fill={SECOND} fontWeight={700}>약 208 nm</text>
            </g>
          ) : (
            <g>
              <line x1={X0} y1={sy(BG)} x2={X1} y2={sy(BG)} stroke={BACK} strokeWidth={1.25} strokeDasharray="6 4" />
              <text x={X0 + 6} y={sy(BG) + 18} fontSize={13} fill={BACK} fontWeight={700}>배경 0.01 (가정)</text>
            </g>
          )}
          {active === 1 ? (
            <g>
              <line x1={sx(J1)} y1={sy(BG)} x2={sx(J1)} y2={Y0} stroke={FIRST} strokeWidth={1} strokeDasharray="3 3" />
              <circle cx={sx(J1)} cy={sy(BG)} r={4} fill={FIRST} />
              <text x={sx(J1) - 6} y={sy(BG) - 8} fontSize={13} textAnchor="end" fill={FIRST} fontWeight={700}>약 258 nm</text>
            </g>
          ) : null}
          {active === 2 ? (
            <g>
              <line x1={sx(J2)} y1={sy(BG)} x2={sx(J2)} y2={Y0} stroke={SECOND} strokeWidth={1} strokeDasharray="3 3" />
              <circle cx={sx(J2)} cy={sy(BG)} r={4} fill={SECOND} />
              <text x={sx(J2) - 6} y={sy(BG) - 8} fontSize={13} textAnchor="end" fill={SECOND} fontWeight={700}>약 419 nm</text>
            </g>
          ) : null}
        </svg>
      )}
    />
  );
}
