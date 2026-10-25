import { EUREKA_SOURCE_LINKS } from "@/content/sionic-eureka";
import { CitationBlock } from "@/components/ui/citation";

const mappingRows = [
  [
    "1:1",
    "하나의 질의 ↔ 하나의 문서",
    "기본 단위지만 이것만 학습하면 라벨 누락을 negative로 오인하기 쉽다",
  ],
  [
    "1:N",
    "하나의 질의 ↔ 여러 relevant 문서",
    "한 문서만 positive로 남기지 않고 positive set을 보존한다",
  ],
  [
    "N:1",
    "서로 다른 질의 ↔ 하나의 문서",
    "문서가 답할 수 있는 intent와 query style을 여러 개 생성한다",
  ],
] as const;

export default function QueryGeneration() {
  return (
    <section id="query-generation" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        쿼리 다양성
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p id="paper-synthetic-query-recipes" className="scroll-mt-24 leading-7">
          E5-Mistral은 task taxonomy를 먼저 만든 뒤 query-document 예시를 합성합니다. Gecko는 LLM이 만든 query로 candidate passage를
          검색한 뒤 같은 LLM으로 positive와 hard negative를 다시 표시합니다. Qwen3 Embedding도 다국어·다도메인 합성 데이터를 multi-stage
          training에 사용합니다 <strong>[O]</strong>. EUREKA 설계는 이 세 방식을 참고하되 subset마다 단일 prompt를 고정하지 않습니다 <strong>[A]</strong>.
        </p>

        <div className="not-prose my-6 grid gap-3">
          {(["e5", "gecko", "qwen"] as const).map((key, index) => (
            <CitationBlock
              key={key}
              source={EUREKA_SOURCE_LINKS[key].label}
              citeKey={index + 1}
              type="paper"
              href={EUREKA_SOURCE_LINKS[key].href}
            >
              합성 query와 retrieval embedding 학습의 공개 근거입니다. 각 논문이 보고한 점수를 EUREKA 내부 결과로 옮겨 쓰지 않습니다.
            </CitationBlock>
          ))}
        </div>

        <div className="not-prose my-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 text-sm">
          {[
            "짧은 사실형",
            "여러 문단 종합형",
            "논평·리뷰형",
            "자연어 코드 검색",
          ].map((item) => (
            <div
              key={item}
              className="rounded-xl border bg-card p-4 font-medium"
            >
              {item}
            </div>
          ))}
        </div>

        <h3 id="paper-position-bias" className="mt-6 mb-3 scroll-mt-24 text-xl font-semibold">
          Answer position을 sampling 변수로
        </h3>
        <p className="leading-7">
          장문 document에서 근거가 앞·중간·뒤 어디에 있는지 기록하고, 합성·선별
          시 분포를 제어합니다. 최근 통제 연구는 balanced position으로 학습하면
          dense retriever의 positional sensitivity가 크게 줄 수 있음을 보였지만,
          architecture와 pretraining에서 생긴 경향까지 사라진다고 말하지는
          않습니다. 따라서 EUREKA는 위치 분포를{" "}
          <strong>주요하고 조절 가능한 데이터 변수</strong>로 다룹니다 <strong>[A]</strong>.
        </p>
        <CitationBlock source={EUREKA_SOURCE_LINKS.positionBias.label} citeKey={4} type="paper" href={EUREKA_SOURCE_LINKS.positionBias.href}>
          근거 위치를 앞·중간·뒤로 통제한 2026년 실험입니다. 균형 학습의 감소율은 논문의 여덟 모델과 position-aware benchmark 범위에 한정합니다.
        </CitationBlock>

        <h3 id="paper-multi-positive" className="mt-6 mb-3 scroll-mt-24 text-xl font-semibold">
          1:N·N:1을 라벨 그래프로 보존
        </h3>
        <div
          data-viz="eureka-relevance-mapping-ledger"
          className="not-prose my-6 overflow-hidden rounded-lg border border-border/70"
        >
          <div className="hidden grid-cols-[5rem_1fr_1.6fr] gap-4 border-b bg-muted/25 px-4 py-3 text-xs font-semibold text-muted-foreground md:grid">
            <span>관계</span>
            <span>의미</span>
            <span>데이터 계약</span>
          </div>
          <div className="divide-y divide-border/70">
            {mappingRows.map(([kind, meaning, contract]) => (
              <article
                key={kind}
                className="grid min-w-0 gap-3 px-4 py-4 md:grid-cols-[5rem_1fr_1.6fr] md:gap-4"
              >
                <div>
                  <span className="text-[11px] font-semibold text-muted-foreground md:hidden">관계</span>
                  <p className="text-sm font-semibold">{kind}</p>
                </div>
                <div className="min-w-0">
                  <span className="text-[11px] font-semibold text-muted-foreground md:hidden">의미</span>
                  <p className="break-words text-sm">{meaning}</p>
                </div>
                <div className="min-w-0">
                  <span className="text-[11px] font-semibold text-muted-foreground md:hidden">데이터 계약</span>
                  <p className="break-words text-sm text-muted-foreground">{contract}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
        <p className="leading-7">
          Multi-positive 라벨은 관련 문서를 negative로 잘못 쓰는 문제를
          줄이지만, positive를 loss에서 어떻게 합칠지는 별도 선택입니다. 최신 비교
          연구도 objective에 따라 민감도가 다름을 보고하므로 “positive가
          많을수록 항상 좋다”로 일반화하지 않습니다 <strong>[O]</strong>.{" "}
          <a
            href={EUREKA_SOURCE_LINKS.multiPositive.href}
            target="_blank"
            rel="noreferrer"
          >
            multi-positive objective 연구 원문
          </a>
        </p>
      </div>
    </section>
  );
}
