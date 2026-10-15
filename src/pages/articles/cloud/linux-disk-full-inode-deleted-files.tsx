import { Link } from "react-router-dom";
import CalculationWalkthrough from "@/components/articles/calculation-walkthrough";
import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import DiskAccountsViz from "./linux-disk-full-inode-deleted-files/viz/DiskAccountsViz";
import LinkCountViz from "./linux-disk-full-inode-deleted-files/viz/LinkCountViz";
import DiagnosisStepViz from "./linux-disk-full-inode-deleted-files/viz/DiagnosisStepViz";
import { codeRefs } from "./linux-disk-full-inode-deleted-files/codeRefs";
import { diskFullTrees } from "./linux-disk-full-inode-deleted-files/fileTree";

const prose = "prose prose-neutral max-w-none dark:prose-invert";

export default function LinuxDiskFullArticle() {
  const sidebar = useCodeSidebar();
  const code = (key: string, label: string) => <CodeViewButton label={label} onClick={() => sidebar.open(key, codeRefs[key])} />;
  return (
    <>
      <div className="space-y-16">
        <section id="overview" data-teach-level="S" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">1. 로그를 지웠는데 왜 디스크는 여전히 꽉 찼다고 하나요?</h2>
          <div className={prose}>
            <p>새벽에 애플리케이션이 &quot;No space left on device&quot;를 내며 멈췄습니다. 당직자는 30GiB짜리 로그를 rm으로 지웠지만 df는 그대로 100%를 보여 줍니다. 국내 현업자들이 만든 리눅스 엔지니어 면접 질문지에는 df로는 여유가 있는데 파일시스템이 찼다고 나오는 상황이 장애 대응 문항으로 올라 있습니다. 제3자가 정리한 Google SRE 면접 준비 가이드에도 inode와 링크를 설명하라는 질문이 나옵니다.</p>
            <p>이 글의 답을 먼저 적겠습니다. &quot;디스크가 찼다&quot;는 하나의 상태가 아닙니다. 블록, inode, root 몫으로 떼어 둔 예약 블록, 이름은 지워졌지만 아직 열려 있는 파일이라는 네 계정 중 하나가 바닥난 상태입니다. 그래서 df -h, df -i, du, lsof +L1을 차례로 맞대어 어느 계정인지부터 가릅니다.</p>
            <p>열린 채 지워진 파일이 남는 이유는 파일 이름이 inode를 가리키는 링크일 뿐이기 때문입니다. 커널은 링크 수와 열린 참조가 모두 0이 될 때만 블록을 돌려줍니다. 100GiB ext4 하나로 이 답을 숫자, 그림, Linux 6.12의 실제 코드 순서로 따라갑니다. 시리즈 전체 지도는 <Link to="/cs/cloud/linux-server-interview-incident-map#overview">Linux 서버 면접·장애 지도</Link>에 있습니다.</p>
          </div>
        </section>

        <section id="black-box" data-teach-level="B" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">2. 새 파일 하나는 블록과 inode를 함께 요구합니다</h2>
          <div className={prose}>
            <p>
            바깥에서 보면 파일시스템은 이름을 받아 바이트를 저장하는 상자입니다. 안쪽에서는 두 가지 자원을 따로 셉니다. 내용을 담는 고정 크기 칸인 블록(block)과, 파일 하나의
            크기·권한·블록 위치를 적는 기록 카드인 inode입니다. 새 파일을 만들면 카드 한 장과 블록 몇 칸이 함께 필요하고 기존 파일 끝에 덧붙이면 블록만 더 필요합니다.
          </p>
            <p>둘 중 하나만 바닥나도 쓰기는 같은 오류 ENOSPC로 실패합니다. 오류 이름이 같으니 메시지만 보고는 어느 쪽이 모자란지 알 수 없습니다. 여기에 블록 중 일부를 root만 쓰도록 떼어 두는 예약과, 이름 없이 블록을 쥐고 있는 파일이 더해져 계정이 넷이 됩니다.</p>
            <p>두 도구가 다른 장부를 읽는다는 점도 상자 밖에서 알아 둘 일입니다. df는 커널에 statfs를 물어 파일시스템 전체의 빈칸을 받습니다. du는 디렉터리를 따라 내려가며 이름이 있는 파일의 크기를 더합니다. 이름 없는 파일은 df에만 보이고 du에는 보이지 않습니다. 디스크 장치 자체의 속도와 수명은 <Link to="/cs/gpu/hw-nvme-storage">NVMe 스토리지</Link>에서 다루고, 이 글은 파일시스템의 회계만 봅니다.</p>
          </div>
        </section>

        <section id="small-case" data-teach-level="0" data-calculation-explained className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">3. 100GiB ext4는 블록 2,621만 칸과 inode 655만 개로 시작합니다</h2>
          <div className={prose}>
            <p>
            (가정) 100GiB 디스크를 블록 4KiB, 예약 5%, inode 비율 16,384 byte로 ext4 포맷했다고 합시다. mke2fs 문서는 예약 기본값을 5%로 적고
            mke2fs.conf 예시의 기본 단락은 blocksize 4096과 inode_ratio 16384를 씁니다. 메타데이터가 차지하는 몫은 계산을 단순하게 하려고 0으로
            둡니다.
          </p>
            <p>
            블록은 100GiB를 4KiB로 나눈 26,214,400칸입니다. 그중 5%인 1,310,720칸, 곧 5GiB는 root용 예약입니다. inode는 공간 16,384
            byte마다 하나를 만들기 때문에 6,553,600개입니다. 두 수는 포맷할 때 정해지고(예약 비율은 tune2fs -m으로 나중에 바꿀 수 있습니다) inode 비율은 나중에 바꿀 수 없다고 mke2fs 문서가 경고합니다.
          </p>
            <p>
            이 숫자에서 바로 나오는 사실이 하나 있습니다. 공간을 inode 수로 나누면 16KiB이므로 파일의 평균 크기가 16KiB보다 작으면 블록보다 inode가 먼저 바닥납니다.
            작은 세션 파일이나 캐시 파일을 수백만 개 만드는 서버가 9절의 사례입니다.
          </p>
          </div>
          <CalculationWalkthrough
            title="100GiB ext4의 두 장부"
            question="포맷 직후 블록·예약·inode는 각각 몇 개이고, 어떤 평균 파일 크기에서 inode가 먼저 바닥날까요?"
            scope="블록 4KiB, 예약 5%, inode 비율 16,384 byte를 가정합니다. 슈퍼블록·그룹 기술자·journal 같은 메타데이터 몫은 0으로 둡니다."
            steps={[
              { label: "전체 byte", expression: "100 × 1,073,741,824", result: "107,374,182,400 byte", reason: "1GiB는 2³⁰ byte입니다." },
              { label: "블록 칸", expression: "107,374,182,400 ÷ 4,096", result: "26,214,400칸", reason: "블록 하나가 4KiB입니다." },
              { label: "예약 블록", expression: "26,214,400 × 0.05", result: "1,310,720칸 = 5GiB", reason: "-m 5가 기본값이고 root·resuid만 씁니다." },
              { label: "inode 수", expression: "107,374,182,400 ÷ 16,384", result: "6,553,600개", reason: "-i는 공간 몇 byte마다 inode 하나를 만들지 정합니다." },
              { label: "손익분기 크기", expression: "107,374,182,400 ÷ 6,553,600", result: "16,384 byte = 16KiB", reason: "평균 파일이 이보다 작으면 inode가 먼저 바닥납니다." },
            ]}
            conclusion="같은 디스크에 독립된 장부가 둘 있고, 어느 장부가 먼저 바닥나는지는 파일의 평균 크기가 정합니다."
            caveats={["실제 df의 Size는 메타데이터 몫을 뺀 값이라 100G보다 작게 나옵니다.", "디스크 크기에 따라 mke2fs가 다른 usage type을 골라 inode 비율이 달라질 수 있으므로 tune2fs -l로 실제 값을 확인합니다."]}
          />
          <DiskAccountsViz />
        </section>

        <section id="deleted-open" data-teach-level="1" data-calculation-explained className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">4. 30GiB 로그를 지워도 df는 그대로 95GiB를 셉니다</h2>
          <div className={prose}>
            <p>
            사례 A로 돌아갑니다. 이름 있는 파일이 65GiB이고 java 프로세스가 쓰는 app.log가 30GiB까지 자라 모두 95GiB가 찼습니다. 남은 5GiB는 전부 예약
            블록이라 일반 사용자 몫은 0이고 그래서 애플리케이션이 ENOSPC를 받았습니다.
          </p>
            <p>당직자가 rm app.log를 실행하면 du는 곧바로 65GiB로 줄어듭니다. 디렉터리에서 이름이 사라졌기 때문입니다. 그런데 df는 여전히 Used 95G, Avail 0입니다. java가 그 파일을 fd 7로 열어 둔 채 쥐고 있어 블록 30GiB가 그대로 묶여 있습니다.</p>
            <p>
            df와 du의 차이 30GiB가 단서입니다. du는 이름을 따라 세고 df는 빈칸을 세므로 두 값의 차이는 이름 없이 블록을 쥔 무언가의 크기입니다. 이 차이를 만드는 대표
            원인이 열린 채 지워진 파일이고 다른 mount 아래에 가려진 파일도 같은 차이를 만듭니다(10절).
          </p>
          </div>
          <CalculationWalkthrough
            title="rm 전후의 df와 du"
            question="rm app.log 직후 df와 du는 각각 얼마를 보여 주고, 둘의 차이는 무엇을 뜻할까요?"
            scope="사례 A의 100GiB ext4입니다. 메타데이터 몫과 다른 mount는 없다고 둡니다."
            steps={[
              { label: "rm 전 이름 있는 파일", expression: "65 + 30(app.log)", result: "95GiB", reason: "du와 df Used가 같은 값을 보입니다." },
              { label: "rm 후 du", expression: "95 − 30", result: "65GiB", reason: "디렉터리에서 이름이 빠져 du가 더 이상 세지 않습니다." },
              { label: "rm 후 df Used", expression: "100 − f_bfree 5", result: "95GiB", reason: "fd 7이 열려 있어 블록이 빈칸으로 돌아오지 않았습니다." },
              { label: "차이", expression: "95 − 65", result: "30GiB", reason: "이름 없이 블록을 쥔 파일의 크기입니다." },
            ]}
            conclusion="rm은 이름을 지웠을 뿐 공간을 돌려주지 않았습니다. 공간은 fd가 닫힐 때 돌아옵니다."
          />
        </section>

        <section id="names" data-teach-level="2" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">5. 파일 이름은 inode 번호를 가리키는 링크입니다</h2>
          <div className={prose}>
            <p>
            디렉터리는 이름과 inode 번호를 짝지은 표입니다. /var/log에는 &quot;app.log → 1311&quot; 같은 줄이 있고 내용과 크기는 inode 1311이
            가리키는 블록에 있습니다. 이름과 inode를 잇는 이 한 줄을 링크(hard link)라고 부릅니다.
          </p>
            <p>ln app.log app.log.1을 실행하면 같은 번호 1311을 가리키는 줄이 하나 더 생깁니다. 블록은 복사되지 않고 inode의 링크 수(i_nlink)만 1에서 2가 됩니다. 이 상태에서 이름 하나를 지우면 링크 수는 1로 내려갈 뿐 블록은 움직이지 않습니다. symlink(7)는 hard link가 디렉터리를 가리킬 수 없고 다른 파일시스템을 넘을 수 없다고 적습니다.</p>
            <p>
            ln -s로 만드는 심볼릭 링크(symbolic link)는 다릅니다. 같은 문서에 따르면 심볼릭 링크는 다른 파일의 경로 문자열을 내용으로 담은 별도 파일입니다. 자기
            inode를 따로 가지므로 대상의 링크 수를 바꾸지 않고 대상이 지워지면 존재하지 않는 경로를 가리키는 끊긴 링크(dangling link)로 남습니다.
          </p>
            <p>제3자가 정리한 Google SRE 면접 준비 가이드가 예로 드는 inode 설명, hard link와 soft link 비교 질문은 결국 이 표를 그릴 수 있느냐를 묻습니다. 그림에서 이름 층, inode 층, 블록 층이 어떻게 따로 움직이는지 보십시오.</p>
          </div>
          <LinkCountViz />
        </section>

        <section id="free-rule" data-teach-level="3" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">6. 블록은 링크 수와 열린 참조가 모두 0일 때만 풀립니다</h2>
          <div className={prose}>
            <p>inode에는 카운터가 둘 있습니다. 하나는 앞 절의 링크 수로, 디스크에 저장되고 이름이 몇 개인지 셉니다. 다른 하나는 메모리에만 있는 참조 수(i_count)로, 지금 이 inode를 쥐고 있는 열린 파일과 커널 경로가 몇 개인지 셉니다. 프로세스가 파일을 열어 두면 이름을 다 지워도 참조 수가 남습니다.</p>
            <p>unlink(2) 문서는 이 규칙을 그대로 적습니다. 지운 이름이 마지막 링크이고 그 파일을 연 프로세스가 없으면 공간을 돌려줍니다. 마지막 링크였지만 열어 둔 프로세스가 있으면 그 파일을 가리키는 마지막 fd가 닫힐 때까지 파일이 남습니다. 이렇게 이름 없이 열린 파일을 이 글에서는 열린 채 지워진 파일(unlinked open file)이라고 부릅니다.</p>
          </div>
          <ExplainedFormula
            question="inode 1311의 블록은 언제 빈칸으로 돌아갑니까?"
            idea="이름이 남아 있으면 다시 찾을 수 있고, 열린 참조가 남아 있으면 지금 쓰는 중입니다. 둘 다 없을 때만 지워도 아무도 잃지 않습니다."
            formula={"\\text{free}(i) \\iff n_{\\text{link}}(i)=0 \\;\\land\\; n_{\\text{ref}}(i)=0"}
            annotatedFormula={"\\text{free}(i) \\iff \\underbrace{n_{\\text{link}}(i)=0}_{\\text{디렉터리 이름이 하나도 없음}} \\;\\land\\; \\underbrace{n_{\\text{ref}}(i)=0}_{\\text{열린 fd·커널 참조가 하나도 없음}}"}
            operations={[
              { expression: "n_{\\text{link}}(i)=0", annotation: ["ln으로 이름이 둘이면 rm 한 번 뒤에도 1입니다.", "ext4 unlink가 drop_nlink로 1씩 내립니다."] },
              { expression: "n_{\\text{ref}}(i)=0", annotation: ["java가 fd 7을 열어 둔 동안 1 이상입니다.", "iput이 0을 만든 순간 iput_final이 실행됩니다."] },
              { expression: "\\land", annotation: ["사례 A의 rm 직후는 링크 0, 참조 1이라 거짓입니다.", "fd를 닫으면 둘 다 0이 되어 참입니다."] },
            ]}
            terms={[
              { symbol: "i", name: "inode", description: "파일 하나의 메타데이터와 블록 위치를 담은 기록입니다. 사례의 번호는 1311입니다." },
              { symbol: "n_{\\text{link}}", name: "링크 수", description: "struct inode의 i_nlink입니다. 디스크에 저장되고 ls -l의 두 번째 열로 보입니다." },
              { symbol: "n_{\\text{ref}}", name: "참조 수", description: "메모리의 i_count를 단순화한 값입니다. 열린 파일은 dentry를 거쳐 inode 참조를 쥡니다." },
            ]}
            assumptions={["ext4처럼 링크 수 0인 inode를 evict 때 지우는 파일시스템을 가정합니다.", "참조 수에는 열린 fd 외에 mmap이나 실행 중인 파일처럼 다른 커널 경로도 들어갑니다."]}
            interpretation="rm은 첫 조건만 바꿉니다. 사례 A에서 공간을 되찾는 방법은 둘째 조건을 0으로 만드는 일, 곧 fd를 닫거나 프로세스를 다시 띄우는 일입니다. 그 전에 블록만 먼저 돌려받으려면 파일 크기를 0으로 잘라야 합니다(10절)."
          />
        </section>

        <section id="unlink-trace" data-teach-level="5" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">7. rm은 이름만 지우고, 블록은 마지막 iput이 돌려줍니다</h2>
          <div className={prose}>
            <p>
            Linux 6.12의 순서로 사례 A를 따라갑니다. rm은 unlinkat 시스템 콜을 부르고 fs/namei.c의 do_unlinkat이 경로를 찾은 뒤 inode에 참조
            하나를 잠깐 더 잡습니다(4529행). 이어 vfs_unlink가 파일시스템의 unlink를 부릅니다(4469행).
          </p>
            <p>ext4의 __ext4_unlink는 디렉터리에서 &quot;app.log → 1311&quot; 줄을 지우고 drop_nlink로 링크 수를 1에서 0으로 내립니다(3271–3287행). 링크 수가 0이 되면 ext4_orphan_add로 이 inode를 orphan 목록에 올립니다. 이름은 없지만 아직 지우지 못한 inode를 기록해 두는 목록입니다.</p>
            <p>
            다음은 d_delete입니다. 이 dentry를 쓰는 곳이 자기 하나뿐이면 inode를 바로 떼어 내고 그렇지 않으면 해시에서만 빼고 나중으로 미룹니다(dcache.c
            2403–2410행). java의 fd 7이 같은 dentry를 쥐고 있으므로 사례 A는 미루는 갈래로 갑니다. 이름으로는 더 이상 찾을 수 없지만 inode는 붙어 있습니다.
          </p>
            <p>
            do_unlinkat은 4540행에서 처음에 잡았던 참조를 iput으로 놓습니다. 주석은 &quot;여기서 잘라 낸다&quot;고 적지만 iput은 참조 수를 1 내린 결과가
            0일 때만 iput_final로 갑니다(inode.c 1895행). fd 7이 남아 있으니 0이 아니고 rm은 블록을 하나도 돌려주지 않은 채 끝납니다.
          </p>
          </div>
          {code("unlinkat", "do_unlinkat: 참조를 잡고, 지우고, 놓기")}
          {code("vfs-unlink", "vfs_unlink: 파일시스템 unlink와 d_delete_notify")}
          {code("ext4-unlink", "__ext4_unlink: 이름 삭제, drop_nlink, orphan 등록")}
          {code("d-delete", "d_delete: 사용자가 더 있으면 해시에서만 빼기")}
          <div className={prose}>
            <p>java가 fd 7을 닫는 순간을 봅니다. 마지막 fd가 닫히면 file_table.c의 __fput이 파일시스템의 release를 부르고 dput으로 dentry를 놓습니다(439행). 해시에서 빠진 dentry는 이때 사라지면서 dentry_unlink_inode가 iput을 부릅니다(dcache.c 409–412행).</p>
            <p>
            이번 iput은 참조 수를 0으로 만듭니다. iput_final은 ext4의 drop_inode인 ext4_drop_inode에 버릴지 묻고 이 함수가 부르는 generic_drop_inode는 링크 수가 0이면 참을 돌려줍니다(fs.h
            3097–3100행). 그러면 evict가 ext4의 evict_inode를 불러 블록 30GiB와 inode 번호 1311을 돌려주고 다음 df에서 Used가 65GiB로
            내려갑니다.
          </p>
            <p>반대로 이름이 남은 파일을 닫으면 generic_drop_inode가 거짓을 돌려줘 inode는 메모리 cache에만 남고 블록은 그대로입니다(inode.c 1851–1857행). 6절의 두 조건이 코드에서는 iput의 0 검사와 generic_drop_inode의 링크 수 검사라는 두 줄로 나뉘어 있습니다.</p>
          </div>
          {code("fput", "__fput: 마지막 fd가 닫힐 때")}
          {code("dentry-unlink-inode", "dentry_unlink_inode: dentry를 떼고 iput")}
          {code("iput", "iput: 참조 수가 0일 때만 다음 단계")}
          {code("iput-final", "iput_final: cache에 남길지 지울지")}
          {code("drop-inode", "generic_drop_inode: 링크 수 0이면 버림")}
          {code("evict", "evict: 파일시스템의 evict_inode 호출")}
          {code("nlink-field", "struct inode의 i_nlink 필드 규칙")}
          {code("drop-nlink", "drop_nlink: 링크 수 1 내리기")}
          {code("d-delete-notify", "d_delete_notify: d_delete를 감싼 함수")}
        </section>

        <section id="reserved" data-teach-level="5" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">8. 예약 5%는 일반 사용자에게만 먼저 바닥납니다</h2>
          <div className={prose}>
            <p>사례 A에서 df는 Used 95G에 Avail 0을 보였습니다. 95와 0을 더해도 100이 안 되는 이유가 예약 블록입니다. tune2fs 문서는 블록 일부를 특권 프로세스용으로 떼어 두는 목적을 두 가지로 적습니다. 단편화를 줄이는 것과, 일반 프로세스가 더 쓰지 못할 때도 syslogd 같은 시스템 데몬이 계속 동작하게 하는 것입니다.</p>
            <p>df는 statfs가 돌려준 두 빈칸을 다르게 씁니다. coreutils 9.5의 df.c는 Used를 전체에서 f_bfree(root 기준 빈칸)를 뺀 값으로, Avail을 f_bavail(일반 사용자 기준 빈칸)로 정합니다(961–974행). ext4_statfs는 f_bavail을 f_bfree에서 예약 블록을 뺀 값으로 채우고 음수면 0으로 막습니다(super.c 6815–6818행).</p>
          </div>
          <ExplainedFormula
            question="사례 A에서 일반 사용자가 쓸 수 있는 빈칸과 df의 Use%는 얼마입니까?"
            idea="빈칸에서 root 몫을 먼저 떼고 남은 것만 일반 사용자에게 보여 줍니다. Use%의 분모도 일반 사용자 기준 전체입니다."
            formula={"f_{\\text{bavail}}=\\max\\big(0,\\;f_{\\text{bfree}}-r\\big),\\qquad \\text{Use\\%}=\\left\\lceil\\frac{100\\cdot U}{U+f_{\\text{bavail}}}\\right\\rceil,\\quad U=f_{\\text{blocks}}-f_{\\text{bfree}}"}
            annotatedFormula={"\\begin{aligned}f_{\\text{bavail}}&=\\max\\big(0,\\;\\underbrace{f_{\\text{bfree}}}_{\\text{root 기준 빈칸}}-\\underbrace{r}_{\\text{예약 블록}}\\big)\\\\\\text{Use\\%}&=\\left\\lceil\\frac{100\\cdot\\overbrace{U}^{\\text{df Used}}}{\\underbrace{U+f_{\\text{bavail}}}_{\\text{일반 사용자 기준 전체}}}\\right\\rceil\\end{aligned}"}
            operations={[
              { expression: "f_{\\text{bfree}}-r", annotation: ["5GiB − 5GiB = 0입니다.", "fd를 닫은 뒤에는 35 − 5 = 30GiB입니다."] },
              { expression: "U=f_{\\text{blocks}}-f_{\\text{bfree}}", annotation: ["100 − 5 = 95GiB입니다.", "열린 채 지워진 30GiB도 여기에 들어갑니다."] },
              { expression: "\\frac{100\\cdot U}{U+f_{\\text{bavail}}}", annotation: ["9,500 ÷ 95 = 100%입니다.", "fd를 닫은 뒤에는 6,500 ÷ 95 = 68.4를 올림해 69%입니다."] },
            ]}
            terms={[
              { symbol: "f_{\\text{blocks}}", name: "전체 블록", description: "statfs의 f_blocks입니다. ext4는 메타데이터 몫을 뺀 값을 줍니다." },
              { symbol: "f_{\\text{bfree}}", name: "root 기준 빈칸", description: "예약 블록까지 포함한 빈칸입니다." },
              { symbol: "r", name: "예약 블록", description: "tune2fs -m 또는 -r로 정한 root 몫과 ext4 내부 예약의 합입니다." },
              { symbol: "f_{\\text{bavail}}", name: "일반 사용자 빈칸", description: "df의 Avail 열입니다." },
            ]}
            assumptions={["사례의 블록 수를 GiB 단위로 바꿔 계산했습니다.", "ext4 내부 예약(s_resv_clusters)은 0으로 두었습니다."]}
            interpretation="Use%가 100%여도 root 기준으로는 5GiB가 비어 있습니다. 그래서 root로 도는 로그 데몬은 계속 쓰고 일반 사용자로 도는 애플리케이션만 먼저 멈추는 일이 생깁니다."
          />
          <div className={prose}>
            <p>
            블록을 실제로 잡을 때도 같은 구분이 있습니다. ext4_has_free_clusters는 예약분을 빼고도 남으면 허락하고 남지 않으면 호출자가 resuid·resgid이거나
            CAP_SYS_RESOURCE를 가졌는지 봅니다(balloc.c 646–657행). 둘 다 아니면 0을 돌려주고 호출한 ext4_claim_free_clusters가 -ENOSPC를 돌려줍니다(671–675행).
          </p>
            <p>
            예약 비율은 tune2fs -m으로 바꿀 수 있지만 예약을 0으로 줄여 급한 불을 끄면 root 데몬이 쓸 여유도 함께 사라집니다. 예약 블록은 원인이 아니라 일반 사용자가
            먼저 막히는 이유이므로 무엇이 95GiB를 차지했는지 찾는 일이 먼저입니다.
          </p>
          </div>
          {code("df-fields", "df.c: Used와 Avail을 만드는 식")}
          {code("df-pcent", "df.c: Use%의 분모")}
          {code("ext4-statfs", "ext4_statfs: f_bavail에서 예약 빼기")}
          {code("root-reserve", "ext4_has_free_clusters: root만 예약분 사용")}
          <div id="paper-tune2fs" className="not-prose my-8 scroll-mt-24">
            <CitationBlock source="tune2fs(8) · mke2fs(8), man7.org (2026-10-15 확인)" citeKey={1} href="https://man7.org/linux/man-pages/man8/tune2fs.8.html">
              <q>to allow system daemons, such as syslogd(8), to continue to function correctly</q> 예약 블록의 목적입니다. mke2fs(8)는 같은 예약의 기본값을 5%로, -i bytes-per-inode 비율은 파일시스템을 만든 뒤 바꿀 수 없다고 적습니다.
            </CitationBlock>
          </div>
        </section>

        <section id="inode-exhaustion" data-teach-level="5" data-calculation-explained className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">9. inode가 바닥나면 블록이 43%여도 새 파일을 못 만듭니다</h2>
          <div className={prose}>
            <p>사례 B는 같은 100GiB 포맷의 다른 서버입니다. 웹 애플리케이션이 세션마다 4KiB 이하의 파일을 하나씩 남겨 650만 개가 쌓였습니다. df -h는 Used 40G, Use% 43%로 넉넉해 보이는데 새 세션 파일을 만들 때마다 ENOSPC가 납니다. 이때 df -i를 보면 IUse%가 100%입니다.</p>
            <p>
            새 파일에 inode 번호를 주는 일은 ext4의 __ext4_new_inode가 합니다. 빈 inode가 있는 블록 그룹을 고르지 못하면 -ENOSPC로 끝나고 그룹을 한
            바퀴 다 돌아도 빈 번호를 잡지 못해도 -ENOSPC입니다(ialloc.c 1021행, 1117행). 이 경로에는 블록 사용률을 보는 줄도 root를 봐주는 줄도 없습니다.
          </p>
            <p>
            기존 파일 끝에 덧붙이는 쓰기는 새 inode가 필요 없어 계속 성공합니다. 로그는 잘 쌓이는데 새 파일만 안 만들어지는 이상한 모습이 inode 고갈의 특징입니다. 조치는
            파일 수를 줄이는 것입니다. find로 파일이 가장 많은 디렉터리를 찾아 오래된 세션을 지우고 세션 저장소를 파일 대신 데이터베이스나 메모리 저장소로 옮깁니다.
          </p>
            <p>
            비율을 바꾸는 근본 조치는 재포맷입니다. mke2fs 문서대로 inode 비율은 만든 뒤 바꿀 수 없고 크기를 늘리면 같은 비율로 inode 수만 따라 늘어납니다. 작은 파일이
            많을 서버라면 처음 포맷할 때 -i를 낮추거나 -N으로 inode 수를 직접 줍니다.
          </p>
          </div>
          <CalculationWalkthrough
            title="사례 B의 두 장부"
            question="세션 파일 650만 개가 쌓인 서버에서 블록과 inode는 각각 몇 %를 썼을까요?"
            scope="세션 파일은 모두 4KiB 이하라 블록 한 칸씩 쓴다고 봅니다. 나머지 파일은 15.2GiB와 inode 53,600개로 둡니다."
            steps={[
              { label: "세션 파일 블록", expression: "6,500,000 × 4,096 byte", result: "26,624,000,000 byte ≈ 24.8GiB", reason: "작은 파일도 최소 한 블록을 차지합니다." },
              { label: "전체 블록 사용", expression: "24.8 + 15.2", result: "40GiB", reason: "df Used가 이 값입니다." },
              { label: "블록 Use%", expression: "⌈100 × 40 ÷ (40 + 55)⌉", result: "43%", reason: "Avail은 100 − 40 − 예약 5 = 55GiB입니다." },
              { label: "inode 사용", expression: "6,500,000 + 53,600", result: "6,553,600개 = 100%", reason: "파일 하나가 inode 하나를 씁니다." },
              { label: "평균 파일 크기", expression: "40GiB ÷ 6,553,600", result: "약 6.4KiB", reason: "3절의 손익분기 16KiB보다 작아 inode가 먼저 바닥났습니다." },
            ]}
            conclusion="평균 파일 크기가 16KiB보다 작은 동안은 블록이 남아도 inode가 먼저 끝납니다."
            caveats={["세션 파일 수와 나머지 파일 크기는 설명용 가정입니다.", "디렉터리도 inode와 블록을 하나씩 씁니다. 여기서는 나머지 53,600개에 포함했습니다."]}
          />
          {code("inode-enospc", "__ext4_new_inode: 빈 inode가 없으면 ENOSPC")}
        </section>

        <section id="diagnose" data-teach-level="4" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">10. df -h, df -i, du, lsof 순서로 계정을 하나씩 배제합니다</h2>
          <div className={prose}>
            <p>
            네 계정을 알았으니 진단은 순서 문제입니다. 가장 싸고 넓게 보는 명령부터 돌려 계정을 하나씩 지웁니다. df -h는 블록 장부, df -i는 inode 장부를 봅니다.
            Used와 Avail의 합을 Size와 비교하면 예약 몫이 보이고 du와 df의 차이는 이름 없는 블록을 드러냅니다.
          </p>
          </div>
          <AlgorithmBlock
            title="No space left on device 진단"
            input={["쓰기에 실패한 경로가 속한 mount 지점 $MNT"]}
            steps={[
              { code: "df -h $MNT 의 Avail > 0 이고 df -i 도 여유인데 쓰기가 실패하면 dmesg에서 EXT4-fs 오류를 찾는다", note: "Avail만 남았다면 다음 줄의 inode를 먼저 봅니다. 둘 다 남았다면 읽기 전용 전환일 수 있습니다(11절)." },
              { code: "df -i $MNT 의 IUse% == 100 이면 inode 계정이다", note: "파일이 가장 많은 디렉터리를 찾습니다." },
              { code: "Used + Avail < Size 이면 차이는 예약 블록이다", note: "root 데몬은 아직 씁니다. 원인 찾기는 계속합니다." },
              { code: "gap = df Used − du -xs $MNT", note: "-x로 다른 파일시스템을 건너뜁니다." },
              { code: "gap > 0 이면 lsof +aL1 $MNT 로 PID·FD를 찾는다", note: "링크 수가 1보다 작은 열린 파일만 나옵니다." },
              { code: "프로세스를 다시 띄우거나 /proc/PID/fd/FD 를 0 byte로 자른 뒤 df를 다시 본다" },
            ]}
            output="바닥난 계정과 공간을 돌려받을 조치"
          />
          <DiagnosisStepViz />
          <div className={prose}>
            <p>
            lsof 문서는 +L 뒤에 숫자를 주면 링크 수가 그보다 작은 파일만 보여 주고 &quot;+L1&quot;은 열린 채 지워진 파일을 고른다고 적습니다. +aL1처럼 -a를
            붙이면 특정 파일시스템으로 범위를 좁힙니다. 결과의 NLINK 열이 0이면 6절의 첫 조건이 이미 참이라는 뜻입니다.
          </p>
            <p>
            조치는 두 갈래입니다. 서비스를 다시 띄울 수 있으면 재시작이 가장 깨끗합니다. fd가 닫히면서 7절의 경로로 블록이 돌아옵니다. 재시작이 어렵다면 /proc/812/fd/7을
            열어 크기를 0으로 자릅니다. proc_pid_fd(5)대로 이 항목은 실제 파일을 가리키는 링크라서 이름이 없는 파일에도 이 경로로 닿을 수 있습니다.
          </p>
            <p>자르기에는 대가가 있습니다. 파일이 O_APPEND로 열려 있지 않다면 프로세스는 다음 쓰기를 원래 위치인 30GiB 지점에 합니다. (가정) 그러면 앞부분이 비어 있는 sparse 파일이 되어 실제 블록은 적지만 ls에 보이는 크기는 다시 30GiB가 됩니다. du와 du --apparent-size가 다른 값을 보이는 이유입니다.</p>
            <p>du와 df의 차이가 있는데 lsof +L1이 아무것도 내지 않는다면 mount 아래에 가려진 파일을 의심합니다. (가정) /var/log를 별도 디스크로 mount하기 전에 원래 디렉터리에 쌓인 파일은 mount에 가려 du가 보지 못하지만 루트 파일시스템의 블록은 차지합니다. 같은 파일시스템을 다른 경로에 bind mount해 그 아래를 직접 세어 봅니다.</p>
          </div>
          <div className={prose}>
            <p>
            사례 A가 생긴 근본 원인은 대개 로그 회전 설정입니다. logrotate의 create 방식은 로그 파일 이름을 바꾸고 같은 이름으로 새 파일을 만듭니다. 애플리케이션이
            postrotate의 신호를 받아 새 파일을 다시 열지 않으면 계속 옛 inode에 쓰고 보관 개수를 넘은 옛 파일이 지워지는 순간 열린 채 지워진 파일이 됩니다.
          </p>
            <p>copytruncate 방식은 복사본을 만든 뒤 원래 파일을 제자리에서 0으로 자릅니다. 애플리케이션이 같은 inode를 계속 써도 되므로 지운 파일이 블록을 붙잡는 문제는 생기지 않습니다. 다만 O_APPEND 없이 연 로그라면 앞 절과 같은 sparse 파일이 생깁니다.</p>
            <p>대신 logrotate 문서는 복사와 자르기 사이의 아주 짧은 틈에 쓴 로그가 사라질 수 있다고 경고합니다. 다시 열기를 지원하는 애플리케이션은 create와 신호를, 지원하지 않는 애플리케이션은 copytruncate를 고릅니다.</p>
          </div>
          <div id="paper-lsof" className="not-prose my-8 scroll-mt-24">
            <CitationBlock source="lsof(8) · unlink(2) · logrotate(8), man7.org (2026-10-15 확인)" citeKey={2} href="https://man7.org/linux/man-pages/man8/lsof.8.html">
              <q>will select open files that have been unlinked</q> lsof의 +L1 설명입니다. unlink(2)는 마지막 링크를 지워도 열린 fd가 있으면 마지막 fd가 닫힐 때까지 파일이 남는다고 적고, logrotate(8)는 copytruncate의 복사와 자르기 사이에 로그 일부가 사라질 수 있다고 적습니다.
            </CitationBlock>
          </div>
        </section>

        <section id="read-only-latency" data-teach-level="6" data-calculation-explained className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">11. 공간이 남아도 쓰기가 멈추는 경우는 읽기 전용 전환과 I/O 대기입니다</h2>
          <div className={prose}>
            <p>df -h와 df -i가 모두 여유를 보이는데 쓰기가 실패한다면 네 계정 밖의 문제입니다. quota도 같은 증상을 내지만 이 글에서는 다루지 않습니다. 첫째 후보는 파일시스템 오류입니다. ext4는 메타데이터 오류를 발견하면 mount 옵션 errors=에 따라 계속 쓰거나, 읽기 전용으로 바꾸거나, 기계를 멈춥니다. 커널 ext4 문서는 errors=remount-ro를 &quot;오류가 나면 읽기 전용으로 다시 mount&quot;로 적습니다.</p>
            <p>
            Linux 6.12의 ext4_handle_error는 errors=continue가 아니면 shutdown 플래그를 세우고 journal을 중단한 뒤, dmesg에
            &quot;Remounting filesystem read-only&quot;를 남깁니다(super.c 703–736행). 주석은 SB_RDONLY 대신 이 플래그로 모든
            수정을 막는다고 설명합니다. 그래서 진단의 첫 줄이 dmesg입니다. 이 상태는 공간을 비워도 풀리지 않고 디스크를 점검하고 fsck로 고친 뒤 다시 mount해야 합니다.
          </p>
          </div>
          {code("remount-ro", "ext4_handle_error: errors=에 따른 세 갈래")}
          <div className={prose}>
            <p>둘째 후보는 공간이 아니라 속도입니다. 디스크가 느려지면 쓰기는 실패하지 않고 오래 기다립니다. ps(1)는 이런 프로세스의 상태를 D, &quot;uninterruptible sleep (usually I/O)&quot;로 표시합니다. Linux의 load average는 실행 대기 프로세스와 함께 이 D 상태도 세므로, CPU가 한가한데 load가 높다면 디스크를 먼저 봅니다. load average가 D 상태를 세게 된 내력과 커널 계산은 <Link to="/cs/cloud/linux-server-interview-incident-map#source">Linux 서버 면접·장애 지도</Link>에서 다룹니다.</p>
            <p>
            iostat -xz 1이 디스크 쪽 숫자를 줍니다. w_await는 쓰기 요청 하나가 대기열과 처리에 쓴 평균 ms이고 aqu-sz는 장치에 걸려 있던 요청의 평균 개수입니다.
            두 값은 초당 요청 수를 사이에 두고 이어집니다. (가정) 쓰기 2,000 w/s가 각각 15ms를 기다리면 평균 30개가 대기열에 있는 셈입니다.
          </p>
          </div>
          <CalculationWalkthrough
            title="iostat 한 줄 읽기"
            question="w/s 2,000, w_await 15ms인 장치의 대기열 길이는 얼마이고, %util 100%는 포화를 뜻할까요?"
            scope="쓰기만 있는 장치를 가정합니다. aqu-sz와 await의 관계는 대기열 길이 = 도착률 × 머문 시간이라는 Little의 법칙으로 근사한 것입니다."
            steps={[
              { label: "머문 시간", expression: "15 ms = 0.015 s", result: "0.015 s", reason: "w_await는 대기열 시간과 처리 시간을 합친 값입니다." },
              { label: "대기열 길이", expression: "2,000 /s × 0.015 s", result: "약 30개", reason: "iostat의 aqu-sz와 비슷하게 나와야 합니다." },
              { label: "%util 100%", expression: "직렬 장치 · 병렬 장치", result: "HDD는 포화 · NVMe는 판단 불가", reason: "iostat 문서대로 병렬로 처리하는 장치에서는 한계를 반영하지 않습니다." },
            ]}
            conclusion="NVMe에서는 %util보다 await와 aqu-sz가 평소보다 얼마나 커졌는지를 봅니다."
            caveats={["숫자는 설명용 가정입니다.", "%iowait는 CPU가 놀고 있으면서 디스크 요청이 걸려 있던 시간 비율이라 CPU가 바쁘면 디스크가 느려도 낮게 나옵니다."]}
          />
          <div className={prose}>
            <p>
            %iowait도 자주 오해됩니다. iostat 문서는 이 값을 CPU가 놀고 있는 동안 처리되지 않은 디스크 요청이 있던 시간의 비율로 정의합니다. 디스크가 얼마나 바쁜지가
            아니라 CPU가 한가했던 시간 중 일부이므로 다른 일로 CPU가 바쁘면 디스크가 느려도 iowait는 낮게 나옵니다. 디스크 판단은 장치별 await와 aqu-sz로 합니다.
          </p>
          </div>
          <div id="paper-iostat" className="not-prose my-8 scroll-mt-24">
            <CitationBlock source="iostat(1) · ps(1), man7.org; Linux kernel docs · ext4 (2026-10-15 확인)" citeKey={3} href="https://man7.org/linux/man-pages/man1/iostat.1.html">
              <q>this number does not reflect their performance limits</q> RAID와 최신 SSD처럼 요청을 병렬로 처리하는 장치에 대한 %util 설명입니다. 같은 문서는 r_await·w_await가 대기열과 처리 시간을 포함한다고 적고, ps(1)는 D를 I/O 대기의 uninterruptible sleep으로, 커널 ext4 문서는 errors=remount-ro를 오류 시 읽기 전용 재mount로 정의합니다.
            </CitationBlock>
          </div>
        </section>

        <section id="boundary" data-teach-level="7" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">12. 이 진단은 ext4 한 mount의 회계까지만 말해 줍니다</h2>
          <div className={prose}>
            <p>
            이 글의 코드는 ext4입니다. 링크 수와 참조 수로 블록을 돌려주는 6절의 규칙은 VFS 공통이라 다른 파일시스템에도 적용되지만 예약 블록과 고정 inode 비율은 ext4
            포맷 옵션입니다. 다른 파일시스템은 inode를 만드는 방식이 달라 df -i의 의미도 다르므로 그 파일시스템의 문서로 다시 확인합니다.
          </p>
            <p>quota도 같은 ENOSPC 계열 증상을 냅니다. 사용자나 프로젝트 quota가 걸려 있으면 파일시스템 전체에는 여유가 있어도 그 주체만 막힙니다. ext4_statfs도 프로젝트 quota가 켜진 디렉터리에서는 quota 한도를 전체 크기로 바꿔 돌려줍니다(super.c 6825–6827행, 6772–6779행). 컨테이너의 쓰기 계층이나 Kubernetes의 임시 저장소 한도는 그 위에 또 다른 회계를 얹습니다.</p>
            <p>
            마지막으로 공간을 되찾는 일과 재발을 막는 일은 다릅니다. 열린 채 지워진 파일을 찾아 자르는 것은 응급조치이고 로그 회전 방식과 애플리케이션의 다시 열기, 파일 수가 많은
            저장 구조를 고쳐야 같은 새벽이 다시 오지 않습니다. 프로세스와 fd 수 한도 자체는 이 시리즈의 프로세스 글에서 이어 봅니다.
          </p>
          </div>
          <ContentBoundary article="linux-disk-full-inode-deleted-files" />
        </section>

        <section id="review-questions" data-teach-level="review" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">13. 같은 사례로 다음 경계를 예상해 보세요</h2>
          <div className={prose}>
            <p>사례 A에서 rm 전에 ln app.log /var/log/keep.log를 해 두었다면 rm app.log 뒤 df, du, lsof +L1은 각각 무엇을 보여 줄까요? (답: 5절, 6절)</p>
            <p>
            사례 A의 디스크를 tune2fs -m 1로 바꾸면 Avail과 Use%는 어떻게 바뀌고 그것이 문제를 해결한 것인지 설명해 보세요. (답: 8절)
          </p>
            <p>같은 100GiB를 -i 4096으로 포맷했다면 사례 B의 세션 파일 650만 개는 inode를 몇 % 쓸까요? 대신 무엇을 잃을까요? (답: 3절, 9절)</p>
          </div>
        </section>
      </div>
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={diskFullTrees}
        projectMetas={{
          linux: { id: "linux", label: "Linux v6.12 원문", badgeClass: "bg-blue-500/10 border-blue-500 text-blue-700" },
          coreutils: { id: "coreutils", label: "coreutils v9.5 원문", badgeClass: "bg-blue-500/10 border-blue-500 text-blue-700" },
        }}
      />
    </>
  );
}
