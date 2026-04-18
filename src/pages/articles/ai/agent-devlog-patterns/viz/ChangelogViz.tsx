import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ActionBox, AlertBox, DataBox } from '@/components/viz/boxes';
import { STEPS, GOOD_VS_BAD, FILE_STRUCTURE } from './ChangelogData';

const W = 480, H = 220;

export default function ChangelogViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && <SingleFile />}
          {step === 1 && <MonthlyAnchor />}
          {step === 2 && <EntryFormat />}
          {step === 3 && <GoodVsBad />}
          {step === 4 && <OneMinuteRoutine />}
          {step === 5 && <GitHook />}
          {step === 6 && <Archive />}
          {step === 7 && <RecoveryFromFailure />}
        </svg>
      )}
    </StepViz>
  );
}

function SingleFile() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <text x={W / 2} y={26} textAnchor="middle" fontSize={11} fontWeight={700}
        fill="var(--foreground)">한 파일, 시간역순 prepend</text>
      <rect x={100} y={46} width={280} height={156} rx={4}
        fill="var(--card)" stroke="var(--border)" strokeWidth={0.8} />
      <text x={115} y={62} fontSize={9} fontWeight={700}
        fill="var(--muted-foreground)">knowledge/changelog.md</text>

      {[
        { y: 82, label: '최신 (prepend)', color: '#3b82f6', bold: true },
        { y: 104, label: '이전', color: '#a3a3a3' },
        { y: 122, label: '이전', color: '#a3a3a3' },
        { y: 140, label: '이전', color: '#a3a3a3' },
        { y: 158, label: '가장 오래된', color: '#d4d4d4' },
      ].map((e, i) => (
        <motion.g key={i}
          initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 + i * 0.08 }}>
          <rect x={120} y={e.y} width={240} height={14} rx={2}
            fill={`${e.color}${e.bold ? '30' : '15'}`} stroke={e.color} strokeWidth={0.6} />
          <text x={128} y={e.y + 10} fontSize={9}
            fontWeight={e.bold ? 700 : 400} fill={e.color}>{e.label}</text>
        </motion.g>
      ))}

      <text x={90} y={90} textAnchor="end" fontSize={8}
        fill="#3b82f6">↓ 새 엔트리</text>
      <text x={390} y={170} fontSize={8}
        fill="var(--muted-foreground)">오래된 것은</text>
      <text x={390} y={182} fontSize={8}
        fill="var(--muted-foreground)">자연스럽게 밀림</text>
    </motion.g>
  );
}

function MonthlyAnchor() {
  const months = [
    { name: '## 2026-04', y: 56, color: '#3b82f6' },
    { name: '## 2026-03', y: 106, color: '#a3a3a3' },
    { name: '## 2026-02', y: 156, color: '#a3a3a3' },
  ];
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <text x={W / 2} y={26} textAnchor="middle" fontSize={11} fontWeight={700}
        fill="var(--foreground)">월별 섹션으로 "2주 전" 같은 상대 시간 scanning</text>
      {months.map((m, i) => (
        <motion.g key={m.name}
          initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 + i * 0.08 }}>
          <rect x={40} y={m.y} width={400} height={40} rx={4}
            fill={`${m.color}10`} stroke={m.color} strokeWidth={0.8} />
          <text x={56} y={m.y + 14} fontSize={11} fontWeight={700}
            fontFamily="monospace" fill={m.color}>{m.name}</text>
          <text x={56} y={m.y + 30} fontSize={8.5}
            fill="var(--muted-foreground)">### 2026-{m.name.slice(-2)}-16 / ### -15 / ### -14 / ...</text>
        </motion.g>
      ))}
      <text x={W / 2} y={205} textAnchor="middle" fontSize={9}
        fill="var(--muted-foreground)">월 헤딩 = 큰 앵커, 날짜 sub-heading = 작은 앵커</text>
    </motion.g>
  );
}

function EntryFormat() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <text x={W / 2} y={24} textAnchor="middle" fontSize={11} fontWeight={700}
        fill="var(--foreground)">한 엔트리 3~5줄 — 제목 + 요약 + 링크</text>
      <rect x={40} y={44} width={400} height={150} rx={4}
        fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
      {FILE_STRUCTURE.map((f, i) => {
        const y = 60 + i * 12;
        const colorMap: Record<string, string> = {
          title: '#3b82f6',
          month: '#a855f7',
          date: '#10b981',
          entry: '#f59e0b',
          body: 'var(--foreground)',
          link: '#10b981',
          blank: 'transparent',
        };
        const fontSize = f.kind === 'entry' ? 9.5 : 8.5;
        const weight = f.kind === 'entry' || f.kind === 'title' ? 700 : 400;
        return (
          <motion.g key={i}
            initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.05 + i * 0.03 }}>
            <text x={56} y={y} fontSize={fontSize} fontFamily="monospace"
              fontWeight={weight} fill={colorMap[f.kind]}>{f.line}</text>
          </motion.g>
        );
      })}
      <text x={W / 2} y={210} textAnchor="middle" fontSize={8.5}
        fill="var(--muted-foreground)">본문 3줄 초과 → ADR/Lessons로 빼낸다</text>
    </motion.g>
  );
}

function GoodVsBad() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <text x={W / 2} y={22} textAnchor="middle" fontSize={11} fontWeight={700}
        fill="var(--foreground)">나쁜 엔트리 → 좋은 엔트리</text>
      {GOOD_VS_BAD.map((e, i) => {
        const y = 42 + i * 56;
        return (
          <motion.g key={i}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.1 + i * 0.1 }}>
            <rect x={30} y={y} width={180} height={24} rx={3}
              fill="#ef444410" stroke="#ef4444" strokeWidth={0.8} strokeDasharray="4 3" />
            <text x={40} y={y + 15} fontSize={9}
              fontFamily="monospace" fill="#ef4444">{e.bad}</text>
            <text x={215} y={y + 15} fontSize={12} fill="var(--muted-foreground)">→</text>
            <rect x={230} y={y} width={230} height={24} rx={3}
              fill="#10b98110" stroke="#10b981" strokeWidth={0.8} />
            <text x={238} y={y + 15} fontSize={8.5}
              fontFamily="monospace" fill="#10b981">{e.good}</text>
            <text x={40} y={y + 42} fontSize={8}
              fill="var(--muted-foreground)">{e.why}</text>
          </motion.g>
        );
      })}
    </motion.g>
  );
}

function OneMinuteRoutine() {
  const steps = [
    { label: '코드 변경 완료', t: 0 },
    { label: '커밋', t: 1 },
    { label: 'changelog.md 열기', t: 2 },
    { label: '1분 타이머', t: 3 },
    { label: '엔트리 prepend', t: 4 },
  ];
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <text x={W / 2} y={26} textAnchor="middle" fontSize={11} fontWeight={700}
        fill="var(--foreground)">작업 완료 직후 1분 루틴 — 유일한 유지 타이밍</text>
      {steps.map((s, i) => {
        const x = 30 + i * 88;
        return (
          <motion.g key={i}
            initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.08 }}>
            <rect x={x} y={70} width={80} height={40} rx={4}
              fill="#3b82f615" stroke="#3b82f6" strokeWidth={0.8} />
            <text x={x + 40} y={88} textAnchor="middle" fontSize={8.5}
              fill="var(--foreground)">{s.label}</text>
            <text x={x + 40} y={102} textAnchor="middle" fontSize={8}
              fill="var(--muted-foreground)">step {i + 1}</text>
            {i < steps.length - 1 && (
              <text x={x + 84} y={93} fontSize={10}
                fill="var(--muted-foreground)">→</text>
            )}
          </motion.g>
        );
      })}
      <text x={W / 2} y={138} textAnchor="middle" fontSize={9}
        fill="var(--muted-foreground)">1분 안에 안 끝나면 본문이 너무 길다는 신호</text>
      <text x={W / 2} y={154} textAnchor="middle" fontSize={9}
        fill="var(--muted-foreground)">→ ADR/Lessons 로 빼내고 Changelog에는 링크만</text>
      <AlertBox x={70} y={170} w={340} h={32}
        label='"다음에 써야지" = "안 쓴다"' sub="그 순간이 유일한 기회" color="#ef4444" />
    </motion.g>
  );
}

function GitHook() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <text x={W / 2} y={26} textAnchor="middle" fontSize={11} fontWeight={700}
        fill="var(--foreground)">post-commit hook으로 리마인더</text>
      <ActionBox x={30} y={56} w={100} h={42}
        label="git commit" sub="post-commit" color="#3b82f6" />
      <text x={140} y={82} fontSize={12} fill="var(--muted-foreground)">→</text>
      <ActionBox x={155} y={56} w={130} h={42}
        label="mtime 비교" sub="changelog.md vs 오늘" color="#a855f7" />
      <text x={295} y={82} fontSize={12} fill="var(--muted-foreground)">→</text>
      <DataBox x={310} y={62} w={140} h={30}
        label="⚠ changelog 갱신?" color="#f59e0b" outlined />

      <rect x={40} y={118} width={400} height={78} rx={4}
        fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
      <text x={56} y={136} fontSize={9} fontWeight={700}
        fill="var(--foreground)">#!/bin/sh (post-commit)</text>
      <text x={56} y={152} fontSize={8.5} fontFamily="monospace"
        fill="var(--foreground)">LAST=$(stat -f %m knowledge/changelog.md)</text>
      <text x={56} y={166} fontSize={8.5} fontFamily="monospace"
        fill="var(--foreground)">if [ $((NOW - LAST)) -gt 86400 ]; then</text>
      <text x={56} y={180} fontSize={8.5} fontFamily="monospace"
        fill="var(--foreground)">  echo "⚠ changelog 1일 이상 정체"</text>
      <text x={56} y={194} fontSize={8.5} fontFamily="monospace"
        fill="var(--foreground)">fi</text>
    </motion.g>
  );
}

function Archive() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <text x={W / 2} y={26} textAnchor="middle" fontSize={11} fontWeight={700}
        fill="var(--foreground)">월 1회 수동 split — 메인 파일 경량 유지</text>
      <rect x={30} y={50} width={180} height={90} rx={4}
        fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
      <text x={46} y={68} fontSize={9} fontWeight={700} fill="var(--foreground)">changelog.md (메인)</text>
      <text x={46} y={84} fontSize={8.5} fill="#3b82f6">## 2026-04 (현재)</text>
      <text x={46} y={100} fontSize={8.5} fill="#3b82f6">## 2026-03 (이전)</text>
      <text x={46} y={116} fontSize={8.5} fill="var(--muted-foreground)">(나머지는 아카이브)</text>
      <text x={46} y={132} fontSize={8}
        fill="var(--muted-foreground)">→ 수백 줄 이하 유지</text>

      <text x={225} y={98} fontSize={14} fontWeight={700}
        fill="var(--muted-foreground)">→</text>

      <rect x={250} y={50} width={200} height={90} rx={4}
        fill="#a3a3a310" stroke="#a3a3a3" strokeWidth={0.5} />
      <text x={266} y={68} fontSize={9} fontWeight={700} fill="var(--foreground)">archive/</text>
      <text x={266} y={84} fontSize={8.5} fill="var(--muted-foreground)">changelog-2026-02.md</text>
      <text x={266} y={100} fontSize={8.5} fill="var(--muted-foreground)">changelog-2026-01.md</text>
      <text x={266} y={116} fontSize={8.5} fill="var(--muted-foreground)">changelog-2025-12.md</text>
      <text x={266} y={132} fontSize={8} fill="var(--muted-foreground)">→ 필요 시만 조회</text>

      <text x={W / 2} y={168} textAnchor="middle" fontSize={9}
        fill="var(--muted-foreground)">자동화하려다 오히려 깨진다 — 월 1회 수동 고정</text>
      <text x={W / 2} y={184} textAnchor="middle" fontSize={9}
        fill="var(--muted-foreground)">split 시점은 매달 1일로 고정 — "언제 할지"를 결정할 필요 없음</text>
    </motion.g>
  );
}

function RecoveryFromFailure() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <text x={W / 2} y={24} textAnchor="middle" fontSize={11} fontWeight={700}
        fill="var(--foreground)">유지 실패 후 회복 — "지금부터만"</text>
      <AlertBox x={30} y={48} w={420} h={46}
        label="실패 패턴: 2주 쌓였다가 한 번에 쓰려 하면 기억이 흐려져 포기"
        sub="완벽주의가 changelog의 가장 큰 적이다" color="#ef4444" />

      <text x={56} y={114} fontSize={9} fontWeight={700}
        fill="var(--foreground)">회복 전략</text>
      <rect x={40} y={120} width={420} height={72} rx={4}
        fill="#10b98108" stroke="#10b981" strokeWidth={0.8} />
      <text x={56} y={138} fontSize={9} fill="var(--foreground)">✓ 과거를 메꾸려 하지 말 것</text>
      <text x={56} y={154} fontSize={9} fill="var(--foreground)">✓ 오늘 작업부터 다시 한 줄씩 시작</text>
      <text x={56} y={170} fontSize={9} fill="var(--foreground)">✓ 빠진 기간은 그냥 공백 — 나중의 나는 그 공백을 신경 안 쓴다</text>
      <text x={56} y={186} fontSize={9} fill="var(--foreground)">✓ 완벽한 changelog보다 불완전한 changelog가 훨씬 가치 있다</text>
    </motion.g>
  );
}
