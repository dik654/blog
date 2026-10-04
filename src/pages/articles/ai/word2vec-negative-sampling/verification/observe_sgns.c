#define main upstream_word2vec_main
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
        if (negative > 0) for (d = 0; d < negative + 1; d++) {
          if (d == 0) {
            target = word;
            label = 1;
          } else {
            next_random = next_random * (unsigned long long)25214903917 + 11;
            target = table[(next_random >> 16) % table_size];
            if (target == 0) target = next_random % (vocab_size - 1) + 1;
            if (target == word) continue;
            label = 0;
          }
          l2 = target * layer1_size;
          f = 0;
          for (c = 0; c < layer1_size; c++) f += syn0[c + l1] * syn1neg[c + l2];
          if (f > MAX_EXP) g = (label - 1) * alpha;
          else if (f < -MAX_EXP) g = (label - 0) * alpha;
          else g = (label - expTable[(int)((f + MAX_EXP) * (EXP_TABLE_SIZE / MAX_EXP / 2))]) * alpha;
          for (c = 0; c < layer1_size; c++) neu1e[c] += g * syn1neg[c + l2];
          for (c = 0; c < layer1_size; c++) syn1neg[c + l2] += g * syn0[c + l1];
        }
        // Learn weights input -> hidden
        for (c = 0; c < layer1_size; c++) syn0[c + l1] += neu1e[c];
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
        if (sample > 0) {
          real ran = (sqrt(vocab[word].cn / (sample * train_words)) + 1) * (sample * train_words) / vocab[word].cn;
          next_random = next_random * (unsigned long long)25214903917 + 11;
          if (ran < (next_random & 0xFFFF) / (real)65536) continue;
        }
        sen[sentence_length] = word;
        sentence_length++;
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
