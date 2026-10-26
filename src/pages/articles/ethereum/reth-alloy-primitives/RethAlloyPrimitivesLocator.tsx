import { Link } from "react-router-dom";
import { SERIES_READING_PATHS } from "@/content/series-reading-paths";

const GROUP = SERIES_READING_PATHS.reth.groups.find((group) =>
  (group.slugs as readonly string[]).includes("reth-alloy-primitives"),
);

const NEIGHBORS = [
  { slug: "reth-cli", label: "CLI와 노드 빌더" },
  { slug: "reth-chainspec", label: "체인 규칙" },
  { slug: "reth-alloy-primitives", label: "값과 직렬화" },
] as const;

const CURRENT_INDEX = NEIGHBORS.findIndex(
  (item) => item.slug === "reth-alloy-primitives",
);

export default function RethAlloyPrimitivesLocator() {
  return (
    <aside
      className="not-prose mb-8 border-y border-border py-4 sm:py-5"
      aria-label="Reth 학습 지도에서 현재 글의 위치"
      data-reth-track="concept"
      data-reth-parent={GROUP?.label ?? "노드 조립과 규칙"}
    >
      <nav
        className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] leading-5 text-muted-foreground"
        aria-label="Reth 글 위치"
      >
        <Link to="/cs/blockchain" className="hover:text-primary">블록체인</Link>
        <span aria-hidden>›</span>
        <Link to="/cs/blockchain/reth#overview" className="hover:text-primary">Reth 전체 구조</Link>
        <span aria-hidden>›</span>
        <span>개념 트랙</span>
        <span aria-hidden>›</span>
        <strong className="text-foreground" aria-current="page">값과 직렬화</strong>
      </nav>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_17rem] lg:items-start">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="border border-primary/40 px-2 py-1 text-[10px] font-bold text-primary">개념</span>
            <span className="text-[11px] text-muted-foreground">현재 영역 · {GROUP?.label ?? "노드 조립과 규칙"}</span>
          </div>
          <p className="mt-3 max-w-3xl break-keep text-base font-bold leading-7">
            주소와 숫자가 어떻게 한 바이트열이 되고, 다시 같은 값으로 돌아올까요?
          </p>
          <p className="mt-1 max-w-3xl text-xs leading-6 text-muted-foreground">
            한 계약 주소를 만드는 실제 입력을 따라가며 타입, RLP, 정확한 복원, Keccak-256의 책임을 나눕니다.
          </p>
        </div>

        <div className="border-l-2 border-primary/45 pl-3">
          <p className="text-[10px] font-bold text-muted-foreground">직속 부모 지도</p>
          <Link
            to="/cs/blockchain/reth#overview"
            className="mt-1 block break-keep text-sm font-bold leading-6 hover:text-primary"
          >
            한 블록의 검증·실행·저장 흐름 ↗
          </Link>
        </div>
      </div>

      <div
        className="mt-4 grid gap-px bg-border p-px sm:grid-cols-3"
        aria-label="같은 영역의 글 순서"
      >
        {NEIGHBORS.map((item, index) => {
          const current = index === CURRENT_INDEX;
          const direction = index < CURRENT_INDEX ? "이전" : index > CURRENT_INDEX ? "다음" : "현재";
          return current ? (
            <span
              key={item.slug}
              className="min-w-0 bg-primary px-3 py-3 text-primary-foreground"
              aria-current="page"
            >
              <small className="block text-[9px] font-bold opacity-75">
                {String(index + 1).padStart(2, "0")} · {direction}
              </small>
              <strong className="mt-1 block break-keep text-xs">{item.label}</strong>
            </span>
          ) : (
            <Link
              key={item.slug}
              to={`/cs/blockchain/${item.slug}`}
              className="min-w-0 bg-background px-3 py-3 hover:bg-muted/50"
            >
              <small className="block text-[9px] font-bold text-muted-foreground">
                {String(index + 1).padStart(2, "0")} · {direction}
              </small>
              <strong className="mt-1 block break-keep text-xs">{item.label}</strong>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}

export function RethAlloyPrimitivesMapReturn() {
  return (
    <aside className="not-prose my-8 space-y-8" aria-label="복습하고 Reth 전체 지도에 되돌려 놓기">
      <section className="border-y border-border py-5" aria-labelledby="reth-alloy-review-title">
        <p className="text-[10px] font-bold text-primary">그림 없이 다시 설명하기</p>
        <h2 id="reth-alloy-review-title" className="mt-2 text-xl font-bold">
          세 질문의 답을 바이트 단위로 말해 보세요
        </h2>
        <ol className="mt-4 grid gap-px bg-border p-px text-sm leading-6 md:grid-cols-3">
          <li className="min-w-0 bg-background p-4">
            <strong className="block text-xs text-primary">01 · 목록 만들기</strong>
            <span className="mt-2 block">nonce 1은 왜 <code>01</code>이고, 전체 목록은 왜 <code>d6</code>으로 시작할까요?</span>
            <a href="#rlp" className="mt-3 inline-block text-xs font-semibold hover:text-primary">RLP 절에서 확인 ↗</a>
          </li>
          <li className="min-w-0 bg-background p-4">
            <strong className="block text-xs text-primary">02 · 정확히 복원하기</strong>
            <span className="mt-2 block">올바른 객체 뒤에 <code>00</code>이 붙으면 왜 복원에 실패해야 할까요?</span>
            <a href="#rlp-decoding" className="mt-3 inline-block text-xs font-semibold hover:text-primary">정확한 복원 절에서 확인 ↗</a>
          </li>
          <li className="min-w-0 bg-background p-4">
            <strong className="block text-xs text-primary">03 · 결과 해석하기</strong>
            <span className="mt-2 block">CREATE 주소와 Bloom은 같은 Keccak-256 결과를 어떻게 다르게 사용할까요?</span>
            <a href="#bytes-bloom" className="mt-3 inline-block text-xs font-semibold hover:text-primary">주소·Bloom 절에서 확인 ↗</a>
          </li>
        </ol>
      </section>

      <section className="border-y border-border py-5" aria-label="확인한 사실을 Reth 전체 지도에 되돌려 놓기">
        <p className="text-[10px] font-bold text-primary">부모 지도에 되돌려 놓기</p>
        <p className="mt-2 max-w-3xl break-keep text-base font-bold leading-7">
          Reth의 실행·저장·네트워크 경로가 같은 값을 공유하려면 폭과 의미를 타입으로 고정하고, 문맥이 정한 한 가지 바이트 표현을 사용해야 합니다. 각 경계는 자기 책임만 확인하므로 타입 검사, RLP, 정확한 복원, 해시 입력을 차례로 통과해야 같은 주소와 상태를 계산할 수 있습니다.
        </p>
        <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
        <Link
          to="/cs/blockchain/reth#overview"
          className="inline-flex min-h-11 items-center border-b border-border text-xs font-semibold hover:border-primary hover:text-primary"
        >
          Reth 전체 구조로 돌아가기 ↗
        </Link>
        <Link
          to="/cs/blockchain/lsm-tree"
          className="inline-flex min-h-11 items-center border-b border-border text-xs font-semibold hover:border-primary hover:text-primary"
        >
          다음 글: LSM 저장 구조 ↗
        </Link>
        </div>
      </section>
    </aside>
  );
}
