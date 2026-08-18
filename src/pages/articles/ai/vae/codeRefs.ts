import type { CodeRef } from "@/components/code/types";
import vaeMainPy from "./codebase/pytorch-examples/vae/main.py?raw";

export const codeRefs: Record<string, CodeRef> = {
  "reparam-and-loss": {
    path: "pytorch-examples/vae/main.py",
    code: vaeMainPy,
    lang: "python",
    highlight: [6, 49],
    desc: "문제: reparameterization trick과 두 loss 항(reconstruction, KL)이 실제로 어떻게 구현되는지 확인해야 합니다.\n\n해결: 공식 PyTorch VAE 예제의 forward가 encode→reparameterize→decode 순서를, loss_function이 BCE+KLD를 정확히 article과 같은 식으로 계산합니다.",
    annotations: [
      { lines: [20, 25], color: "sky", note: "article의 z=μ+σ⊙ε — reparameterize()가 그대로 이 식" },
      { lines: [39, 40], color: "emerald", note: "article의 L_recon — 이진 x라 BCE(Bernoulli likelihood)" },
      { lines: [42, 47], color: "amber", note: "article의 L_KL=-½Σ(1+logσ²-μ²-σ²) — 부호까지 완전히 동일, 같은 논문 부록을 인용" },
    ],
  },
};
