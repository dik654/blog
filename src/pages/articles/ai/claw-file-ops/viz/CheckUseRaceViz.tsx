import SceneShell from "./SceneShell";

/**
 * 본문 대응: #boundary "canonicalize와 open 사이의 race를 줄인다".
 * 검사: workspace/link → canonical target이 root 안 → 통과.
 * 교체: 검사 뒤 symlink가 boundary 밖을 가리키도록 바뀜.
 * 사용: read·write가 path를 다시 resolve → 밖의 object를 염.
 * 완화: directory handle 아래에서 resolve(Linux openat2 RESOLVE_BENEATH 등, threat model에 따라 검토) + sandbox mount.
 */
const SCENES = [
  {
    label: "검사 (check)",
    summary: "canonical target이 root 안 → 통과",
    note: "workspace/link를 canonicalize하면 symlink를 따라간 실제 target workspace/data가 나옵니다. canonical root의 component prefix이므로 검사는 통과합니다.",
  },
  {
    label: "그 사이 교체",
    summary: "link가 boundary 밖을 가리킴",
    note: "검사가 끝난 뒤, 실제 read·write가 일어나기 전에 공격자나 다른 process가 같은 이름의 symlink를 boundary 밖 대상으로 바꿉니다. 검사 결과 '통과'는 이미 지난 상태에 대한 판정입니다.",
  },
  {
    label: "사용 (use)",
    summary: "path를 다시 resolve → 밖을 엶",
    note: "검사 뒤 read·write가 문자열 path를 다시 resolve하면 바뀐 link를 따라 boundary 밖 object를 엽니다. pinned workspace wrapper도 이 구조라 check-use race가 남습니다. 이것이 TOCTOU(검사 시점과 사용 시점의 차이)입니다.",
  },
  {
    label: "handle 기준 open",
    summary: "resolve와 open을 한 번에 제한",
    note: "Linux에서는 threat model에 따라 directory fd와 openat2의 RESOLVE_BENEATH·RESOLVE_NO_SYMLINKS 같은 기능을 검토할 수 있습니다. kernel이 그 open의 해석을 root 아래로 제한하므로 바뀐 link를 따라 밖으로 나가지 못합니다. 다른 platform은 handle 기반 API와 final object identity 재검증을 씁니다.",
  },
] as const;

const BLUE = "#2563eb";
const RED = "#dc2626";
const GREEN = "#059669";
const GRAY = "#94a3b8";

export default function CheckUseRaceViz() {
  return (
    <SceneShell
      eyebrow="Check · use race"
      title="검사한 path와 실제로 연 object가 달라지는 순간"
      description="점선 상자가 workspace boundary입니다. 화살표는 symlink가 가리키는 실제 target이고, 위쪽 띠는 검사·교체·사용이 일어나는 순서입니다."
      note="마지막 handle 장면은 portable string code만으로 완전히 없애기 어려운 race를 줄이는 방향이며, 모든 filesystem race를 없앤다는 뜻은 아닙니다. 본문은 그 위에 writable mount를 workspace로 제한한 sandbox를 마지막 경계로 겹쳐 둡니다."
      ariaLabel="symlink를 검사한 뒤 교체해 boundary 밖을 여는 TOCTOU 과정"
      scenes={SCENES}
      render={(active) => {
        const swapped = active >= 1;
        const opened = active === 2;
        const guarded = active === 3;
        const steps = ["검사", "교체", "사용"];
        return (
          <div className="min-w-0">
            <div className="grid grid-cols-3 gap-1">
              {steps.map((step, i) => (
                <span
                  key={step}
                  className={`rounded border px-1 py-1 text-center text-xs ${
                    i === active ? "border-primary font-bold text-foreground" : "border-border/60 text-muted-foreground"
                  }`}
                >
                  {`t${i + 1} ${step}`}
                </span>
              ))}
            </div>
            <svg viewBox="0 0 400 170" className="mx-auto mt-3 block w-full max-w-[26rem]" role="img" aria-label="workspace와 boundary 밖 대상, symlink 화살표">
              <rect x="6" y="8" width="240" height="154" rx="8" fill="none" stroke={BLUE} strokeWidth="1" strokeDasharray="5 4" />
              <text x="18" y="30" fontSize="14" fill={BLUE} fontWeight="700">workspace root</text>
              <rect x="18" y="56" width="104" height="48" rx="6" fill="none" stroke="#64748b" strokeWidth="1" />
              <text x="70" y="77" fontSize="14" textAnchor="middle" fill="#334155">link</text>
              <text x="70" y="95" fontSize="12" textAnchor="middle" fill="#64748b">(symlink)</text>
              <rect x="140" y="114" width="94" height="36" rx="6" fill="none" stroke={swapped ? GRAY : GREEN} strokeWidth={swapped ? 1 : 1.25} />
              <text x="187" y="137" fontSize="14" textAnchor="middle" fill={swapped ? GRAY : GREEN}>data/</text>
              <rect x="284" y="50" width="110" height="60" rx="8" fill="none" stroke={opened ? RED : GRAY} strokeWidth={opened ? 1.25 : 1} />
              <text x="339" y="75" fontSize="14" textAnchor="middle" fill={opened ? RED : "#64748b"}>boundary 밖</text>
              <text x="339" y="95" fontSize="14" textAnchor="middle" fill={opened ? RED : "#64748b"}>대상</text>
              {swapped ? (
                <>
                  <line x1="122" y1="80" x2="276" y2="80" stroke={guarded ? GRAY : RED} strokeWidth="1.25" strokeDasharray={guarded ? "4 3" : undefined} />
                  <polygon points="282,80 273,76 273,84" fill={guarded ? GRAY : RED} />
                </>
              ) : (
                <>
                  <line x1="112" y1="104" x2="138" y2="122" stroke={GREEN} strokeWidth="1.25" />
                  <polygon points="142,125 132,123 137,116" fill={GREEN} />
                </>
              )}
              {guarded ? (
                <>
                  <line x1="252" y1="70" x2="268" y2="90" stroke={RED} strokeWidth="1.25" />
                  <line x1="268" y1="70" x2="252" y2="90" stroke={RED} strokeWidth="1.25" />
                </>
              ) : null}
            </svg>
            <p className={`mt-2 text-center text-xs font-semibold ${guarded ? "text-[#059669]" : opened ? "text-[#dc2626]" : "text-muted-foreground"}`}>
              {guarded ? "root 아래에서만 해석 · 밖으로 나가는 resolve를 거부" : active === 0 ? "검사 결과: 통과" : opened ? "검사는 통과했는데 밖을 엶" : "검사 결과는 아직 '통과'"}
            </p>
          </div>
        );
      }}
    />
  );
}
