import assert from 'node:assert/strict';
const raw='Ae\u0301가😀', nfc=raw.normalize('NFC'), nfd=raw.normalize('NFD');
const segmenter=new Intl.Segmenter('und',{granularity:'grapheme'});
function observe(s){
 return {text:s,cp:[...s].map(x=>x.codePointAt(0).toString(16)),utf16:s.length,bytes:Buffer.byteLength(s,'utf8'),
 hex:Buffer.from(s).toString('hex'),clusters:[...segmenter.segment(s)].map(x=>({text:x.segment,indexUTF16:x.index})),
 units:Array.from({length:s.length},(_,i)=>s.charCodeAt(i).toString(16))};
}
const cases=Object.fromEntries([['raw',raw],['NFC',nfc],['NFD',nfd],['family','👨‍👩‍👧‍👦']].map(([k,s])=>[k,observe(s)]));
assert.deepEqual([cases.raw.cp.length,cases.raw.utf16,cases.raw.bytes,cases.raw.clusters.length],[5,6,11,4]);
assert.deepEqual([cases.NFC.cp.length,cases.NFC.utf16,cases.NFC.bytes,cases.NFC.clusters.length],[4,5,10,4]);
assert.deepEqual([cases.NFD.cp.length,cases.NFD.utf16,cases.NFD.bytes,cases.NFD.clusters.length],[6,7,14,4]);
const reorder='q\u0307\u0323';
const invalid=[Buffer.from([0xc0,0x80]),Buffer.from([0xed,0xa0,0x80]),Buffer.from([0xf4,0x90,0x80,0x80])].map(b=>{
 let fatal;try{new TextDecoder('utf-8',{fatal:true}).decode(b);fatal=false;}catch{fatal=true;}
 return{hex:b.toString('hex'),fatalRejected:fatal,replacement:new TextDecoder('utf-8').decode(b)};
});
console.log(JSON.stringify({runtime:{node:process.version,v8:process.versions.v8,icu:process.versions.icu,unicode:process.versions.unicode},cases,
 slices:{rawGa:raw.slice(3,4),nfcGa:nfc.slice(2,3),rawEmoji:raw.slice(4,6),brokenEmoji:raw.slice(4,5),brokenEncoded:Buffer.from(raw.slice(4,5)).toString('hex')},
 normalizePieces:{joined:'e'.normalize('NFC')+'\u0301'.normalize('NFC'),whole:'e\u0301'.normalize('NFC')},
 reorder:{before:[...reorder].map(x=>x.codePointAt(0)),after:[...reorder.normalize('NFD')].map(x=>x.codePointAt(0))},invalid},null,2));
