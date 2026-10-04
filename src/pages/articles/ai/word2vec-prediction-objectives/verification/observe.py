# -*- coding: utf-8 -*-
from pathlib import Path
import subprocess,json,hashlib
p=Path(__file__).parent;original=p.parent/'codebase/word2vec.c';src=original.read_text();a=src.index('    if (cbow) {  //train the cbow architecture');z=src.index('    } else {  //train skip-gram',a)+5;block=src[a:z];assert block.endswith('}')
header=r'''#define main upstream_word2vec_main
#include "../codebase/word2vec.c"
#undef main
void one_original_cbow(void){
 long long a,b=1,d,c,cw,word=2,last_word,l1,l2,target,label;
 long long sentence_position=2,sentence_length=5,sen[]={1,3,2,3,4};
 unsigned long long next_random=0;
 real f,g,neu1[3]={0,0,0},neu1e[3]={0,0,0};
'''
footer=r'''
 printf("H %.9g %.9g %.9g\n",neu1[0],neu1[1],neu1[2]);
 printf("NEU1E %.9g %.9g %.9g\n",neu1e[0],neu1e[1],neu1e[2]);
 printf("W3_AFTER %.9g %.9g %.9g\n",syn0[9],syn0[10],syn0[11]);
 for(int k=0;k<4;k++)printf("NODE_AFTER %d %.9g %.9g %.9g\n",k,syn1[k*3],syn1[k*3+1],syn1[k*3+2]);
}
void tree(long long *freq){
 vocab_size=5;vocab=calloc(5,sizeof(struct vocab_word));
 for(int k=0;k<5;k++){vocab[k].cn=freq[k];vocab[k].code=calloc(MAX_CODE_LENGTH,sizeof(char));vocab[k].point=calloc(MAX_CODE_LENGTH,sizeof(int));}
 CreateBinaryTree();long long total=0;
 for(int k=0;k<5;k++){printf("TREE %d freq=%lld depth=%d code=",k,freq[k],vocab[k].codelen);total+=freq[k]*vocab[k].codelen;for(int j=0;j<vocab[k].codelen;j++)printf("%d",vocab[k].code[j]);printf(" nodes=");for(int j=0;j<vocab[k].codelen;j++)printf("%d,",vocab[k].point[j]);printf("\n");}
 printf("WEIGHTED %lld\n",total);
}
void free_tree(void){for(int k=0;k<5;k++){free(vocab[k].code);free(vocab[k].point);}free(vocab);}
int main(void){
 long long sorted[]={8,4,2,1,1};tree(sorted);
 layer1_size=3;window=2;hs=1;negative=0;cbow=1;alpha=.1;
 real w[]={0,0,0,1,0,0,1,2,0,0,1,1,0,0,1};
 real u[]={1,0,0,0,1,0,0,0,1,1,0,0,0,0,0};
 syn0=w;syn1=u;expTable=malloc((EXP_TABLE_SIZE+1)*sizeof(real));
 for(int i=0;i<EXP_TABLE_SIZE;i++){
  expTable[i]=exp((i/(real)EXP_TABLE_SIZE*2-1)*MAX_EXP);
  expTable[i]=expTable[i]/(expTable[i]+1);
 }
 printf("SIGMOID_TABLE f0 index=%d value=%.9g f1 index=%d value=%.9g\n",(0+MAX_EXP)*(EXP_TABLE_SIZE/MAX_EXP/2),expTable[498],(1+MAX_EXP)*(EXP_TABLE_SIZE/MAX_EXP/2),expTable[581]);
 one_original_cbow();free(expTable);free_tree();
 long long reserved_unsorted[]={1,8,4,2,1};tree(reserved_unsorted);free_tree();return 0;
}
'''
(p/'observe_objectives.c').write_text(header+block+footer)
r=subprocess.run(['cc','-std=c11','-D_DARWIN_C_SOURCE','-Dfgetc_unlocked=getc_unlocked','-O0','-pthread',str(p/'observe_objectives.c'),'-lm','-o',str(p/'observe_objectives')],capture_output=True,text=True);(p/'compile.log').write_text(r.stdout+r.stderr);r.check_returncode()
r=subprocess.run([str(p/'observe_objectives')],capture_output=True,text=True);r.check_returncode();(p/'run.log').write_text(r.stdout+r.stderr);print(r.stdout)
(p/'source-scope.json').write_text(json.dumps({'originalSha':hashlib.sha256(original.read_bytes()).hexdigest(),'blockFirstLine':src[:a].count('\n')+1,'blockLastLine':src[:z].count('\n')+1,'blockSha256':hashlib.sha256(block.encode()).hexdigest(),'scope':'Original CreateBinaryTree directly called; original CBOW if statement lines435–495 copied exactly into a single-center caller with original globals; not full TrainModelThread, corpus training, or performance benchmark. h, bits, source table lookup and input update are executed native CPU.'},indent=2))
