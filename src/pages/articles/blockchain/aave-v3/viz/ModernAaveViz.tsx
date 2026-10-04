import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
type Mode="pool"|"index"|"rate"|"liquidation"|"risk";
const flows:Record<Mode,{title:string;scenes:{label:string;input:string;calculation:string;result:string}[]}>= {
  "pool": {
    "title": "풀과 C의 담보를 따로 보기",
    "scenes": [
      {
        "label": "풀 전체",
        "input": "공급10000 / 총부채8000",
        "calculation": "남은 자금2000",
        "result": "총부채에는C의 7000과 다른 계정의 1000이 포함됩니다."
      },
      {
        "label": "C의 담보",
        "input": "100개 × 가격100달러",
        "calculation": "담보10000 / 부채7000",
        "result": "이 담보는 빌려주는 풀에 남은 현금2000과 다른 자산입니다."
      },
      {
        "label": "가격 하락",
        "input": "100개 × 가격80달러",
        "calculation": "담보8000 / 부채7000",
        "result": "이자가 붙지 않은 시점으로 고정하면 청산 기준 가치 6400이 부채보다 작습니다."
      }
    ]
  },
  "index": {
    "title": "저장 단위와 현재 잔액",
    "scenes": [
      {
        "label": "저장",
        "input": "공급 단위1000 / 부채 단위7000",
        "calculation": "각자 자신의 계수 사용",
        "result": "사용자별 저장단위에 reserve의 공통 계수를 적용합니다."
      },
      {
        "label": "공급 조회",
        "input": "공급 계수1.05",
        "calculation": "1000 × 1.05 = 1050",
        "result": "원문의 getATokenBalance는 최소 단위에서 내립니다."
      },
      {
        "label": "부채 조회",
        "input": "차입 계수1.08",
        "calculation": "7000 × 1.08 = 7560",
        "result": "부채 조회는 올립니다. 이 예에서는 두 곱이 모두 정확히 나누어떨어집니다."
      }
    ]
  },
  "rate": {
    "title": "사용률80%의 두 이율",
    "scenes": [
      {
        "label": "사용률",
        "input": "가용2000 / 부채8000",
        "calculation": "8000 / 10000 = 80%",
        "result": "설명용 같은 설정에서 부채가 늘수록 남은 자금이 줄어듭니다."
      },
      {
        "label": "차입 이율",
        "input": "기본2% + 첫 구간4%",
        "calculation": "6%",
        "result": "정확히 기준 80%에서는 else 분기를 씁니다."
      },
      {
        "label": "공급 이율",
        "input": "6% × 80% × 90%",
        "calculation": "4.32%",
        "result": "unbacked가 0이고 프로토콜 몫이 10%인 예입니다. 미래 수익 보장이 아닙니다."
      }
    ]
  },
  "liquidation": {
    "title": "C의 담보와 청산 가능 상태",
    "scenes": [
      {
        "label": "하락 전",
        "input": "담보10000 × 80%",
        "calculation": "8000 / 7000 ≈ 1.143",
        "result": "새 차입 한도 75%와 청산 판단 80%를 구분합니다."
      },
      {
        "label": "하락 후",
        "input": "담보8000 × 80%",
        "calculation": "6400 / 7000 ≈ 0.914",
        "result": "HF가 1 미만이지만 실제 청산 호출의 나머지 조건도 확인합니다."
      },
      {
        "label": "1000 상환",
        "input": "담보차감1050 / 부채감소1000",
        "calculation": "6950 × 80% / 6000 ≈ 0.927",
        "result": "보상 5%의 예입니다. 일부 청산이 끝나도 HF가 1보다 작을 수 있습니다."
      }
    ]
  },
  "risk": {
    "title": "같은 C 계정에도 설정 검사가 추가됩니다",
    "scenes": [
      {
        "label": "일반 설정",
        "input": "담보10000 / LTV75%",
        "calculation": "차입 후보7000 ≤ 7500",
        "result": "현재 자산과 계정에 이 기본 설정이 적용된다고 가정했습니다."
      },
      {
        "label": "E-Mode",
        "input": "선택한 범주와 허용 자산",
        "calculation": "별도 비율 적용 가능",
        "result": "가격 상관관계가 기대와 달라지는 상황도 검사합니다."
      },
      {
        "label": "Isolation",
        "input": "허용 차입 자산과 총부채 상한",
        "calculation": "LTV 통과만으로 승인하지 않음",
        "result": "7000 차입이 담보의 격리 설정과 한도도 통과해야 합니다."
      }
    ]
  }
};
export default function ModernAaveViz({mode}:{mode:Mode}){const f=flows[mode],state=useAnimatedScenes(f.scenes.length),s=f.scenes[state.active];return <div data-viz={"aave-"+mode} data-viz-keyboard tabIndex={0} onKeyDown={state.onKeyDown} className="not-prose min-w-0 rounded-lg border border-border p-4 sm:p-6"><p className="mb-5 font-semibold">{f.title}</p><div data-viz-canvas className="h-[29rem] min-w-0 overflow-auto sm:h-[25rem]"><div className="border border-border p-4"><p className="text-xs text-muted-foreground">입력과 현재 상태</p><p className="mt-3 break-words font-semibold">{s.input}</p></div><svg aria-hidden="true" className="mx-auto my-4 h-6 w-8" viewBox="0 0 32 24"><path d="M16 1V22M10 16L16 22L22 16" fill="none" stroke="currentColor" strokeWidth="1"/></svg><div className="border border-primary/40 p-4"><p className="break-words font-semibold">{s.calculation}</p><p className="mt-4 text-sm leading-7" aria-live="polite">{s.result}</p></div></div><AnimatedSceneControls labels={f.scenes.map(x=>x.label)} {...state}/></div>}
