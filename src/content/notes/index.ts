import type { Category } from '../types';
import { notesArticles } from './articles';

// 자동 미러 — fundamentals-to-blog.ts 가 매번 재생성. 직접 수정 금지.
const notes: Category = {
  slug: 'notes',
  name: '🤖 자동 노트',
  description: '영상·아티클에서 추출한 개념을 fundamentals 로 누적한 글. 사람 손이 닿은 다른 카테고리와 분리된 거친 자동 글.',
  group: 'system',
  subcategories: [
    { slug: "notes-fundamentals-software-verification", name: "software-verification", description: "software-verification fundamentals", icon: "📓" },
    { slug: "notes-fundamentals-music-improvisation", name: "음악 즉흥", description: "재즈 · 모드 · 화성 fundamentals", icon: "🎷" },
    { slug: "notes-fundamentals-misc", name: "기타", description: "토픽 미분류 fundamentals", icon: "📚" },
  ],
  articles: notesArticles,
};

export default notes;
