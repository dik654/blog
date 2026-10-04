# -*- coding: utf-8 -*-
from pathlib import Path
import subprocess, json, hashlib
p=Path(__file__).parent;orig=p.parent/'codebase/word2vec.c';s=orig.read_text()
a=s.index('        if (negative > 0) for (d = 0; d < negative + 1; d++) {',s.index('    } else {  //train skip-gram'))
z=s.index('\n      }\n    }\n    sentence_position++;',a)
block=s[a:z]
u=s.index('        if (sample > 0) {',s.index('    if (sentence_length == 0)'))
v=s.index('\n        if (sentence_length >= MAX_SENTENCE_LENGTH)',u)
sub=s[u:v]
head=r'''#define main upstream_word2vec_main
#include "../codebase/word2vec.c"
#undef main
static void reset_weights(void) {
 real w[]={0,0,0,1,0,0,1,2,0,0,1,1,0,0,1};
 real out[]={0,0,0,1,0,1,2,0,1,0,1,2,1,1,0};
 memcpy(syn0,w,sizeof(w));memcpy(syn1neg,out,sizeof(out));
}
static void original_pair(unsigned long long seed, int draws) {
 long long word=2,l1=9,l2,target,label,d,c;
 unsigned long long next_random=seed;
 real f,g,neu1e[3]={0,0,0};
 negative=draws;
'''
mid=r'''
 printf("PAIR seed=%llu draws=%d state=%llu\n",seed,draws,next_random);
 printf("INPUT %.9g %.9g %.9g\n",syn0[9],syn0[10],syn0[11]);
 for(int i=0;i<5;i++)printf("OUTPUT %d %.9g %.9g %.9g\n",i,syn1neg[3*i],syn1neg[3*i+1],syn1neg[3*i+2]);
}
static void original_subsample(void) {
 long long word,sentence_length=0,sen[5]={0},input[]={1,3,2,3,4};
 unsigned long long next_random=0;
 sample=.008;train_words=20;
 for(int i=0;i<5;i++) {
  word=input[i];
'''
foot=r'''
 }
 printf("FILTER");for(int i=0;i<sentence_length;i++)printf(" %lld",sen[i]);printf(" state=%llu\n",next_random);
}
int main(void) {
 vocab_size=5;vocab=calloc(vocab_size,sizeof(struct vocab_word));
 long long counts[]={1,1,1,16,1};for(int i=0;i<5;i++)vocab[i].cn=counts[i];
 InitUnigramTable();long long histogram[5]={0};for(int i=0;i<table_size;i++)histogram[table[i]]++;
 printf("UNIGRAM");for(int i=0;i<5;i++)printf(" %lld",histogram[i]);printf("\n");
 layer1_size=3;alpha=.1;syn0=malloc(15*sizeof(real));syn1neg=malloc(15*sizeof(real));
 expTable=malloc((EXP_TABLE_SIZE+1)*sizeof(real));
 for(int i=0;i<EXP_TABLE_SIZE;i++){
  expTable[i]=exp((i/(real)EXP_TABLE_SIZE*2-1)*MAX_EXP);
  expTable[i]=expTable[i]/(expTable[i]+1);
 }
 printf("SIGMOID1 %.9g\n",expTable[581]);
 for(int run=0;run<2;run++){
  unsigned long long seed=run?0:43,state=seed;int draws=run?6:2;
  for(int d=0;d<draws;d++){
   state=state*25214903917ULL+11;long long index=(state>>16)%table_size;
   int raw=table[index],target=raw?raw:state%(vocab_size-1)+1;
   printf("DRAW seed=%llu d=%d state=%llu index=%lld raw=%d target=%d skipped=%d\n",seed,d+1,state,index,raw,target,target==2);
  }
  reset_weights();original_pair(seed,draws);
 }
 original_subsample();
 free(table);free(vocab);free(syn0);free(syn1neg);free(expTable);return 0;
}
'''
f=p/'observe_sgns.c';f.write_text(head+block+mid+sub+foot)
cmd=['cc','-std=c11','-D_DARWIN_C_SOURCE','-Dfgetc_unlocked=getc_unlocked','-O1','-pthread',str(f),'-lm','-o',str(p/'observe_sgns')]
c=subprocess.run(cmd,capture_output=True,text=True);(p/'compile.log').write_text(c.stdout+c.stderr);c.check_returncode()
r=subprocess.run([str(p/'observe_sgns')],capture_output=True,text=True);(p/'run.log').write_text(r.stdout+r.stderr);r.check_returncode();print(r.stdout)
report={'pin':'20c129af10659f7c50e86e3be406df663beff438','sourceSha256':hashlib.sha256(orig.read_bytes()).hexdigest(),'blocks':[{'label':name,'firstLine':s[:start].count('\n')+1,'lastLine':s[:end].count('\n')+1,'sha256':hashlib.sha256(s[start:end].encode()).hexdigest()}for name,start,end in [('SG negative loop plus input update',a,z),('subsampling plus append',u,v)]],'scope':'Original full InitUnigramTable is called. Two original blocks are extracted byte unchanged into authored one-pair and five-ID callers. The draw-report loop is an authored observation replica, not an added line inside the original block. No full TrainModelThread/corpus training/GPU/quality or runtime benchmark. Manual tables and seed43/0 are specified assumptions. Original sigmoid initialization expression retained. The table has100000000 entries; output histogram only is saved.','compiler':cmd}
(p/'source-scope.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
