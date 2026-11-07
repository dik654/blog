import SceneShell from "./SceneShell";

/**
 * 본문 대응: #current — 국소 전하를 0부터 양끝 전압까지 더한 넓이가 전류식이 된다.
 * 사각형 Vov·VDS − 삼각형 VDS²/2 = 넓이, 넓이 × k(1 mA/V², 가정) = 전류.
 * 0.2: 0.2−0.02=0.18 / 0.8: 0.8−0.32=0.48 / 1.0: 1.0−0.5=0.5 / 1.5: 넓이 유지 0.5 / Vov 1.5: 2.25−1.125=1.125.
 */
const AX = 36;
const AY = 166;
const PX = 124;
const PY_V = 100;
const PY_I = 120;

const SCENES = [
  { label: "양끝 0.2 V", summary: "0.2 − 0.02 = 0.18 mA", ov: 1, ds: 0.2, area: 0.18, note: "더하는 구간이 짧아 잃는 삼각형이 작습니다. 사각형 1.0×0.2=0.2에서 0.2²/2=0.02만 빠져 전류는 양끝 전압에 거의 비례합니다." },
  { label: "양끝 0.8 V", summary: "0.8 − 0.32 = 0.48 mA", ov: 1, ds: 0.8, area: 0.48, note: "구간이 넓어질수록 삼각형이 빠르게 커집니다. 0.48 mA는 이상 포화값 0.5 mA의 96%로, 경계에 오기 전부터 곡선이 평평해집니다." },
  { label: "양끝 1.0 V", summary: "1.0 − 0.5 = 0.5 mA", ov: 1, ds: 1, area: 0.5, note: "드레인 끝의 여유가 0이 되어 더할 구간의 끝에 닿았습니다. 경계인 1.0 V를 식에 넣어 이어 붙인 값이며, 경계의 실제 전기장까지 정확히 푼 결과는 아닙니다." },
  { label: "양끝 1.5 V", summary: "넓이 그대로 0.5 mA", ov: 1, ds: 1.5, area: 0.5, note: "이 적분은 채널이 끝까지 이어질 때만 유효합니다. 잘록해진 뒤 이상적인 긴 채널 모형에서는 1.0 V를 넘는 구간을 더하지 않고 0.5 mA를 유지합니다." },
  { label: "게이트 2.0 V (가정)", summary: "1.5²/2 = 1.125 mA", ov: 1.5, ds: 1.5, area: 1.125, note: "k와 문턱을 그대로 두고 게이트만 올리면 여분 전압이 1.5 V가 되어 시작 높이와 더할 구간이 함께 늘어납니다. 포화 시작 전압 1.5 V, 포화 전류 1.125 mA입니다." },
] as const;

const SAMPLES = Array.from({ length: 31 }, (_, index) => (index / 30) * 1.5);
const ix = (v: number) => AX + v * PX;
const ay = (v: number) => AY - v * PY_V;
const iy = (i: number) => AY - i * PY_I;
const current = (ov: number, ds: number) => {
  const d = Math.min(ds, ov);
  return ov * d - (d * d) / 2;
};
const curvePoints = (ov: number) => SAMPLES.map((ds) => `${ix(ds).toFixed(1)},${iy(current(ov, ds)).toFixed(1)}`).join(" ");

export default function ChargeAreaCurrentViz() {
  return (
    <SceneShell
      eyebrow="국소 전하를 길 따라 더하기"
      title="전류식의 두 항은 그림의 어떤 넓이일까요"
      description="넓이 그림의 가로축은 소스 0 V에서 드레인까지 오르는 채널 전압, 세로축은 그 자리의 여유(여분 전압−그 자리 전압)입니다. 여유가 곧 그 자리의 전자 전하에 비례합니다. k=1 mA/V²와 전압은 가정입니다."
      note="파란 넓이 × k가 전류입니다. 긴 채널·일정 이동도를 둔 이상 모델이며, 실제 소자는 경계 부근과 포화에서 이 값과 다를 수 있습니다."
      ariaLabel="넓이로 읽는 드레인 전류와 전류 곡선의 대응"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const d = Math.min(scene.ds, scene.ov);
        const over = scene.ds > scene.ov;
        return (
          <div className="grid min-w-0 gap-3 sm:grid-cols-2">
            <svg viewBox="0 0 240 196" className="mx-auto h-auto w-full max-w-[250px] sm:max-w-none" role="img" aria-label={`넓이: ${scene.summary}`}>
              <text x={AX} y={12} fontSize={10} fill="currentColor">그 자리의 여유 (V)</text>
              <polygon points={`${ix(0)},${ay(scene.ov)} ${ix(d)},${ay(scene.ov)} ${ix(d)},${ay(scene.ov - d)}`} fill="#d97706" fillOpacity={0.28} stroke="#d97706" strokeWidth={1} strokeDasharray="3 2" />
              <polygon points={`${ix(0)},${ay(0)} ${ix(0)},${ay(scene.ov)} ${ix(d)},${ay(scene.ov - d)} ${ix(d)},${ay(0)}`} fill="#2563eb" fillOpacity={0.45} stroke="#2563eb" strokeWidth={1} />
              {over && <line x1={ix(d)} x2={ix(scene.ds)} y1={AY - 4} y2={AY - 4} stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 3" />}
              {over && <text x={(ix(d) + ix(scene.ds)) / 2} y={AY - 9} textAnchor="middle" fontSize={10} fill="currentColor">안 더함</text>}
              <line x1={AX} x2={ix(1.5)} y1={AY} y2={AY} stroke="#94a3b8" strokeWidth={1} />
              <line x1={AX} x2={AX} y1={ay(1.5)} y2={AY} stroke="#94a3b8" strokeWidth={1} />
              <text x={AX - 4} y={ay(scene.ov) + 4} textAnchor="end" fontSize={10} fill="currentColor">{scene.ov.toFixed(1)}</text>
              <text x={AX} y={AY + 13} textAnchor="middle" fontSize={10} fill="currentColor">0</text>
              <text x={ix(d)} y={AY + 13} textAnchor="middle" fontSize={10} fill="currentColor">{d.toFixed(1)}</text>
              {over && <text x={ix(scene.ds)} y={AY + 13} textAnchor="middle" fontSize={10} fill="currentColor">1.5</text>}
              <text x={ix(1.5)} y={AY + 26} textAnchor="end" fontSize={10} fill="currentColor">채널 전압 (V)</text>
            </svg>
            <svg viewBox="0 0 240 196" className="mx-auto h-auto w-full max-w-[250px] sm:max-w-none" role="img" aria-label={`전류 곡선 위 위치: ${scene.summary}`}>
              <text x={AX} y={12} fontSize={10} fill="currentColor">드레인 전류 (mA)</text>
              <polyline points={curvePoints(1)} fill="none" stroke={scene.ov === 1 ? "#2563eb" : "#94a3b8"} strokeWidth={1.25} />
              {scene.ov !== 1 && <polyline points={curvePoints(scene.ov)} fill="none" stroke="#2563eb" strokeWidth={1.25} />}
              {scene.ov !== 1 && <text x={ix(1.5)} y={iy(0.5) - 5} textAnchor="end" fontSize={10} fill="currentColor">게이트 1.5 V 곡선</text>}
              <line x1={AX} x2={ix(1.5)} y1={AY} y2={AY} stroke="#94a3b8" strokeWidth={1} />
              <line x1={AX} x2={AX} y1={iy(1.25)} y2={AY} stroke="#94a3b8" strokeWidth={1} />
              <text x={AX - 4} y={iy(0.5) + 4} textAnchor="end" fontSize={10} fill="currentColor">0.5</text>
              <text x={AX} y={AY + 13} textAnchor="middle" fontSize={10} fill="currentColor">0</text>
              <text x={ix(1)} y={AY + 13} textAnchor="middle" fontSize={10} fill="currentColor">1.0</text>
              <text x={ix(1.5)} y={AY + 13} textAnchor="middle" fontSize={10} fill="currentColor">1.5</text>
              <circle cx={ix(scene.ds)} cy={iy(scene.area)} r={4} fill="#ea580c" />
              <text x={ix(scene.ds) - (scene.ds > 1.2 ? 8 : 0)} y={iy(scene.area) - 9} textAnchor={scene.ds > 1.2 ? "end" : "middle"} fontSize={11} fontWeight={700} fill="#ea580c">{scene.area} mA</text>
              <text x={ix(1.5)} y={AY + 26} textAnchor="end" fontSize={10} fill="currentColor">양끝 전압 (V)</text>
            </svg>
            <p className="text-xs leading-5 text-muted-foreground sm:col-span-2">
              파랑+주황 사각형 = 첫 항(여분 전압 × 양끝 전압) · <span className="font-semibold" style={{ color: "#d97706" }}>주황 점선 삼각형</span> = 빠지는 항(양끝 전압²/2) · <span className="font-semibold" style={{ color: "#2563eb" }}>파랑</span> = 남아서 실제로 더한 전하 몫
            </p>
          </div>
        );
      }}
    />
  );
}
