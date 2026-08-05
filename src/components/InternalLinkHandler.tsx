import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { categories } from '@/content';
import { BLOG_ROOT, CORE_ROOT, LAB_ROOT } from '@/lib/paths';

const categorySlugs = new Set(categories.map((category) => category.slug));

function normalizeInternalPath(pathname: string) {
  if (pathname === LAB_ROOT || pathname.startsWith(`${LAB_ROOT}/`)) {
    return pathname;
  }

  if (pathname === '/blog') return BLOG_ROOT;
  if (pathname.startsWith('/blog/')) return `${LAB_ROOT}${pathname}`;

  if (pathname === '/core') return CORE_ROOT;
  if (pathname.startsWith('/core/')) return `${LAB_ROOT}${pathname}`;

  const firstSegment = pathname.split('/').filter(Boolean)[0];
  if (firstSegment && categorySlugs.has(firstSegment)) {
    return `${BLOG_ROOT}${pathname}`;
  }

  return null;
}

export default function InternalLinkHandler() {
  const navigate = useNavigate();

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented) return;
      if (event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const target = event.target as Element | null;
      const anchor = target?.closest<HTMLAnchorElement>('a[href]');
      if (!anchor) return;
      if (anchor.target && anchor.target !== '_self') return;
      if (anchor.hasAttribute('download')) return;

      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname && url.search === window.location.search && url.hash) return;

      const pathname = normalizeInternalPath(url.pathname);
      if (!pathname) return;
      const learningPathId = anchor.dataset.learningPathId;

      event.preventDefault();
      navigate(`${pathname}${url.search}${url.hash}`, {
        state: learningPathId ? { learningPathId } : undefined,
      });
    };

    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [navigate]);

  return null;
}
