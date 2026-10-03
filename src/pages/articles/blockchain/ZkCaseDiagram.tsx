import { useId } from "react";

interface Props {
  title: string;
  steps: readonly [string, string, string];
  arrows: readonly [string, string];
}

/** 숫자 하나가 입력·변환·판정을 지나가는 경로. */
export default function ZkCaseDiagram({ title, steps, arrows }: Props) {
  const marker = useId().replace(/:/g, "");
  return (
    <figure data-viz="zk-case" className="my-8 border-y border-border py-5">
      <figcaption className="mb-3 text-sm font-semibold">{title}</figcaption>
      <svg viewBox="0 0 320 290" className="mx-auto block w-full max-w-sm" role="img" aria-label={`${steps[0]} → ${steps[1]} → ${steps[2]}`}>
        <defs><marker id={marker} markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0 0 L7 4 L0 8" fill="none" stroke="currentColor" strokeWidth="1" /></marker></defs>
        <path d="M42 18 H292 L278 72 H28 Z" fill="none" stroke="currentColor" strokeWidth="1" />
        <text x="160" y="50" textAnchor="middle" fontSize="15" fill="currentColor">{steps[0]}</text>
        <path d="M160 73 V112" fill="none" stroke="currentColor" strokeWidth="1" markerEnd={`url(#${marker})`} />
        <text x="176" y="98" fontSize="12" fill="currentColor">{arrows[0]}</text>
        <rect x="28" y="120" width="264" height="54" rx="8" fill="none" stroke="currentColor" strokeWidth="1.25" />
        <text x="160" y="152" textAnchor="middle" fontSize="15" fill="currentColor">{steps[1]}</text>
        <path d="M160 175 V215" fill="none" stroke="currentColor" strokeWidth="1" markerEnd={`url(#${marker})`} />
        <text x="176" y="200" fontSize="12" fill="currentColor">{arrows[1]}</text>
        <path d="M160 223 L292 251 L160 279 L28 251 Z" fill="none" stroke="currentColor" strokeWidth="1" />
        <text x="160" y="256" textAnchor="middle" fontSize="15" fill="currentColor">{steps[2]}</text>
      </svg>
    </figure>
  );
}
