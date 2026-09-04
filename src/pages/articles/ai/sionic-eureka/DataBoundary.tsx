import { EUREKA_SOURCE_LINKS } from "@/content/sionic-eureka";

const corpusAxes = [
  ["언어", "한국어·영어를 포함한 다국어"],
  ["도메인", "웹·법률·보건·의료·금융·과학·코드"],
  ["길이", "한 문장부터 장문 문서"],
  ["출처", "FineWeb 계열·Hugging Face 공개 데이터·AIHub·공개 도메인"],
] as const;

export default function DataBoundary() {
  return (
    <section id="data" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        코퍼스보다 먼저 고정할 것은 경계다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          합성 쿼리는 원문서가 표현할 수 있는 세계를 벗어나지 못한다. 그래서 EUREKA는 단일 데이터셋이 아니라 여러 공개 소스를 모아 문서 풀을 만들고 출처와 라이선스, 언어,
          도메인, 길이, 중복 계보를 문서 단위 metadata로 남긴다.
        </p>
        <div className="not-prose my-6 grid gap-3 sm:grid-cols-2">
          {corpusAxes.map(([axis, coverage]) => (
            <div key={axis} className="rounded-xl border bg-card p-4">
              <p className="text-xs font-semibold text-primary">{axis}</p>
              <p className="mt-1 text-sm text-muted-foreground">{coverage}</p>
            </div>
          ))}
        </div>

        <h3 className="mt-6 mb-3 text-xl font-semibold">
          누출 방지는 split 이후의 필터가 아니다
        </h3>
        <p className="leading-7">
          benchmark의 test 문서·쿼리만 문자열로 제거하면 paraphrase, 번역본, 동일 원문의 재배포본이 남을 수 있다. 수집 단계에서 benchmark 원천과 문서 계보를
          먼저 격리하고 exact hash와 near-duplicate 검사를 함께 적용해야 한다. 최종 평가는 학습 source와 분리된 공개 benchmark와 사내 OOD set으로
          나눈다.
        </p>
        <p className="leading-7">
          reasoning이 필요한 현실 검색의 별도 평가가 필요한 이유는 BRIGHT 같은
          연구가 보여주지만, 이 글의 프로젝트 결과와 외부 benchmark 결과를
          합산하지 않는다. E5·Gecko·Qwen3 Embedding의 합성 방식은 다음 절에서
          데이터 생성의 외부 기준점으로만 사용한다.
        </p>
        <div className="not-prose mt-5 flex flex-wrap gap-2 text-xs">
          {(["e5", "gecko", "qwen"] as const).map((key) => (
            <a
              key={key}
              href={EUREKA_SOURCE_LINKS[key].href}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border bg-card px-3 py-1.5 hover:border-primary/40"
            >
              {EUREKA_SOURCE_LINKS[key].label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
