import { useState } from "react";
import ContextViz from "./viz/ContextViz";
import DBLayerViz from "./viz/DBLayerViz";
import {
  RETH_STORAGE_LAYOUTS,
  RETH_STORAGE_ROUTES,
  RETH_STORAGE_RULES,
} from "@/content/reth-storage";
import type { CodeRef } from "@/components/code/types";

export default function Overview({
  onCodeRef: _onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  const [layoutId, setLayoutId] = useState<"v1" | "v2">("v2");
  const layout = RETH_STORAGE_LAYOUTS.find((item) => item.id === layoutId)!;

  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        하나의 DB가 아니라 versioned storage layout
      </h2>
      <div className="not-prose mb-8">
        <ContextViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          Reth의 저장 계층을 “MDBX에 최신 데이터, static files에 오래된
          데이터”라는 한 줄로 고정하면 현재 구조를 설명할 수 없습니다. 새 data
          directory는 Storage V2를 기본으로 사용하고, history indices와
          transaction-hash lookup을 RocksDB로, account·storage changesets를
          static files로 routing하며 legacy plain-state tables를 피합니다.
        </p>
        <p className="leading-7">
          동시에 기존 node가 자동으로 V2가 되는 것도 아닙니다. 초기화 시 선택한
          mode가 metadata에 저장되며, V1 database는 migration·V2 snapshot·resync
          중 하나를 명시적으로 수행하기 전까지 MDBX-only layout을 유지합니다.
          그래서 코드와 글 모두 storage version을 조회 문맥의 일부로 다뤄야
          합니다.
        </p>
      </div>

      <div className="not-prose grid grid-cols-1 gap-3 sm:grid-cols-2 mb-4">
        {RETH_STORAGE_LAYOUTS.map((item) => (
          <button
            type="button"
            key={item.id}
            onClick={() => setLayoutId(item.id)}
            className={`cursor-pointer rounded-xl border p-4 text-left transition-colors ${layoutId === item.id ? "border-indigo-500/50 bg-indigo-500/5" : "border-border"}`}
          >
            <p className="text-sm font-bold">{item.title}</p>
            <p className="mt-1 text-xs text-foreground/55">{item.status}</p>
          </button>
        ))}
      </div>
      <div className="not-prose mb-8 rounded-xl border border-border/60 p-4">
        <p className="text-sm leading-6 text-foreground/80">{layout.summary}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {layout.routes.map((route) => (
            <span
              key={route}
              className="rounded-full bg-muted px-2.5 py-1 text-xs text-foreground/65"
            >
              {route}
            </span>
          ))}
        </div>
      </div>

      <h3 className="text-lg font-semibold mb-3">데이터 종류별 route</h3>
      <div className="overflow-x-auto mb-8">
        <table className="w-full min-w-[720px] text-sm border border-border">
          <thead>
            <tr className="bg-muted/50">
              <th className="p-3 text-left">데이터</th>
              <th className="p-3 text-left">V1</th>
              <th className="p-3 text-left">V2</th>
              <th className="p-3 text-left">문맥</th>
            </tr>
          </thead>
          <tbody>
            {RETH_STORAGE_ROUTES.map((route) => (
              <tr key={route.data} className="border-t border-border">
                <td className="p-3 font-semibold">{route.data}</td>
                <td className="p-3 text-foreground/60">{route.v1}</td>
                <td className="p-3 text-emerald-500">{route.v2}</td>
                <td className="p-3 text-foreground/60">{route.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 className="text-lg font-semibold mb-3">운영에서 지켜야 할 경계</h3>
      <ol className="not-prose mb-8 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {RETH_STORAGE_RULES.map((rule, index) => (
          <li
            key={rule}
            className="flex gap-3 rounded-xl border border-border/60 p-3 text-sm leading-6 text-foreground/75"
          >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-500/10 text-xs font-bold text-indigo-400">
              {index + 1}
            </span>
            {rule}
          </li>
        ))}
      </ol>

      <div className="not-prose">
        <DBLayerViz />
      </div>
    </section>
  );
}
