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

export const unslothTree: FileNode = d("unsloth", [
  d("unsloth", [
    f(
      "chat_templates.py — remove_special_tokens",
      "unsloth/unsloth/chat_templates.py",
      "double-bos-fix",
    ),
    d("models", [
      f(
        "llama.py — get_peft_model",
        "unsloth/unsloth/models/llama.py",
        "lora-hyperparams",
      ),
    ]),
  ]),
]);
