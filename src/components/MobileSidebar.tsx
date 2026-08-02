import { useEffect } from 'react';
import { X } from 'lucide-react';
import Sidebar from './Sidebar';

interface Props {
  open: boolean;
  onClose: () => void;
}

/**
 * 모바일/태블릿 (lg 미만) 전용 슬라이드 drawer.
 * 데스크톱은 `Layout.tsx` 의 fixed aside 가 그대로 보임.
 * shadcn Sheet 미설치 환경이라 transform + overlay 를 직접 제어.
 */
export default function MobileSidebar({ open, onClose }: Props) {
  // ESC 닫기
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  // 열려있는 동안 body 스크롤 잠금
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      {/* 오버레이 */}
      <div
        onClick={onClose}
        aria-hidden
        className={`fixed inset-0 z-[55] bg-black/40 backdrop-blur-sm transition-opacity lg:hidden ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />
      {/* 사이드 패널 */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="카테고리 메뉴"
        className={`fixed top-0 bottom-0 left-0 z-[60] w-[86vw] max-w-[320px] border-r bg-background shadow-xl transition-transform duration-200 ease-out lg:hidden ${
          open ? 'translate-x-0' : 'hidden -translate-x-full'
        }`}
      >
        <div className="flex h-14 items-center justify-between border-b px-4">
          <span className="text-sm font-semibold">카테고리</span>
          <button
            onClick={onClose}
            aria-label="닫기"
            className="inline-flex h-11 w-11 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <X aria-hidden className="h-5 w-5" />
          </button>
        </div>
        <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 3.5rem)' }}>
          <Sidebar onNavigate={onClose} />
        </div>
      </aside>
    </>
  );
}
