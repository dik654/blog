import SceneShell from "./SceneShell";
import SszTree from "./SszTree";
import { LIST_ROOT_LENGTH_3, type NodeTone, type TreeNodeId } from "./sszTreeData";

/**
 * 본문 대응: #merkleize — r_v = H(c_v‖ℓ₂), r = H(H(r_s‖r_v)‖H(r_e‖z)).
 * c_v = 10과 20을 8 bytes씩 little-endian으로 이어 쓰고 남은 16 bytes를 zero로 채운 32-byte chunk.
 * 확인 질문의 근거: limit 4와 실제 길이 2가 다르므로 같은 zero-padded data라도 길이를 구분해야 한다.
 * 가정 장면: [10, 20, 0]이면 data chunk는 같고 길이만 3 → list root 415b…3ba5 (직접 계산).
 */
interface BuildScene {
  label: string;
  summary: string;
  note: string;
  tones: Partial<Record<TreeNodeId, NodeTone>>;
  values?: Partial<Record<TreeNodeId, string>>;
  segment3: string;
  stripActive: boolean;
}

const SCENES: readonly BuildScene[] = [
  {
    label: "32-byte chunk로 맞추기",
    summary: "10 · 20 → data chunk 하나",
    note: "Chunk는 Merkle tree의 leaf 한 칸인 32 bytes입니다. uint64 10과 20은 8 bytes씩이라 한 chunk에 이어 넣고 남은 16 bytes는 zero로 채웁니다. slot 1과 epoch 3도 각각 32 bytes로 채운 chunk가 됩니다.",
    tones: { "4": "active", "6": "active", cv: "active" },
    segment3: "zero",
    stripActive: true,
  },
  {
    label: "길이 2를 섞기",
    summary: "H(data chunk ‖ length 2) = 9647…c266",
    note: "Data chunk 옆에 실제 원소 수 2를 담은 length chunk를 붙여 hash합니다. 이것이 mix-in-length이고, 결과가 validators field의 root입니다.",
    tones: { cv: "active", len: "active", "5": "target" },
    segment3: "zero",
    stripActive: false,
  },
  {
    label: "(가정) 길이 3이었다면",
    summary: "같은 chunk · 다른 root 415b…3ba5",
    note: "비교를 위한 가정으로 [10, 20, 0]을 넣으면 세 번째 원소 0이 zero padding과 같은 bytes라 data chunk가 똑같습니다. List limit은 4인데 실제 길이는 2와 3으로 다르므로, 길이 chunk가 없으면 두 값을 구분할 수 없습니다.",
    tones: { cv: "active", len: "sibling", "5": "sibling" },
    values: { len: "03…00", "5": LIST_ROOT_LENGTH_3, "2": "달라짐", "1": "달라짐" },
    segment3: "0 (세 번째)",
    stripActive: true,
  },
  {
    label: "폭 4로 채우기",
    summary: "field 3개 + zero leaf 1개",
    note: "Container field는 slot, validators, epoch 세 개입니다. 이진 tree는 2의 거듭제곱 폭이 필요하므로 폭 4로 올리고 네 번째 leaf를 zero로 둡니다. 왼쪽부터 field 순서를 지킵니다.",
    tones: { "4": "active", "5": "active", "6": "active", "7": "sibling" },
    segment3: "zero",
    stripActive: false,
  },
  {
    label: "두 층을 hash",
    summary: "root = 9dfd…32cc",
    note: "이웃한 두 칸을 이어 hash해 한 층씩 올라갑니다. H(slot‖validators)와 H(epoch‖zero)를 다시 hash한 값이 container root입니다. 중간 두 값은 본문 숫자로 직접 다시 계산한 것입니다.",
    tones: { "2": "active", "3": "active", "1": "target", "4": "base", "5": "base", "6": "base", "7": "base" },
    segment3: "zero",
    stripActive: false,
  },
];

export default function MerkleBuildViz() {
  return (
    <SceneShell
      eyebrow="Merkleization"
      title="Wire bytes가 아니라 field별 32-byte 칸을 쌓아 Root를 만듭니다"
      description="위 띠는 validators data chunk 32 bytes이고 칸 하나가 8 bytes입니다. 아래 상자 번호는 tree 위치이며 H는 SHA-256입니다."
      ariaLabel="DemoRecord의 chunk packing, mix-in-length, 폭 4 tree와 root 계산"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const segments = ["10", "20", scene.segment3, "zero"];
        return (
          <div className="min-w-0 space-y-3">
            <div>
              <span className="text-[11px] text-muted-foreground">validators data chunk · 32 B</span>
              <div className="mt-1 grid grid-cols-4 gap-px rounded-md border border-border p-px">
                {segments.map((segment, index) => (
                  <div
                    key={index}
                    className={`min-w-0 px-1 py-1.5 text-center font-mono text-[11px] leading-4 sm:text-xs ${
                      scene.stripActive && index < 3 && segment !== "zero" ? "bg-primary/10 font-bold text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {segment}
                    <span className="block text-[9px] font-normal text-muted-foreground">bytes {index * 8}–{index * 8 + 7}</span>
                  </div>
                ))}
              </div>
            </div>
            <SszTree tones={scene.tones} values={scene.values} showList ariaLabel={`${scene.label}: ${scene.summary}`} />
          </div>
        );
      }}
    />
  );
}
