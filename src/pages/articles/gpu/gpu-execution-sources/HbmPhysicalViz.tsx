export default function HbmPhysicalViz() {
  return (
    <figure data-viz="hbm-physical-path" className="my-8 border-y border-neutral-200 py-6 dark:border-neutral-700">
      <figcaption className="mb-6 text-base font-semibold">계산 칩과 적층 메모리 사이의 연결 원리</figcaption>
      <div className="flex flex-col items-center gap-4 md:flex-row md:items-end">
        <div className="flex w-full flex-1 flex-col gap-3 rounded-xl border border-sky-300 bg-sky-50 p-5 dark:border-sky-800 dark:bg-sky-950/30">
          <strong>계산 칩</strong>
          <div className="rounded-lg border border-sky-300 p-3 text-center dark:border-sky-800">요청을 만드는 계산부</div>
          <svg aria-hidden="true" viewBox="0 0 24 24" className="mx-auto h-6 w-6 text-sky-700 dark:text-sky-400" fill="none" stroke="currentColor" strokeWidth="1.25"><path d="M12 2v19m-6-6 6 6 6-6" /></svg>
          <div className="rounded-lg border border-sky-300 p-3 text-center dark:border-sky-800">메모리 제어기</div>
        </div>
        <svg aria-hidden="true" viewBox="0 0 64 24" className="h-8 w-16 shrink-0 rotate-90 text-sky-700 md:mb-8 md:rotate-0 dark:text-sky-400" fill="none" stroke="currentColor" strokeWidth="1.25"><path d="M2 8h58m-6-5 6 5-6 5M62 18H4m6-5-6 5 6 5" /></svg>
        <div className="w-full flex-1">
          <div className="relative space-y-2 rounded-xl border border-amber-300 p-5 dark:border-amber-800">
            <strong className="block pb-2">쌓인 저장 칩</strong>
            {[4, 3, 2, 1].map((layer) => <div key={layer} className="rounded border border-amber-300 bg-amber-50 px-3 py-2 text-center dark:border-amber-800 dark:bg-amber-950/30">저장 층 {layer}</div>)}
            <div className="absolute bottom-7 right-7 top-16 border-r-4 border-dashed border-sky-600" aria-hidden="true" />
            <p className="text-sm leading-6">점선: 층을 관통하는 전기 연결</p>
          </div>
          <div className="mt-3 rounded-lg border border-neutral-400 px-4 py-3 text-center dark:border-neutral-500">아래쪽 인터페이스</div>
        </div>
      </div>
      <div className="mt-4 border-t-4 border-sky-600 pt-3 text-center text-sm leading-6">수평 연결판이 두 칩의 넓은 통로를 잇습니다.</div>
      <p className="mt-4 text-sm leading-7 text-neutral-600 dark:text-neutral-400">연결 원리를 그린 모형입니다. 네 층은 특정 제품의 실제 적층 수가 아닙니다. 수직 적층 높이와 외부 데이터 폭은 별도로 정합니다.</p>
    </figure>
  );
}
