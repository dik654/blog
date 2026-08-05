/**
 * 페이지 우측 상단에 붙는 edit 모드 토글 — 켜면 overlay 가 단락·Viz 에 click handler 부착.
 *
 * 토글 ON 시 고정 배너에 현재 로그인 상태(admin/user/로그인 필요) 를 명시해서
 * "누구로 제안하게 되는지" 바로 알 수 있게 한다.
 */

import { useEffect, useState } from "react";
import { Pencil } from "lucide-react";
import { useEditMode } from "@/lib/editable-context";
import { getSession, type SessionInfo } from "@/lib/editable-api";

export function EditModeToggle() {
  const { enabled, setEnabled } = useEditMode();
  const [session, setSession] = useState<SessionInfo | null>(null);

  // 편집 모드 켜질 때 세션 refresh — 로그아웃 후 다시 켜도 정확히 반영.
  useEffect(() => {
    if (!enabled) return;
    getSession(true).then(setSession);
  }, [enabled]);

  const signinUrl = typeof window !== "undefined"
    ? `/auth/signin?callbackUrl=${encodeURIComponent(window.location.href)}`
    : "/auth/signin";

  return (
    <>
      <button
        type="button"
        onClick={() => setEnabled(!enabled)}
        aria-pressed={enabled}
        title={enabled ? "편집 모드 끄기" : "편집 모드 켜기 — 단락을 클릭해 수정 제안"}
        className={[
          "fixed right-4 top-20 z-40 hidden min-h-11 items-center gap-2 rounded-full px-4 py-2 text-xs shadow-md transition-colors sm:flex",
          enabled
            ? "bg-blue-600 text-white hover:bg-blue-700"
            : "bg-white/95 dark:bg-neutral-800/95 text-neutral-600 dark:text-neutral-300 border border-neutral-300 dark:border-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-700",
        ].join(" ")}
      >
        <Pencil className="size-4" aria-hidden="true" />
        {enabled ? "편집 모드 • 끄기" : "편집 제안"}
      </button>

      {enabled && (
        <div
          role="status"
          className="fixed right-4 top-32 z-40 hidden max-w-sm rounded-lg shadow-xl text-xs sm:block"
          style={{
            background: session?.role === "none" ? "#fef3c7" : session?.role === "admin" ? "#dbeafe" : "#ecfdf5",
            border: `1px solid ${session?.role === "none" ? "#fbbf24" : session?.role === "admin" ? "#3b82f6" : "#10b981"}`,
            color: session?.role === "none" ? "#92400e" : session?.role === "admin" ? "#1e40af" : "#065f46",
          }}
        >
          <div className="px-3 py-2.5">
            <div className="font-semibold mb-1 flex items-center gap-1.5">
              편집 모드 ON
              {session && (
                <span className="ml-auto opacity-80">
                  {session.role === "admin" && "🛡 admin"}
                  {session.role === "user" && "👤 user"}
                  {session.role === "none" && "🔒 로그인 필요"}
                </span>
              )}
            </div>
            {session === null ? (
              <div className="opacity-80">세션 확인 중…</div>
            ) : session.role === "none" ? (
              <>
                <div className="opacity-90 leading-snug mb-2">
                  수정 제안은 Google 로그인 후 가능합니다.
                  {session.status === "pending" && <><br />가입 신청됨 — 관리자 승인 대기.</>}
                  {session.status === "rejected" && <><br />계정 승인 거절됨.</>}
                </div>
                <a
                  href={signinUrl}
                  className="inline-block text-xs px-3 py-1 rounded font-semibold"
                  style={{ background: "#92400e", color: "white" }}
                >Google 로그인 →</a>
              </>
            ) : (
              <div className="opacity-90 leading-snug">
                <b>{session.email ?? session.name ?? "로그인됨"}</b> 으로 제안.<br />
                단락·Viz 클릭 → 지시문 작성 → 제출.
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
