import SceneShell from "./SceneShell";

/**
 * 본문 대응: #artifact-reference — 줄바꿈 없는 UTF-8 "[0.2,0.8]"과 "[0.1,0.9]"는 둘 다 9바이트, 평균 0.50.
 * SHA-256: 3a865fbc… / 79cd929e… (shasum -a 256으로 재계산해 본문 값과 일치 확인).
 * R2가 P2를 읽어 기록된 digest와 비교하면 같은 경로의 덮어쓰기를 찾는다. 기록까지 바뀌면 일치가 진위를 보장하지 않는다.
 */
const OLD = "[0.2,0.8]";
const NEW = "[0.1,0.9]";
const OLD_DIGEST = "3a865fbc…";
const NEW_DIGEST = "79cd929e…";

const SCENES = [
  { label: "A2가 P2를 기록합니다", summary: "9바이트 · digest 3a865fbc…", note: "A2가 만든 예측 P2의 위치·크기·평균과 함께 내용 digest를 기록합니다. 지금은 파일과 기록이 같습니다.", bytes: OLD, recorded: OLD_DIGEST, current: OLD_DIGEST },
  { label: "다음 날 같은 경로를 덮어씁니다", summary: "위치·크기·평균은 그대로", note: "같은 경로에 [0.1,0.9]가 쓰였다고 둡니다(가정). 두 글자만 바뀌어 크기는 여전히 9바이트, 평균도 0.50입니다. 이 세 칸만 보면 바뀐 줄 모릅니다.", bytes: NEW, recorded: OLD_DIGEST, current: OLD_DIGEST },
  { label: "R2가 읽을 때 digest를 비교합니다", summary: "3a865fbc… ≠ 79cd929e…", note: "보고서 R2가 P2를 읽어 실제 bytes의 SHA-256을 다시 계산하면 79cd929e…가 나옵니다. 기록된 3a865fbc…와 달라 같은 경로가 새 내용으로 바뀐 것을 찾습니다.", bytes: NEW, recorded: OLD_DIGEST, current: NEW_DIGEST },
  { label: "기록까지 함께 바뀌면", summary: "일치해도 진위는 모름", note: "파일과 기록을 함께 악의적으로 바꾸면 두 digest가 다시 일치합니다. digest 비교는 기준 기록 자체를 믿을 수 있을 때만 근거가 됩니다.", bytes: NEW, recorded: NEW_DIGEST, current: NEW_DIGEST },
] as const;

export default function DigestCheckViz() {
  return (
    <SceneShell
      eyebrow="같은 경로, 다른 내용"
      title="위치·크기·평균이 같아도 digest는 바뀐 9바이트를 찾습니다"
      description="칸 하나가 1바이트입니다. 표의 왼쪽은 A2가 남긴 기록, 오른쪽은 지금 그 경로에서 읽은 파일입니다. digest는 bytes에 hash를 적용한 내용 식별값입니다."
      ariaLabel="예측 파일 P2의 9바이트가 덮어써졌을 때 위치·크기·평균과 SHA-256 digest 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const checked = active !== 1;
        const match = scene.recorded === scene.current;
        const tableRows = [
          { item: "위치", rec: "같은 경로", cur: "같은 경로", same: true },
          { item: "크기", rec: "9바이트", cur: "9바이트", same: true },
          { item: "평균", rec: "0.50", cur: "0.50", same: true },
          { item: "digest", rec: active === 3 ? `${scene.recorded} (함께 바뀜)` : scene.recorded, cur: checked ? scene.current : "아직 계산 안 함", same: match },
        ];
        return (
          <div className="min-w-0 space-y-4">
            <div>
              <div className="grid grid-cols-9 gap-1">
                {scene.bytes.split("").map((ch, index) => {
                  const changed = ch !== OLD[index];
                  return (
                    <span
                      key={index}
                      className={`flex h-9 items-center justify-center rounded-md border font-mono text-sm font-bold ${
                        changed ? "border-[#d97706] bg-[#d97706]/15 text-[#b45309] dark:text-[#f59e0b]" : "border-border"
                      }`}
                    >
                      {ch}
                    </span>
                  );
                })}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                P2의 실제 내용 · {scene.bytes === OLD ? "처음 기록한 그대로" : "주황 칸 2개가 바뀜"}
              </p>
            </div>

            <div className="text-xs sm:text-sm">
              <div className="grid grid-cols-[3.4rem_minmax(0,1fr)_minmax(0,1fr)_2.6rem] gap-x-2 border-b border-border pb-1 font-bold text-muted-foreground">
                <span>항목</span>
                <span>A2가 남긴 기록</span>
                <span>지금 읽은 파일</span>
                <span>비교</span>
              </div>
              {tableRows.map((row) => {
                const pending = row.item === "digest" && !checked;
                const alert = row.item === "digest" && checked && !row.same;
                return (
                  <div
                    key={row.item}
                    className={`grid min-h-9 grid-cols-[3.4rem_minmax(0,1fr)_minmax(0,1fr)_2.6rem] items-center gap-x-2 border-b border-border/60 py-1 ${alert ? "bg-[#dc2626]/10" : ""}`}
                  >
                    <span className="font-bold">{row.item}</span>
                    <span className="min-w-0 break-all font-mono">{row.rec}</span>
                    <span className={`min-w-0 break-keep ${row.item === "digest" ? "font-mono" : ""} ${pending ? "text-muted-foreground" : ""}`}>{row.cur}</span>
                    <span className={`font-bold ${alert ? "text-[#b91c1c] dark:text-[#f87171]" : pending ? "text-muted-foreground" : ""}`}>
                      {pending ? "?" : row.same ? "같음" : "다름"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      }}
    />
  );
}
