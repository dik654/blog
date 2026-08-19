import type { CodeRef } from "@/components/code/types";
import chatTemplatesPy from "./codebase/unsloth/unsloth/chat_templates.py?raw";
import llamaPy from "./codebase/unsloth/unsloth/models/llama.py?raw";

export const codeRefs: Record<string, CodeRef> = {
  "double-bos-fix": {
    path: "unsloth/unsloth/chat_templates.py",
    code: chatTemplatesPy,
    lang: "python",
    highlight: [19, 50],
    desc: "문제: 이미 special token이 포함된 문자열을 template에 다시 넣으면 왜, 어떻게 training과 serving input이 달라지는지 실제 코드로 확인해야 합니다.\n\n해결: Unsloth의 get_chat_template()이 Gemma 계열 template에 {{ bos_token }}을 하드코딩해 주입하고, remove_special_tokens()가 tokenizer 인코딩 직전에 중복된 BOS를 지워 이중 삽입을 막습니다.",
    annotations: [
      { lines: [30, 35], color: "rose", note: "원인 절반 — chat template 문자열 자체에 BOS를 미리 넣어둠" },
      { lines: [41, 45], color: "emerald", note: "실제 fix — 인코딩 직전 문자열 앞의 중복 BOS를 제거" },
    ],
  },
  "lora-hyperparams": {
    path: "unsloth/unsloth/models/llama.py",
    code: llamaPy,
    lang: "python",
    highlight: [16, 57],
    desc: "문제: r·target_modules·lora_alpha·use_rslora를 실전에서 어떤 기본값으로 배분하는지 확인해야 합니다.\n\n해결: Unsloth의 get_peft_model() 기본값은 r=16, target_modules에 attention q·k·v·o와 MLP gate·up·down projection 7개 전부, lora_alpha=16(s=α/r=1), use_rslora=False입니다.",
    annotations: [
      { lines: [18, 21], color: "sky", note: "r — capacity와 파라미터/메모리 비용의 균형점" },
      { lines: [22, 33], color: "sky", note: "target_modules — attention·MLP 7개 linear 전부가 기본" },
      { lines: [45, 48], color: "amber", note: "article에는 없는 실제 옵션 — rank-stabilized LoRA(1/sqrt(r) scaling)" },
      { lines: [60, 72], color: "rose", note: "article에는 없는 실제 검증 — PEFT 버전이 rslora를 지원 안 하면 즉시 에러" },
    ],
  },
};
