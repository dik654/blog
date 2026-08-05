/**
 * <Editable> — 편집 가능한 블록 래퍼.
 *
 * 사용법:
 *   <Editable>이 문단 텍스트는 편집 요청의 대상이 됩니다.</Editable>
 *
 * - children 은 문자열만 (기본 케이스). ReactNode 가 섞이면 원본 텍스트 추출이 불가능하므로
 *   이 컴포넌트는 문자열 자식만 지원한다 (멀티 라인은 `\n` 포함된 단일 string).
 * - 상위에 <ArticleEditableProvider slug="..."> + <SectionEditableProvider id="..."> 필수.
 * - 자동 nth 번호 부여 → id = `${slug}:${sectionId}:${nth}`.
 * - 원본 텍스트의 sha256 앞 16자를 계산해 blog_blocks 에 register.
 * - 서버에 해당 id 의 override 가 있고 base_text_hash 가 일치하면 override body 로 치환.
 * - edit 모드일 땐 테두리 + 클릭 핸들러 — 클릭 시 팝오버(EditPopover) 열림.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import {
  composeBlockId,
  queueBlockRegister,
  useArticleEditable,
  useSectionEditable,
  useEditMode,
} from "@/lib/editable-context";
import { sha256Hex16 } from "@/lib/editable-api";
import { EditPopover } from "./EditPopover";

// 간단 props: children 은 string (또는 string 배열). HTML/ReactNode 는 지원 안 함.
interface Props {
  children: string | string[];
  /** 기본은 <p> 로 래핑. inline (<span>) 이 필요하면 "span" */
  as?: "p" | "span" | "div";
  /** tailwind 클래스 추가 */
  className?: string;
}

export function Editable({ children, as = "p", className }: Props) {
  const article = useArticleEditable();
  const section = useSectionEditable();
  const { enabled: editMode } = useEditMode();

  // nth 는 렌더 중 nextNth() 를 딱 한 번 호출해 확정. 이후 렌더에서 같은 위치라면 같은 nth.
  // useMemo 의 dep 는 article.slug + section?.sectionId — 이 두 개가 바뀌면 새 id 로 다시 할당.
  // (주의: section 의 nextNth 는 섹션 provider 렌더마다 카운터 리셋되므로, 이 memo 가 다시 실행될
  //  필요 없이 자연스러운 순서로 번호가 매겨진다.)
  const nth = useMemo(() => {
    if (!section) return -1;
    return section.nextNth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [article?.slug, section?.sectionId]);

  const originalText = useMemo(() => Array.isArray(children) ? children.join("") : children, [children]);

  const blockId = useMemo(() => {
    if (!article || !section || nth < 0) return null;
    return composeBlockId(article.slug, section.sectionId, nth);
  }, [article, section, nth]);

  const [textHash, setTextHash] = useState<string | null>(null);
  useEffect(() => {
    let cancelled = false;
    sha256Hex16(originalText).then(h => { if (!cancelled) setTextHash(h); });
    return () => { cancelled = true; };
  }, [originalText]);

  // 블록 등록 (register + override fetch queue).
  useEffect(() => {
    if (!article || !section || !blockId || !textHash) return;
    queueBlockRegister({
      id: blockId,
      articleSlug: article.slug,
      sectionId: section.sectionId,
      nth,
      textHash,
    });
    article.registerBlockForOverrideFetch(blockId);
  }, [article, section, blockId, nth, textHash]);

  // override 치환 — id 일치 + base_text_hash 가 현재 원본 hash 와 동일해야 사용 (stale 방어).
  const override = blockId ? article?.overrides.get(blockId) : undefined;
  const effectiveText = override && textHash && override.baseTextHash === textHash
    ? override.body
    : originalText;

  // ── Edit 모드 UI ───
  const [popoverOpen, setPopoverOpen] = useState(false);
  const anchorRef = useRef<HTMLElement | null>(null);

  const Tag = (as ?? "p") as any;
  const baseClass = ["whitespace-pre-line", className ?? ""].join(" ").trim();
  const hooked = Boolean(blockId && textHash);

  // edit 모드 OFF 또는 아직 hook 안됐으면 그냥 텍스트만 렌더 (일반 독자 뷰 완전 깨끗).
  if (!editMode || !hooked) {
    return <Tag className={baseClass}>{effectiveText}</Tag>;
  }

  // edit 모드 ON — inline style 로 테두리·배지·click handler 확실히 표시.
  const wrapStyle: React.CSSProperties = {
    position: "relative",
    paddingRight: "3.5rem",
    borderRadius: 6,
    outline: "2px solid rgb(37 99 235)",
    outlineOffset: 2,
    background: "rgba(59,130,246,0.10)",
    cursor: "pointer",
    transition: "outline-color .15s ease, background .15s ease",
  };
  const badgeStyle: React.CSSProperties = {
    position: "absolute",
    top: 4,
    right: 4,
    fontSize: 10,
    lineHeight: 1,
    padding: "3px 6px",
    borderRadius: 4,
    background: "rgb(37 99 235)",
    color: "white",
    fontWeight: 600,
    boxShadow: "0 1px 2px rgba(0,0,0,0.15)",
    pointerEvents: "none",
    whiteSpace: "nowrap",
  };

  return (
    <>
      <Tag
        ref={anchorRef as any}
        className={baseClass}
        style={wrapStyle}
        data-block-id={blockId}
        onClick={(e: any) => { e.stopPropagation(); setPopoverOpen(true); }}
        title="클릭하여 수정 제안"
      >
        {effectiveText}
        <span aria-hidden style={badgeStyle}>✎ 편집</span>
      </Tag>
      {popoverOpen && (
        <EditPopover
          blockId={blockId!}
          articleSlug={article!.slug}
          originalText={effectiveText}
          originalHash={textHash!}
          anchorEl={anchorRef.current}
          onClose={() => setPopoverOpen(false)}
        />
      )}
    </>
  );
}
