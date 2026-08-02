const ATTACKS = [
  {
    title: '상위 디렉터리 이동',
    input: '../../etc/passwd',
    signal: 'component 정리 뒤 root 밖',
    closure: 'resolved target + open-time root',
  },
  {
    title: 'ancestor symlink',
    input: 'workspace/cache/x → cache가 외부 link',
    signal: 'canonicalize가 중간 link 해석',
    closure: 'NO_SYMLINKS 또는 trusted dirfd walk',
  },
  {
    title: '검사 후 교체',
    input: '검사 직후 parent를 symlink로 교체',
    signal: '사전 검사만으로 탐지 불가',
    closure: 'openat2 RESOLVE_BENEATH / IN_ROOT',
  },
  {
    title: 'Windows namespace',
    input: String.raw`\\server\share · \\?\C:\path · \\.\device`,
    signal: 'UNC·extended·device namespace 구분',
    closure: '플랫폼별 parser와 handle 기반 정책',
  },
];

export default function PathAttackVectorsViz() {
  return (
    <figure aria-label="경로 공격과 이를 닫는 방어를 비교한 표" className="not-prose my-7 overflow-hidden rounded-md border border-border">
      <figcaption className="border-b border-border px-4 py-3">
        <p className="text-sm font-semibold">같은 “경로 이탈”도 실패 지점이 다르다</p>
      </figcaption>
      <div className="divide-y divide-border">
        {ATTACKS.map((attack) => (
          <div
            key={attack.title}
            className="grid gap-3 px-4 py-4 md:grid-cols-[150px_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)]"
          >
            <p className="text-sm font-semibold">{attack.title}</p>
            <div className="min-w-0">
              <p className="text-xs font-medium text-muted-foreground">입력 / race</p>
              <code className="mt-1 block break-all whitespace-normal text-xs">{attack.input}</code>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">사전 검사에서 보이는 것</p>
              <p className="mt-1 text-xs leading-relaxed">{attack.signal}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">닫는 방어</p>
              <p className="mt-1 text-xs leading-relaxed">{attack.closure}</p>
            </div>
          </div>
        ))}
      </div>
    </figure>
  );
}
