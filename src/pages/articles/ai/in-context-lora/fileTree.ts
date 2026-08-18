import type { FileNode } from "@/components/code/types";

const f = (name: string, path: string, codeKey?: string): FileNode => ({
  name,
  type: "file",
  path,
  codeKey,
});
const d = (name: string, children: FileNode[]): FileNode => ({
  name,
  type: "dir",
  children,
});

export const inContextLoraTree: FileNode = d("id-lora", [
  d("packages", [
    d("ltx-trainer", [
      d("configs", [
        f(
          "ltx2_v2v_ic_lora.yaml",
          "id-lora/packages/ltx-trainer/configs/ltx2_v2v_ic_lora.yaml",
          "lora-config",
        ),
      ]),
      d("src/ltx_trainer/training_strategies", [
        f(
          "audio_ref_only_ic.py",
          "id-lora/packages/ltx-trainer/src/ltx_trainer/training_strategies/audio_ref_only_ic.py",
          "reference-conditioning",
        ),
      ]),
    ]),
  ]),
  d("scripts", [
    f(
      "inference_two_stage.py",
      "id-lora/scripts/inference_two_stage.py",
      "identity-guidance",
    ),
  ]),
]);
