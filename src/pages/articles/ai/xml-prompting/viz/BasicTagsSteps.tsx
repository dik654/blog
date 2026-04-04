import { motion } from 'framer-motion';
import { TAGS } from './BasicTagsData';
import { TagContent } from './BasicTagsParts';

const MF = 'ui-monospace,monospace';

const LINES: Record<number, [string, string]> = {
  0: ['요약해줘. 한국어로. 3줄.', '문서: 인공지능의 역사는...'],
  1: ['다음 문서를 참고해서 답변해...', '인공지능의 역사는 1950년...'],
  2: ['이런 식으로 해줘: Q→A ...', '여기 문서도 참고: ...'],
  3: ['답변을 JSON으로 줘...', '필드는 summary, score...'],
};

export function WithoutTag({ step }: { step: number }) {
  const [l1, l2] = LINES[step];
  return (
    <g>
      <text x={110} y={18} textAnchor="middle" fontSize={9}
        fontWeight={600} fill="var(--muted-foreground)">태그 없이</text>
      <rect x={20} y={26} width={180} height={80} rx={6}
        fill="#f59e0b08" stroke="#f59e0b" strokeWidth={1}
        strokeDasharray="4 3" />
      <text x={30} y={46} fontSize={9} fontFamily={MF}
        fill="var(--muted-foreground)">{l1}</text>
      <text x={30} y={62} fontSize={9} fontFamily={MF}
        fill="var(--muted-foreground)">{l2}</text>
      <text x={110} y={92} textAnchor="middle" fontSize={9}
        fill="#f59e0b">↑ 경계 불명확</text>
    </g>
  );
}

export function WithTag({ step }: { step: number }) {
  const t = TAGS[step];
  return (
    <g>
      <text x={350} y={18} textAnchor="middle" fontSize={9}
        fontWeight={600} fill={t.color}>XML 태그</text>
      <motion.rect x={260} y={26} width={180} height={130} rx={6}
        fill={`${t.color}08`} stroke={t.color}
        initial={{ strokeWidth: 1 }} animate={{ strokeWidth: 2 }}
        transition={{ duration: 0.3 }} />
      <motion.g initial={{ opacity: 0, x: 5 }}
        animate={{ opacity: 1, x: 0 }}>
        <text x={270} y={46} fontSize={9} fontFamily={MF}
          fontWeight={600} fill={t.color}>{`<${t.tag}>`}</text>
        <TagContent step={step} color={t.color} tag={t.tag} />
      </motion.g>
    </g>
  );
}
