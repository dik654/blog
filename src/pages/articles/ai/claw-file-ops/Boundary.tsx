import SymlinkEscapeViz from './viz/SymlinkEscapeViz';
import PathAttackVectorsViz from './viz/PathAttackVectorsViz';

export default function Boundary() {
  return (
    <section id="boundary" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">워크스페이스 경계 검증 &amp; 심링크 이스케이프</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <SymlinkEscapeViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">경계 위반 공격 시나리오 4가지</h3>
        <PathAttackVectorsViz />

        <h3 className="text-xl font-semibold mt-8 mb-3">정규화 파이프라인 5단계</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`pub fn normalize_and_validate(
    input_path: &str,
    workspace: &Path,
) -> Result<PathBuf> {
    // 1) 입력 문자열 → PathBuf
    let raw = PathBuf::from(input_path);

    // 2) ../. 정리 (clean)
    let cleaned = path_clean::clean(&raw);

    // 3) 절대 경로 여부 확인
    let absolute = if cleaned.is_absolute() {
        cleaned
    } else {
        workspace.join(cleaned)
    };

    // 4) canonicalize (심링크 해제)
    //    - 파일이 존재해야 canonicalize 가능
    //    - 쓰기의 경우 부모 디렉토리로 검증
    let canonical = if absolute.exists() {
        absolute.canonicalize()?
    } else {
        // 쓰기용: 부모 canonicalize + 파일명 결합
        let parent = absolute.parent().ok_or(anyhow!("no parent"))?;
        let file_name = absolute.file_name().ok_or(anyhow!("no filename"))?;
        parent.canonicalize()?.join(file_name)
    };

    // 5) 워크스페이스 포함 확인
    if !canonical.starts_with(workspace) {
        return Err(anyhow!("escape detected: {:?}", canonical));
    }

    Ok(canonical)
}`}</pre>
        <p>
          <strong>5단계 정규화</strong>: PathBuf 변환 → clean → 절대화 → canonicalize → 경계 검증<br />
          <code>path_clean</code> crate로 <code>../..</code> 패턴 정리 — lexical normalization<br />
          canonicalize는 <strong>파일 존재 전제</strong> — 쓰기는 부모 디렉토리로 검증
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">쓰기 시 부모 디렉토리 검증 — TOCTOU 회피</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 새 파일 쓰기: 파일이 아직 없음
let absolute = workspace.join("new_file.txt");
// absolute.canonicalize() → Err (파일 없음)

// 대안: 부모 디렉토리로 검증
let parent = absolute.parent().unwrap();  // workspace
let canonical_parent = parent.canonicalize()?;

// 부모가 워크스페이스 내부라면 안전
if !canonical_parent.starts_with(workspace) {
    return Err(anyhow!("parent outside workspace"));
}

// 이후 쓰기 수행
tokio::fs::write(&absolute, content).await?;

// ⚠️ TOCTOU 주의:
// 검증 후 쓰기 전에 공격자가 심링크로 바꾸면 우회 가능
// 방어: workspace를 chroot-like 환경에서 실행 (샌드박스 병용)`}</pre>
        <p>
          <strong>TOCTOU(Time-of-check to time-of-use)</strong>: 검증과 사용 사이 공격자 개입<br />
          파일 경로 검증은 근본적으로 TOCTOU 취약 — race condition 발생 가능<br />
          방어: <strong>샌드박스 병용</strong> (bwrap이 파일 시스템 자체를 제한)
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Windows 특수 경로 처리</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`#[cfg(windows)]
fn normalize_windows(path: &Path) -> Result<PathBuf> {
    let s = path.to_string_lossy();

    // UNC prefix 차단
    if s.starts_with(r"\\\\?\\") || s.starts_with(r"\\\\.\\") {
        return Err(anyhow!("UNC/device paths not allowed"));
    }

    // 네트워크 경로 차단
    if s.starts_with(r"\\\\") {
        return Err(anyhow!("network paths not allowed"));
    }

    // 드라이브 문자 정규화 (C: vs c:)
    Ok(PathBuf::from(s.to_uppercase()))
}`}</pre>
        <p>
          <strong>Windows 공격 벡터</strong>: UNC 경로, device 경로, 네트워크 드라이브<br />
          <code>\\?\</code> 프리픽스는 Windows API 상한(260자) 우회 — 보안 검증 우회 시도<br />
          <code>\\</code> 네트워크 경로: 외부 SMB 서버 접근 가능성 — 차단 필수
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">심링크 탐지 테스트 케이스</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`#[cfg(test)]
mod tests {
    use super::*;
    use std::os::unix::fs::symlink;

    #[test]
    fn detect_symlink_escape() {
        let tmp = tempfile::tempdir().unwrap();
        let workspace = tmp.path();

        // 공격자가 심링크 생성
        std::fs::create_dir(workspace.join("sub")).unwrap();
        symlink("/etc/passwd", workspace.join("sub/link")).unwrap();

        // 경계 검증 호출
        let result = normalize_and_validate(
            "sub/link",
            workspace,
        );

        // 차단 성공
        assert!(result.is_err());
        assert!(result.unwrap_err().to_string().contains("escape detected"));
    }

    #[test]
    fn allow_internal_symlink() {
        let tmp = tempfile::tempdir().unwrap();
        let workspace = tmp.path();

        // 워크스페이스 내부 심링크 (정상)
        std::fs::write(workspace.join("real.txt"), "data").unwrap();
        symlink("real.txt", workspace.join("alias.txt")).unwrap();

        let result = normalize_and_validate("alias.txt", workspace);
        assert!(result.is_ok());
    }
}`}</pre>
        <p>
          <strong>테스트 2가지</strong>: 외부 심링크 차단 + 내부 심링크 허용<br />
          내부 심링크는 정상 — 사용자가 편의상 alias를 만들 수 있음<br />
          외부 심링크만 공격 벡터 — canonicalize 결과가 워크스페이스 밖
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">성능 고려 — canonicalize 비용</h3>
        <p>
          <code>canonicalize()</code>는 파일 시스템 호출 — 각 경로 요소마다 stat 호출<br />
          깊은 경로(20단계 이상)는 수 ms 소요 — 대량 작업에서 병목 가능<br />
          <strong>최적화</strong>: 워크스페이스 루트를 1회만 canonicalize, 세션 내 캐시
        </p>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 세션 시작 시 1회 계산
let canonical_workspace = workspace_root().canonicalize()?;

// 이후 매 경로 검증은 상대 경로만 canonicalize
fn validate_relative(rel: &Path) -> Result<PathBuf> {
    let joined = CANONICAL_WS.join(rel);
    let canonical = joined.canonicalize()?;

    // 상수 시간 비교 (prefix check)
    if !canonical.starts_with(&*CANONICAL_WS) {
        return Err(anyhow!("escape"));
    }
    Ok(canonical)
}`}</pre>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: 경계 검증은 단독으로 불완전</p>
          <p>
            문자열 기반 경계 검증의 <strong>근본 한계</strong>:<br />
            - TOCTOU race: 검증과 사용 사이 race condition<br />
            - 심링크 동적 교체: 프로세스 실행 중 link 재설정<br />
            - Windows junction/hardlink: 다른 우회 벡터
          </p>
          <p className="mt-2">
            완전한 방어를 위해 <strong>3중 방어</strong>:<br />
            1. <strong>문자열 검증</strong>: 빠른 사전 차단 (90% 케이스)<br />
            2. <strong>canonicalize 검증</strong>: 심링크 해제 후 재확인<br />
            3. <strong>샌드박스</strong>: 커널 레벨 bind mount로 물리적 격리
          </p>
          <p className="mt-2">
            <strong>claw-code는 1+2를 모든 파일 연산에 적용, 3은 bash 도구에만 적용</strong><br />
            파일 I/O는 워크스페이스만 조작 → 샌드박스 없어도 충분히 안전<br />
            bash는 임의 명령 실행 → 샌드박스 필수
          </p>
        </div>

      </div>
    </section>
  );
}
