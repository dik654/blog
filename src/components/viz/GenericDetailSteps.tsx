import { motion } from "framer-motion";

interface ItemDef {
  label: string;
  desc: string;
  c: string;
}

/** 2-column box layout */
export function TwoBoxStep({
  title,
  titleColor,
  left,
  right,
}: {
  title: string;
  titleColor: string;
  left: { label: string; lines: string[]; c: string };
  right: { label: string; lines: string[]; c: string };
}) {
  return (
    <g>
      <text
        x={240}
        y={12}
        textAnchor="middle"
        fontSize={10}
        fontWeight={700}
        fill={titleColor}
      >
        {title}
      </text>
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
        <rect
          x={20}
          y={26}
          width={210}
          height={14 + left.lines.length * 14}
          rx={6}
          fill={left.c + "10"}
          stroke={left.c}
          strokeWidth={1}
        />
        <text
          x={125}
          y={42}
          textAnchor="middle"
          fontSize={9}
          fontWeight={600}
          fill={left.c}
        >
          {left.label}
        </text>
        {left.lines.map((l, i) => (
          <text
            key={i}
            x={30}
            y={58 + i * 13}
            fontSize={8}
            fill="var(--muted-foreground)"
          >
            {l}
          </text>
        ))}
      </motion.g>
      <motion.g
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <rect
          x={250}
          y={26}
          width={210}
          height={14 + right.lines.length * 14}
          rx={6}
          fill={right.c + "10"}
          stroke={right.c}
          strokeWidth={1}
        />
        <text
          x={355}
          y={42}
          textAnchor="middle"
          fontSize={9}
          fontWeight={600}
          fill={right.c}
        >
          {right.label}
        </text>
        {right.lines.map((l, i) => (
          <text
            key={i}
            x={260}
            y={58 + i * 13}
            fontSize={8}
            fill="var(--muted-foreground)"
          >
            {l}
          </text>
        ))}
      </motion.g>
    </g>
  );
}

/** Numbered list with fix arrows */
export function NumberedListStep({
  title,
  titleColor,
  items,
}: {
  title: string;
  titleColor: string;
  items: ItemDef[];
}) {
  const spacing = Math.min(30, 130 / items.length);
  return (
    <g>
      <text
        x={240}
        y={12}
        textAnchor="middle"
        fontSize={10}
        fontWeight={700}
        fill={titleColor}
      >
        {title}
      </text>
      {items.map((it, i) => (
        <motion.g
          key={i}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.08 }}
        >
          <rect
            x={21}
            y={23 + i * spacing}
            width={18}
            height={18}
            rx={4}
            fill={it.c + "18"}
            stroke={it.c}
            strokeWidth={0.8}
          />
          <text
            x={30}
            y={36 + i * spacing}
            textAnchor="middle"
            fontSize={8}
            fontWeight={700}
            fill={it.c}
          >
            {i + 1}
          </text>
          <text
            x={48}
            y={30 + i * spacing}
            fontSize={9}
            fontWeight={600}
            fill={it.c}
          >
            {it.label}
          </text>
          <text
            x={48}
            y={42 + i * spacing}
            fontSize={8}
            fill="var(--muted-foreground)"
          >
            {it.desc}
          </text>
        </motion.g>
      ))}
    </g>
  );
}

/** Horizontal bar chart comparison */
export function BarCompareStep({
  title,
  titleColor,
  bars,
  suffix,
}: {
  title: string;
  titleColor: string;
  suffix?: string;
  bars: { label: string; value: number; maxVal: number; c: string }[];
}) {
  return (
    <g>
      <text
        x={240}
        y={12}
        textAnchor="middle"
        fontSize={10}
        fontWeight={700}
        fill={titleColor}
      >
        {title}
      </text>
      {bars.map((b, i) => {
        const w = (b.value / b.maxVal) * 300;
        return (
          <motion.g
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <text
              x={30}
              y={40 + i * 30}
              fontSize={9}
              fontWeight={600}
              fill={b.c}
            >
              {b.label}
            </text>
            <rect
              x={120}
              y={28 + i * 30}
              width={w}
              height={18}
              rx={4}
              fill={b.c + "20"}
              stroke={b.c}
              strokeWidth={0.8}
            />
            <text
              x={125 + w}
              y={40 + i * 30}
              fontSize={8}
              fill="var(--muted-foreground)"
            >
              {b.value}
              {suffix || ""}
            </text>
          </motion.g>
        );
      })}
    </g>
  );
}

/** Flow: top-down sequence of labeled cards */
export function FlowStep({
  title,
  titleColor,
  nodes,
  annotation,
}: {
  title: string;
  titleColor: string;
  annotation?: string;
  nodes: { label: string; c: string }[];
}) {
  const spacing = Math.min(30, 118 / nodes.length);
  const boxHeight = Math.max(18, spacing - 5);
  return (
    <g>
      <text
        x={240}
        y={12}
        textAnchor="middle"
        fontSize={10}
        fontWeight={700}
        fill={titleColor}
      >
        {title}
      </text>
      {nodes.map((n, i) => {
        const y = 24 + i * spacing;
        return (
          <motion.g
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <rect
              x={92}
              y={y}
              width={350}
              height={boxHeight}
              rx={5}
              fill={n.c + "12"}
              stroke={n.c}
              strokeWidth={0.8}
            />
            <text
              x={105}
              y={y + boxHeight / 2 + 3}
              fontSize={8}
              fontWeight={600}
              fill={n.c}
            >
              {n.label}
            </text>
            <rect
              x={25}
              y={y}
              width={52}
              height={boxHeight}
              rx={5}
              fill={n.c + "0c"}
            />
            <text
              x={51}
              y={y + boxHeight / 2 + 3}
              textAnchor="middle"
              fontSize={7}
              fontWeight={700}
              fill={n.c}
            >
              STEP {String(i + 1).padStart(2, "0")}
            </text>
          </motion.g>
        );
      })}
      {annotation && (
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <text
            x={240}
            y={153}
            textAnchor="middle"
            fontSize={8}
            fill="var(--muted-foreground)"
          >
            {annotation}
          </text>
        </motion.g>
      )}
    </g>
  );
}

/** Single large box with multiple lines */
export function InfoBoxStep({
  title,
  titleColor,
  boxLabel,
  lines,
  boxColor,
}: {
  title: string;
  titleColor: string;
  boxLabel: string;
  lines: string[];
  boxColor: string;
}) {
  return (
    <g>
      <text
        x={240}
        y={12}
        textAnchor="middle"
        fontSize={10}
        fontWeight={700}
        fill={titleColor}
      >
        {title}
      </text>
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
        <rect
          x={40}
          y={24}
          width={400}
          height={16 + lines.length * 14}
          rx={6}
          fill={boxColor + "08"}
          stroke={boxColor}
          strokeWidth={1}
        />
        <text
          x={240}
          y={40}
          textAnchor="middle"
          fontSize={9.5}
          fontWeight={600}
          fill={boxColor}
        >
          {boxLabel}
        </text>
        {lines.map((l, i) => (
          <text
            key={i}
            x={55}
            y={56 + i * 14}
            fontSize={8.5}
            fill="var(--muted-foreground)"
          >
            {l}
          </text>
        ))}
      </motion.g>
    </g>
  );
}
