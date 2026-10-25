import type { CodeRef } from "@/components/code/types";
import common from "./codebase/laya/laya/common.py?raw";
import agent from "./codebase/laya/laya/agent.py?raw";
import train from "./codebase/laya/laya/train.py?raw";
import calibrate from "./codebase/laya/laya/calibrate.py?raw";
import router from "./codebase/laya/laya/router.py?raw";
import card from "./codebase/laya-hf/README.md?raw";
import config from "./codebase/laya-hf/rl_agent_config.json?raw";

export const codeRefs: Record<string, CodeRef> = {
  "build-head": {
    path: "laya/laya/common.py",
    highlight: [225, 277],
    desc: "질문 하나를 [CLS] 질문 [SEP] [MASK] 선택지0 [MASK] 선택지1 … [SEP]로 펼칩니다.",
    annotations: [
      { lines: [240, 251], color: "sky", note: "선택지마다 [MASK] 하나를 앞에 붙이고 설명은 48 token에서 자릅니다. 이 [MASK] 위치가 그 선택지의 점수 자리입니다." },
      { lines: [252, 259], color: "sky", note: "선택지 합이 head_max_len을 넘으면 선택지 하나를 max(4, (head_max_len−16)//n) token으로 줄입니다. English 기본값 192에서 77개면 4 token, [MASK]를 빼면 이름에 3 token이 남습니다." },
    ],
    code: common,
    lang: "python",
  },
  "build-sequence": {
    path: "laya/laya/common.py",
    highlight: [156, 222],
    desc: "질문 부분 뒤에 남은 자리만큼 상태 글을 붙이고 나머지는 조용히 자릅니다.",
    annotations: [
      { lines: [199, 204], color: "sky", note: "room = max_len − 실제 질문 부분 길이 − 1입니다. English 기본 질문의 실제 head가 48이면 상태는 463 token, 77-option head가 319이면 192 token까지 들어갑니다." },
    ],
    code: common,
    lang: "python",
  },
  "decision-model": {
    path: "laya/laya/common.py",
    highlight: [574, 658],
    desc: "encoder 뒤에 transformer 2층 head를 얹고 [MASK] 위치마다 점수 하나를 냅니다.",
    annotations: [
      { lines: [590, 598], color: "sky", note: "d=1024이면 head 한 층은 약 12.6M, 두 층과 scorer를 합쳐 약 26M입니다. ModernBERT-large 395M과 더해 카드의 421M이 됩니다." },
      { lines: [630, 634], color: "sky", note: "marker 위치의 hidden을 모아 scorer로 점수 하나씩. 다른 질문의 자리는 −1e4로 막고 그 질문의 선택지끼리만 softmax합니다." },
      { lines: [650, 657], color: "sky", note: "act_head는 [CLS]와 top1·차이·entropy·선택지 수로 act/escalate를 냅니다. 카드는 이 값에 아직 쓸 신호가 없다고 적습니다(#185)." },
    ],
    code: common,
    lang: "python",
  },
  "decode-answers": {
    path: "laya/laya/agent.py",
    highlight: [1327, 1395],
    desc: "(유형, 선택지 수) 칸의 temperature로 나눈 뒤 softmax해 유형별 답을 만듭니다.",
    annotations: [
      { lines: [1337, 1343], color: "sky", note: "noul은 noul:2 칸의 T=1.983으로 logit을 나눕니다. 차이 2.0이 1.008로 줄어 0.881이 0.733이 됩니다." },
      { lines: [1373, 1377], color: "sky", note: "score 답은 Σ i·p_i 기대값입니다. p=(0.04, 0.08, 0.88)이면 1.84입니다." },
    ],
    code: agent,
    lang: "python",
  },
  "proper-reward": {
    path: "laya/laya/common.py",
    highlight: [719, 745],
    desc: "보상은 log score + 구면 score이고 순서형 질문에는 RPS를 뺍니다.",
    annotations: [
      { lines: [735, 737], color: "sky", note: "참 확률 0.7인 질문에 0.7을 보고하면 log −0.611, 구면 0.762. 0.9를 보고하면 −0.765, 0.729로 둘 다 낮아집니다." },
      { lines: [738, 744], color: "sky", note: "score 유형은 누적분포 차이의 제곱합(RPS)을 빼 순서를 반영합니다." },
    ],
    code: common,
    lang: "python",
  },
  "rlcd-loss": {
    path: "laya/laya/train.py",
    highlight: [499, 518],
    desc: "logit에 평균 0 noise를 더한 표본마다 보상을 매기고, 평균보다 나은 표본 쪽으로 logit을 옮깁니다.",
    annotations: [
      { lines: [509, 512], color: "sky", note: "noise는 선택지 위에서 평균 0으로 맞춥니다. 두 선택지면 (−a, +a) 꼴입니다." },
      { lines: [513, 516], color: "sky", note: "표본 보상에서 표본 평균을 빼고 표준편차로 나눈 advantage. 두 표본이면 ±0.707입니다." },
      { lines: [517, 518], color: "sky", note: "Gaussian log-density에 advantage를 곱한 항에 soft cross-entropy를 더합니다. 파일 머리말은 typed-decisions에서 추가 항의 이득이 없었다고 적습니다(#741)." },
    ],
    code: train,
    lang: "python",
  },
  "sigma-schedule": {
    path: "laya/laya/train.py",
    highlight: [91, 104],
    desc: "기본 학습 설정: 표본 4개, noise σ 0.4에서 0.1로, 구면 가중치 0.75.",
    annotations: [{ lines: [100, 104], color: "sky", note: "sigma_at이 epoch마다 0.4→0.1로 선형으로 줄입니다(521–523행)." }],
    code: train,
    lang: "python",
  },
  "fit-temperature": {
    path: "laya/laya/calibrate.py",
    highlight: [112, 159],
    desc: "보정 표본의 NLL을 최소화하는 T 하나를 LBFGS로 찾고 [0.5, 5]로 자릅니다.",
    annotations: [{ lines: [143, 159], color: "sky", note: "log T를 최적화해 양수를 유지합니다. 결과는 clamp_temperature로 0.5~5 범위에 넣습니다." }],
    code: calibrate,
    lang: "python",
  },
  "temp-clamp": {
    path: "laya/laya/common.py",
    highlight: [779, 840],
    desc: "temperature 칸 이름과 0.5 미만을 거부하는 이유를 적습니다.",
    annotations: [
      { lines: [826, 827], color: "sky", note: "선택지 수를 2, 3–5, 6–10, 11+로 묶어 (유형, 칸)마다 T를 따로 둡니다." },
      { lines: [788, 792], color: "sky", note: "출시된 choice:11+는 0.1006으로 맞춰져 0.24를 0.9999로 부풀립니다. 0.5로 묶어도 0.4993이라 문턱 비교가 여전히 위험하다고 적습니다(#394)." },
    ],
    code: common,
    lang: "python",
  },
  "ece-score": {
    path: "laya/laya/common.py",
    highlight: [766, 776],
    desc: "확신도를 15칸으로 나눠 칸마다 |평균 확신도 − 정답률|에 비중을 곱해 더합니다.",
    annotations: [{ lines: [770, 775], color: "sky", note: "10개 답을 0.95 칸 5개(정답 3)와 0.65 칸 5개(정답 3)로 나누면 0.5×0.35 + 0.5×0.05 = 0.2입니다." }],
    code: common,
    lang: "python",
  },
  "route": {
    path: "laya/laya/router.py",
    highlight: [1203, 1299],
    desc: "명시한 모델 → 과제 → 언어 힌트 → 문자 검출 순으로 checkpoint를 고릅니다.",
    annotations: [{ lines: [1265, 1299], color: "sky", note: "라틴 문자가 아니면 multilingual, 라틴인데 영어가 아니면 multilingual, 판단이 안 서면 기본값(0.4.0부터 multilingual)으로 보냅니다." }],
    code: router,
    lang: "python",
  },
  "card-limits": {
    path: "laya-hf/README.md",
    highlight: [355, 373],
    desc: "모델 카드의 Honest Limits 절입니다.",
    annotations: [
      { lines: [357, 357], color: "sky", note: "기본 checkpoint는 typed-decisions에서 0.362로 다수 class 0.461보다 낮습니다. 0.766은 그 과제로 미세조정한 checkpoint의 값입니다." },
      { lines: [371, 372], color: "sky", note: "act_probability는 AUROC 0.30이라 쓰지 말고, 출시 상태는 과신이라 temperature를 다시 맞추라고 적습니다." },
    ],
    code: card,
    lang: "python",
  },
  "shipped-temps": {
    path: "laya-hf/rl_agent_config.json",
    highlight: [18, 25],
    desc: "출시 checkpoint에 들어 있는 (유형, 선택지 수)별 temperature입니다.",
    annotations: [{ lines: [22, 23], color: "sky", note: "noul:2는 1.983으로 logit을 절반 가까이 줄이고, choice:11+는 0.1006으로 오히려 10배 키웁니다." }],
    code: config,
    lang: "typescript",
  },
};
