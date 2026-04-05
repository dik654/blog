import ReadWriteViz from './viz/ReadWriteViz';

export default function ReadWrite() {
  return (
    <section id="read-write" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">read_file / write_file / edit_file 구현</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <ReadWriteViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">read_file — 줄 단위 읽기</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`pub struct TextFilePayload {
    pub path: String,          // 파일 경로
    pub offset: Option<usize>, // 시작 줄 (0-indexed)
    pub limit: Option<usize>,  // 읽을 줄 수
}

pub async fn read_file(payload: TextFilePayload) -> Result<ToolOutput> {
    // 1) 경로 검증
    let path = PathBuf::from(&payload.path);
    validate_path(&path, &workspace_root())?;

    // 2) 파일 크기 체크
    let metadata = tokio::fs::metadata(&path).await?;
    if metadata.len() > MAX_FILE_SIZE {
        return Err(anyhow!("file too large: {} bytes", metadata.len()));
    }

    // 3) 전체 읽기
    let content = tokio::fs::read_to_string(&path).await?;

    // 4) offset/limit 적용
    let lines: Vec<&str> = content.lines().collect();
    let start = payload.offset.unwrap_or(0).min(lines.len());
    let end = payload.limit
        .map(|l| (start + l).min(lines.len()))
        .unwrap_or(lines.len());

    // 5) 줄 번호와 함께 포맷
    let formatted: String = lines[start..end].iter()
        .enumerate()
        .map(|(i, line)| format!("{}\\t{}", start + i + 1, line))
        .collect::<Vec<_>>().join("\\n");

    Ok(ToolOutput::text(formatted))
}

const MAX_FILE_SIZE: u64 = 10 * 1024 * 1024;  // 10MB`}</pre>
        <p>
          <strong>5단계 실행</strong>: 경로 검증 → 크기 체크 → 읽기 → 부분 추출 → 포맷팅<br />
          10MB 상한: LLM 컨텍스트 보호, 대용량 파일은 grep로 필터링 후 읽기 권장<br />
          줄 번호 프리픽스(<code>{`{line_num}\t{content}`}</code>): LLM이 정확한 위치 참조 가능
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">write_file — 전체 덮어쓰기</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`pub struct WriteFileInput {
    pub path: String,
    pub content: String,
}

pub async fn write_file(input: Value) -> Result<ToolOutput> {
    let WriteFileInput { path, content } = serde_json::from_value(input)?;
    let path = PathBuf::from(path);

    // 1) 경로 검증
    validate_path(&path, &workspace_root())?;

    // 2) 디렉토리 존재 확인 (없으면 생성)
    if let Some(parent) = path.parent() {
        if !parent.exists() {
            tokio::fs::create_dir_all(parent).await?;
        }
    }

    // 3) 기존 파일 백업 (diff 추적용)
    let backup = if path.exists() {
        Some(tokio::fs::read_to_string(&path).await?)
    } else { None };

    // 4) 쓰기
    tokio::fs::write(&path, &content).await?;

    // 5) diff 계산 (UI 표시용)
    let diff = if let Some(old) = backup {
        compute_diff(&old, &content)
    } else {
        format!("(new file, {} bytes)", content.len())
    };

    Ok(ToolOutput::text(format!("wrote {} bytes\\n\\n{}", content.len(), diff)))
}`}</pre>
        <p>
          <strong>5단계 쓰기</strong>: 검증 → 부모 디렉토리 생성 → 백업 → 쓰기 → diff 계산<br />
          부모 자동 생성: LLM이 <code>src/new/module.rs</code> 요청 시 <code>src/new/</code> 자동 mkdir<br />
          diff 출력: 사용자가 변경 내용을 즉시 검토 가능
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">edit_file — 문자열 치환</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`pub struct EditFileInput {
    pub path: String,
    pub old_string: String,
    pub new_string: String,
    pub replace_all: bool,  // 기본 false: 한 번만 치환
}

pub async fn edit_file(input: Value) -> Result<ToolOutput> {
    let EditFileInput { path, old_string, new_string, replace_all } =
        serde_json::from_value(input)?;
    let path = PathBuf::from(path);

    validate_path(&path, &workspace_root())?;

    // 1) 파일 읽기
    let content = tokio::fs::read_to_string(&path).await?;

    // 2) old_string 발견 횟수 체크
    let occurrences = content.matches(&old_string).count();
    if occurrences == 0 {
        return Err(anyhow!("old_string not found"));
    }
    if !replace_all && occurrences > 1 {
        return Err(anyhow!(
            "old_string appears {} times, but replace_all=false. \\
             Provide more context or set replace_all=true.",
            occurrences
        ));
    }

    // 3) 치환
    let new_content = if replace_all {
        content.replace(&old_string, &new_string)
    } else {
        content.replacen(&old_string, &new_string, 1)
    };

    // 4) 쓰기
    tokio::fs::write(&path, &new_content).await?;

    Ok(ToolOutput::text(format!("replaced {} occurrences", occurrences)))
}`}</pre>
        <p>
          <strong>핵심 안전장치</strong>: <code>replace_all=false</code>에서 <code>old_string</code>이 여러 번 나타나면 에러<br />
          이유: LLM이 "첫 매칭만"을 의도했는데 모호한 경우 — 잘못된 위치 수정 방지<br />
          사용자에게 "더 많은 컨텍스트 제공 또는 replace_all 사용"이라고 안내
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">edit_file의 고유성 요구 — 왜 중요한가</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 위험한 예시
file content:
  let x = 1;
  let x = 2;

LLM 호출: edit_file(path, "let x = 1;", "let x = 100;")
  → 기대: 첫 줄만 변경
  → 실제: 첫 줄만 변경 (replacen으로 1회만)

LLM 호출: edit_file(path, "let x", "let y")
  → 기대: ??? (모호)
  → 실제: Err("old_string appears 2 times")
  → LLM 재시도: "let x = 1" 같이 더 구체적으로

// 올바른 사용
LLM 호출: edit_file(path, "let x = 1;", "let x = 100;", replace_all=false)
  → 정확히 첫 매칭 1개만 치환`}</pre>
        <p>
          <strong>2회 이상 매칭 거부</strong>: 의도 모호성을 즉시 LLM에게 피드백<br />
          LLM이 에러를 보고 더 많은 컨텍스트(앞뒤 줄 포함)로 재시도<br />
          결과: "잘못된 위치 수정" 버그가 거의 발생하지 않음
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">compute_diff — 간이 diff 생성</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`fn compute_diff(old: &str, new: &str) -> String {
    use similar::{ChangeTag, TextDiff};

    let diff = TextDiff::from_lines(old, new);
    let mut out = String::new();
    for change in diff.iter_all_changes() {
        let sign = match change.tag() {
            ChangeTag::Delete => "-",
            ChangeTag::Insert => "+",
            ChangeTag::Equal  => " ",
        };
        out.push_str(&format!("{}{}", sign, change));
    }
    out
}`}</pre>
        <p>
          <code>similar</code> crate로 라인 단위 diff 생성<br />
          출력 포맷: unified diff (+/-/공백 프리픽스)<br />
          UI가 diff를 syntax highlighting하여 사용자에게 표시 — 변경 내용 즉시 파악
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: write_file vs edit_file 선택 기준</p>
          <p>
            <strong>write_file</strong>: 전체 덮어쓰기<br />
            - 적합: 새 파일 생성, 작은 파일 완전 재작성<br />
            - 부적합: 대용량 파일 일부 수정 — LLM이 전체 내용 재생성해야 함 (토큰 낭비)
          </p>
          <p className="mt-2">
            <strong>edit_file</strong>: 부분 치환<br />
            - 적합: 대부분의 리팩토링·버그 수정<br />
            - 부적합: 대량 변경 (여러 edit 호출 필요)
          </p>
          <p className="mt-2">
            <strong>일반 규칙</strong>: "파일의 &gt;50% 변경이면 write_file, 아니면 edit_file"<br />
            이유: edit_file은 old_string을 찾기 위해 LLM이 기존 코드 참조 필요 — 대변경 시 비용 더 큼<br />
            claw-code의 시스템 프롬프트가 LLM에게 이 가이드라인 제공
          </p>
        </div>

      </div>
    </section>
  );
}
