/**
 * EditPopover — <Editable> 클릭 시 뜨는 편집 제안 입력 UI.
 *
 * 원본 텍스트를 상단에 보여주고 instruction textarea (최대 300자) + 제출 버튼.
 * 제출은 submitEdit API 로. 성공/에러에 따라 피드백 한 줄.
 *
 * 프롬프트 인젝션 방어는 backend 쪽에서 (sanitize + risk score + 2단계 승인) 수행.
 * 프론트에서는 UX 만 — 투명 글씨 같은 invisible 문자는 backend 가 처리 후 태깅.
 */

import { useEffect, useRef, useState } from "react";
import { submitEdit, getSession, type SessionInfo } from "@/lib/editable-api";

type EditKind = "text" | "visual" | "text_to_viz";

// 단일 블록용 props. 기존 호출부와 호환.
interface SingleProps {
  blockId: string;
  articleSlug: string;
  originalText: string;
  originalHash: string;
  anchorEl: Element | null;
  onClose: () => void;
  kind?: EditKind;
  blocks?: undefined;
}

// multi-block용 props. blocks 배열을 넘기면 popover 는 각 블록을 축약해 나열.
// text_to_viz 도 본문 블록 여럿을 spec 으로 쓰므로 multi 경로를 공유.
interface MultiProps {
  articleSlug: string;
  blocks: Array<{ blockId: string; text: string; hash: string }>;
  anchorEl: Element | null;
  onClose: () => void;
  kind?: "text" | "text_to_viz";
  blockId?: undefined;
  originalText?: undefined;
  originalHash?: undefined;
}

type Props = SingleProps | MultiProps;

const INSTRUCTION_MAX = 300;
const PREVIEW_LEN = 70;   // multi-block 리스트에서 원본 미리보기 글자 수

export function EditPopover(props: Props) {
  const anchorEl = props.anchorEl;
  const onClose = props.onClose;
  const isMulti = Array.isArray(props.blocks);
  // mode: "text" (LLM 텍스트 변환) / "text_to_viz" (coder agent 가 새 Viz 생성) — text 블록 대상일 때 사용자가 선택.
  // 시작 값은 prop 의 kind (single="text" 기본, multi="text" 기본). visual 은 단일 경로, 토글 없음.
  const initialKind: EditKind = props.kind ?? "text";
  const [mode, setMode] = useState<EditKind>(initialKind);
  const kind: EditKind = mode;
  const articleSlug = props.articleSlug;
  const blockId = !isMulti ? props.blockId : null;
  const originalText = !isMulti ? props.originalText : null;
  const originalHash = !isMulti ? props.originalHash : null;
  const blocks = isMulti ? props.blocks : null;
  // visual 은 토글 UI 숨김 — 단일 경로 고정.
  const canPickMode = initialKind !== "visual";
  const [instruction, setInstruction] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ kind: "ok" | "err"; msg: string } | null>(null);
  const [session, setSession] = useState<SessionInfo | null>(null);
  const boxRef = useRef<HTMLDivElement | null>(null);

  // 마운트 즉시 세션 체크 — 로그인 안되어 있으면 폼 대신 로그인 프롬프트 노출.
  useEffect(() => {
    getSession().then(setSession);
  }, []);

  // 팝오버 위치 — anchor 아래 정렬 + 화면 경계 넘지 않게 clamp
  const [pos, setPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  useEffect(() => {
    if (!anchorEl) return;
    const rect = anchorEl.getBoundingClientRect();
    const top = rect.bottom + window.scrollY + 8;
    const width = Math.min(480, window.innerWidth - 24);
    let left = rect.left + window.scrollX;
    if (left + width > window.innerWidth - 12) left = window.innerWidth - width - 12;
    if (left < 12) left = 12;
    setPos({ top, left });
  }, [anchorEl]);

  // 외부 클릭·Esc 로 닫기
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    const onClick = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("keydown", onKey);
    // 마운트 직후 클릭 이벤트 버블링으로 즉시 닫히지 않게 한 프레임 지연
    const t = setTimeout(() => document.addEventListener("click", onClick), 0);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
      clearTimeout(t);
    };
  }, [onClose]);

  const handleSubmit = async () => {
    const text = instruction.trim();
    if (text.length < 3) { setResult({ kind: "err", msg: "더 구체적으로 작성해주세요 (3자 이상)" }); return; }
    setSubmitting(true);
    setResult(null);
    const r = await submitEdit(isMulti && blocks
      ? {
          articleSlug,
          blocks: blocks.map(b => ({ blockId: b.blockId, renderedText: b.text, renderedHash: b.hash })),
          instruction: text,
          kind,
        }
      : {
          blockId: blockId!,
          articleSlug,
          renderedText: originalText!,
          renderedHash: originalHash!,
          instruction: text,
          kind,
        });
    setSubmitting(false);
    if (r.ok) {
      setResult({ kind: "ok", msg: r.role === "admin" ? "제출됨 (내 요청) — 인박스에서 바로 승인 가능" : "제출됨 — 관리자 검토 대기" });
      setInstruction("");
      // 2초 후 자동 닫기
      setTimeout(onClose, 2000);
    } else {
      const msgMap: Record<string, string> = {
        rate_limited: "같은 블록에 너무 많이 제출했어요. 나중에 다시 시도해주세요.",
        stale_block: "페이지 내용이 갱신됐어요. 새로고침 후 다시 시도해주세요.",
        hash_mismatch: "브라우저·서버 텍스트가 불일치해요. 새로고침해주세요.",
        invalid_instruction: "지시문이 유효하지 않아요.",
        block_not_found: "이 블록은 편집 대상이 아닙니다.",
        network: "네트워크 오류.",
      };
      setResult({ kind: "err", msg: msgMap[r.reason] ?? `오류: ${r.reason}${r.detail ? ` (${r.detail})` : ""}` });
    }
  };

  return (
    <div
      ref={boxRef}
      role="dialog"
      aria-label="수정 제안"
      onClick={(e) => e.stopPropagation()}
      style={{ top: pos.top, left: pos.left, width: Math.min(480, window.innerWidth - 24) }}
      className="absolute z-50 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-xl p-3"
    >
      <div className="flex items-center justify-between mb-2 gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
            kind === "visual" ? "bg-purple-600 text-white" :
            kind === "text_to_viz" ? "bg-fuchsia-600 text-white" :
            "bg-blue-600 text-white"}`}>
            {kind === "visual" ? "Viz · 수동" :
             kind === "text_to_viz" ? "본문 → Viz" :
             "텍스트 · LLM"}
          </span>
          {isMulti && blocks ? (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-800 font-bold">🧩 {blocks.length} 블록</span>
          ) : (
            <div className="text-xs text-neutral-500 truncate" title={blockId ?? undefined}>{blockId}</div>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-xs text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 shrink-0"
          aria-label="닫기"
        >✕</button>
      </div>

      {/* 모드 선택 — text 블록만 "텍스트 수정" vs "Viz 로 변환" 선택 가능. visual 은 토글 없음. */}
      {canPickMode && (
        <div className="flex items-center gap-1 mb-2 p-1 bg-neutral-100 dark:bg-neutral-800 rounded">
          <button
            type="button"
            onClick={() => setMode("text")}
            className={`flex-1 text-[11px] px-2 py-1 rounded transition-colors ${
              mode === "text" ? "bg-white dark:bg-neutral-700 shadow text-blue-700 dark:text-blue-300 font-semibold" : "text-neutral-600 dark:text-neutral-300"
            }`}
          >텍스트 수정</button>
          <button
            type="button"
            onClick={() => setMode("text_to_viz")}
            className={`flex-1 text-[11px] px-2 py-1 rounded transition-colors ${
              mode === "text_to_viz" ? "bg-white dark:bg-neutral-700 shadow text-fuchsia-700 dark:text-fuchsia-300 font-semibold" : "text-neutral-600 dark:text-neutral-300"
            }`}
          >Viz 로 변환</button>
        </div>
      )}
      {mode === "text_to_viz" && (
        <div className="text-[11px] text-neutral-600 dark:text-neutral-400 mb-2 -mt-0.5 px-1">
          선택한 블록(들)을 spec 으로 coder agent 가 Viz 컴포넌트를 새로 만들고 섹션에 삽입합니다. 승인 후 자동 빌드·재시작.
        </div>
      )}

      <div className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
        {isMulti ? "선택된 블록" : kind === "visual" ? "대상 (Viz/이미지)" : "원본"}
      </div>
      {isMulti && blocks ? (
        <div className="text-xs bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 rounded p-2 max-h-36 overflow-y-auto mb-3">
          <ol className="space-y-1 list-decimal pl-4">
            {blocks.map(b => (
              <li key={b.blockId} className="text-neutral-700 dark:text-neutral-200">
                <span className="text-neutral-500 dark:text-neutral-400">
                  {b.text.length > PREVIEW_LEN ? b.text.slice(0, PREVIEW_LEN) + "…" : b.text}
                </span>
              </li>
            ))}
          </ol>
          <div className="text-[10px] text-neutral-400 mt-1.5">
            한 지시문이 모든 블록에 **함께** 적용됨. 예: "3문단 합쳐서 한 문단으로", "용어 X 전부 Y 로".
          </div>
        </div>
      ) : (
        <div className="text-sm bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 rounded p-2 max-h-28 overflow-y-auto whitespace-pre-wrap mb-3">
          {originalText}
        </div>
      )}
      {kind === "visual" && (
        <div className="text-[11px] text-neutral-500 mb-2 -mt-1">
          Viz/이미지는 LLM 자동 수정이 불가능해요. 관리자가 승인하면 수동 반영 큐에 들어갑니다.
        </div>
      )}

      {/* 세션 기반 분기 */}
      {session === null ? (
        <div className="text-xs text-neutral-500 py-3 text-center">세션 확인 중…</div>
      ) : session.role === "none" ? (
        <LoginRequired status={session.status} />
      ) : (
        <>
          {session.role === "user" && (
            <div className="text-[11px] text-neutral-500 mb-2">
              {session.email && <span className="font-medium">{session.email}</span>} 로 제안 — 관리자 검토 대기
            </div>
          )}
          <label className="block text-xs text-neutral-600 dark:text-neutral-400 mb-1">
            어떻게 고쳐야 하는지 (예: "더 구체적으로", "~~ 라는 오해 소지 있음, 용어 X 로 교체")
          </label>
          <textarea
            value={instruction}
            onChange={(e) => setInstruction(e.target.value.slice(0, INSTRUCTION_MAX))}
            rows={3}
            autoFocus
            placeholder="수정 지시문…"
            className="w-full text-sm bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded p-2 font-sans focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
          />
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-neutral-400">{instruction.length}/{INSTRUCTION_MAX}</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="text-xs px-3 py-1.5 rounded border border-neutral-300 dark:border-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                disabled={submitting}
              >취소</button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting || instruction.trim().length < 3}
                className="text-xs px-3 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:bg-neutral-300 dark:disabled:bg-neutral-700 disabled:text-neutral-500"
              >{submitting ? "제출 중…" : "제출"}</button>
            </div>
          </div>

          {result && (
            <div className={`mt-2 text-xs ${result.kind === "ok" ? "text-green-600" : "text-red-600"}`}>
              {result.msg}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function LoginRequired({ status }: { status?: string }) {
  const returnUrl = typeof window !== "undefined" ? window.location.href : "/";
  const signinUrl = `/auth/signin?callbackUrl=${encodeURIComponent(returnUrl)}`;
  return (
    <div className="py-3 text-sm text-neutral-700 dark:text-neutral-200">
      <p className="mb-2 font-medium">로그인 후 수정 제안 가능</p>
      <p className="text-xs text-neutral-500 mb-3">
        {status === "pending" ? "가입 신청됨 — 관리자 승인 대기 중입니다." :
         status === "rejected" ? "계정 승인이 거절되었습니다." :
         "Google 계정으로 로그인하면 수정 제안을 남길 수 있어요. 악의적 사용은 계정 단위로 차단됩니다."}
      </p>
      <a
        href={signinUrl}
        className="inline-block text-xs px-3 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-700"
      >Google 로그인</a>
    </div>
  );
}
