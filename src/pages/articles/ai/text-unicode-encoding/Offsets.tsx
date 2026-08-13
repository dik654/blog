export default function Offsets() {
  return (
    <section id="offsets" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Offset에는 어느 text와 어느 단위의 좌표인지가 함께 있어야 한다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Named-entity label이 <code>[start,end)</code> 숫자만 저장하면 tokenizer 앞의 normalization에서 위치가 바뀌었을 때 원문 span으로 돌아갈 수 없습니다. Offset은 원문인지 normalized text인지, UTF-8 byte인지 code point인지 grapheme인지, 끝 위치를 포함하는지까지 함께 기록해야 합니다.
        </p>
        <p>
          여기서 half-open span <code>[start,end)</code>은 start 위치는 포함하고 end 위치는 포함하지 않는다는 뜻입니다. 길이를 <code>end-start</code>로 바로 계산하고 맞닿은 두 span을 겹치지 않게 표현할 수 있지만, 단위와 기준 text가 빠지면 같은 숫자도 여전히 다른 위치를 뜻합니다.
        </p>
        <p>
          원문 <code>Ae◌́가</code>를 예로 들어 보겠습니다. 여기서 <code>◌́</code>는 combining acute accent <code>U+0301</code>을 눈에 보이게 적은 표기이고, 실제 sequence는 <code>A</code>+<code>e</code>+<code>U+0301</code>+<code>가</code>입니다. 원문의 <code>e</code>+accent는 code-point span <code>[1,3)</code>, UTF-8 byte span <code>[1,4)</code>, grapheme span <code>[1,2)</code>입니다. NFC를 적용한 <code>Aé가</code>에서는 이 두 code point가 <code>U+00E9</code> 하나로 합쳐지므로 normalized code-point span은 <code>[1,2)</code>, byte span은 <code>[1,3)</code>이 됩니다.
        </p>
        <p>
          Alignment record는 raw byte의 source hash(원문을 식별하는 fingerprint), normalization form과 normalizer·Unicode version, source와 normalized 양쪽의 unit·half-open span을 함께 저장해야 합니다. 위 예에서는 source code point <code>[1,3)</code>이 normalized <code>[1,2)</code>로 가는 many-to-one mapping입니다. Normalized <code>é</code>만 보고는 원문이 합성형이었는지 분해형이었는지 알 수 없으므로, 역방향 위치는 새로 추측하지 말고 보존한 alignment에서 원문 범위를 찾아야 합니다.
        </p>
        <p>
          안전한 pipeline은 무엇을 보존할지 세 가지 oracle(정답 판정 기준)로 나눠, 기대값을 고정한 golden test로 검사합니다. <strong>Lossless byte round-trip</strong>은 normalization 없이 well-formed raw byte에 대해 <code>encode(decode(raw_bytes))</code>가 원본 byte와 완전히 같은지 확인합니다. Malformed UTF-8을 reject할지 replacement character로 바꿀지 정책을 고정해야 하며, replacement를 선택하면 원래 byte의 lossless 복원을 주장할 수 없습니다. <strong>Normalized-text round-trip</strong>은 선택한 form <code>N</code>에 대해 <code>decode(encode(N(source)))</code>가 <code>N(source)</code>와 같고 <code>N(N(source))=N(source)</code>인지 검사하지만 raw byte나 compatibility 차이의 보존까지 뜻하지 않습니다. <strong>Grapheme-preserving round-trip</strong>은 고정한 Unicode segmentation version에서 다시 decode한 text의 grapheme sequence와 boundary가 기대값과 같은지 검사하며, code point와 byte가 동일하다는 보장은 아닙니다.
        </p>
      </div>
    </section>
  );
}
