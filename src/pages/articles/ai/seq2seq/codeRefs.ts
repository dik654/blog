import type { CodeRef } from "@/components/code/types";
import seq2seqTutorialPy from "./codebase/pytorch-tutorials/intermediate_source/seq2seq_translation_tutorial.py?raw";

export const codeRefs: Record<string, CodeRef> = {
  "encoder-handoff": {
    path: "pytorch-tutorials/intermediate_source/seq2seq_translation_tutorial.py",
    code: seq2seqTutorialPy,
    lang: "python",
    highlight: [23, 52],
    desc: "문제: encoder의 마지막 state가 decoder의 초기 state로 실제로 어떻게 넘어가는지 확인해야 합니다.\n\n해결: PyTorch 공식 seq2seq 튜토리얼의 EncoderRNN.forward가 source를 순서대로 읽어 최종 hidden state를 만들고, DecoderRNN.forward가 그 state를 decoder_hidden으로 그대로 받습니다.",
    annotations: [
      { lines: [28, 30], color: "sky", note: "article의 e(x_j) 임베딩과 LSTM_E — 이 구현은 GRU를 쓰지만 '순서대로 읽으며 state 갱신'하는 recurrence 구조는 같음" },
      { lines: [32, 35], color: "emerald", note: "article의 (h_j^E,C_j^E) 갱신 — encoder가 매 position마다 state를 만드는 forward" },
      { lines: [46, 52], color: "amber", note: "article의 s_0^D=W_h h_S^E+b_h — encoder·decoder hidden size가 같아 이 구현엔 명시적 projection이 없고 encoder_hidden을 그대로 넘김" },
    ],
  },
  "decoder-step": {
    path: "pytorch-tutorials/intermediate_source/seq2seq_translation_tutorial.py",
    code: seq2seqTutorialPy,
    lang: "python",
    highlight: [39, 78],
    desc: "문제: decoder가 매 step마다 이전 token에서 다음 token 분포를 어떻게 계산하고, teacher forcing과 autoregressive decoding이 코드에서 어떻게 갈라지는지 확인해야 합니다.\n\n해결: DecoderRNN.forward의 loop가 target_tensor 유무로 teacher forcing 여부를 분기하고, forward_step이 embedding→recurrent transition→output projection 세 단계를 그대로 수행합니다.",
    annotations: [
      { lines: [59, 61], color: "sky", note: "article의 teacher forcing — 정답 prefix token을 다음 decoder input으로 사용" },
      { lines: [62, 65], color: "emerald", note: "article의 autoregressive decoding — model 자신의 top-1 예측을 다음 input으로 사용, detach로 그래프 분리" },
      { lines: [73, 78], color: "amber", note: "article의 u_t=e(y_{t-1}), s_t=LSTM_D(u_t,s_{t-1}), p_t=softmax(W_o s_t+b_o) — embedding→gru→out(linear) 세 단계와 정확히 대응" },
    ],
  },
  "training-loop": {
    path: "pytorch-tutorials/intermediate_source/seq2seq_translation_tutorial.py",
    code: seq2seqTutorialPy,
    lang: "python",
    highlight: [83, 115],
    desc: "문제: teacher forcing training loop가 실제로 어떻게 구성되고, padding·mask 처리가 article의 masked-average와 얼마나 일치하는지 확인해야 합니다.\n\n해결: train_epoch이 encoder→decoder(target_tensor 항상 전달)→NLLLoss 순서로 학습하지만, 실제 이 pinned 버전은 확률적 teacher_forcing_ratio 분기도, padding을 제외하는 mask도 없습니다 — article과의 차이를 annotation에 명시합니다.",
    annotations: [
      { lines: [92, 98], color: "sky", note: "article과 다른 점 — 문서 주석은 teacher_forcing_ratio로 확률적 on/off를 설명하지만 실제 코드는 target_tensor를 항상 넘겨 매 step 100% teacher forcing" },
      { lines: [100, 107], color: "rose", note: "article과 다른 점 — NLLLoss에 ignore_index가 없어 EOS 뒤 padding도 loss에 포함됨. article의 mask m_t 기반 평균은 이 튜토리얼에는 없는 더 신중한 production 관례" },
    ],
  },
};
