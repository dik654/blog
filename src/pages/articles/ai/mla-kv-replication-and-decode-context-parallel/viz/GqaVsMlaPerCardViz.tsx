import SceneShell from "./SceneShell";

/**
 * 본문 대응: #other-architectures — token 하나의 KV byte(BF16).
 * Qwen3-235B-A22B(GQA): 94층 × KV head 4 × (K 128 + V 128) × 2 byte = 192,512, TP8에서 장마다 head 1개 = 48,128, DCP 2 → 24,064.
 * Kimi K2.5(MLA): 61층 × 576 × 2 byte = 70,272, TP8에서도 장마다 70,272, DCP 8 → 8,784.
 */
const QWEN_TOTAL = 94 * 4 * 256 * 2; // 192,512
const QWEN_TP8 = 94 * 1 * 256 * 2; // 48,128
const QWEN_DCP2 = QWEN_TP8 / 2; // 24,064
const K25 = 61 * 576 * 2; // 70,272
const K25_DCP8 = K25 / 8; // 8,784

const SCENES = [
  {
    label: "token 하나, 모델 전체",
    summary: "Qwen이 약 2.7배",
    qwen: QWEN_TOTAL,
    kimi: K25,
    qwenTag: "94층 × head 4 × 256 × 2 byte",
    kimiTag: "61층 × 576 × 2 byte",
    note: "Qwen3-235B-A22B는 94층마다 KV head 4개가 K 128개, V 128개를 남겨 token 하나에 192,512 byte입니다. Kimi K2.5는 61층마다 576개라 70,272 byte로, Qwen이 약 2.7배 큽니다.",
  },
  {
    label: "TP8, GPU 한 장",
    summary: "순위가 뒤집힘",
    qwen: QWEN_TP8,
    kimi: K25,
    qwenTag: "head 1개 · 같은 기록 2벌",
    kimiTag: "나눌 head 없음 · 같은 기록 8벌",
    note: "TP8에서 Qwen은 head 4개를 두 장씩 나눠 들어 장마다 head 하나, 48,128 byte입니다. K2.5는 나눌 head 경계가 없어 70,272 byte가 장마다 그대로 놓입니다. 전체로는 작은 K2.5가 장 단위로는 더 큽니다.",
  },
  {
    label: "DCP를 상한까지",
    summary: "24,064 대 8,784",
    qwen: QWEN_DCP2,
    kimi: K25_DCP8,
    qwenTag: "DCP ≤ 8 ÷ 4 = 2",
    kimiTag: "DCP ≤ TP 8",
    note: "DCP 상한은 Qwen이 TP 8을 KV head 4로 나눈 2, K2.5는 TP 크기인 8입니다. Qwen은 같은 기록 2벌을 2로 나눠 24,064 byte, K2.5는 8벌을 8로 나눠 8,784 byte가 됩니다. 복제가 2배뿐이면 되찾는 몫도 2배뿐입니다.",
  },
] as const;

const fmt = (bytes: number) => bytes.toLocaleString("en-US");

function Row({ name, kind, bytes, tag, color }: { name: string; kind: string; bytes: number; tag: string; color: string }) {
  const width = (bytes / QWEN_TOTAL) * 100;
  return (
    <div className="min-w-0">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 text-xs sm:text-sm">
        <span className="font-semibold">
          {name} <span className="font-normal text-muted-foreground">{kind}</span>
        </span>
        <span className="font-mono font-bold">{fmt(bytes)} B</span>
      </div>
      <div className="mt-1 h-5 min-w-0 rounded-sm bg-muted/40">
        <div className="h-full rounded-sm transition-[width] duration-300 motion-reduce:transition-none" style={{ width: `${width}%`, backgroundColor: color }} />
      </div>
      <p className="mt-1 text-xs text-muted-foreground">{tag}</p>
    </div>
  );
}

export default function GqaVsMlaPerCardViz() {
  return (
    <SceneShell
      eyebrow="GQA와 MLA의 장당 기록"
      title="token당 기록이 2.7배 큰 GQA 모델이 GPU 한 장에서는 더 작습니다"
      description="막대는 token 하나가 남기는 KV byte(숫자당 2 byte)이고, 길이는 Qwen 전체 192,512 byte를 기준으로 맞췄습니다. GQA는 query head 여러 개가 KV head 하나를 함께 읽는 구조라 KV head 수만큼은 GPU에 나눌 수 있습니다. 모든 값은 config 숫자로 한 계산입니다(계산)."
      ariaLabel="Qwen3-235B-A22B와 Kimi K2.5의 token당 KV byte를 모델 전체, TP8 장당, DCP 상한에서 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="space-y-4">
            <Row name="Qwen3-235B-A22B" kind="GQA" bytes={scene.qwen} tag={scene.qwenTag} color="#2563eb" />
            <Row name="Kimi K2.5" kind="MLA" bytes={scene.kimi} tag={scene.kimiTag} color="#d97706" />
          </div>
        );
      }}
    />
  );
}
