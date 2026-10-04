#define main upstream_word2vec_main
#include "../codebase/word2vec.c"
#undef main
void one_original_cbow(void){
 long long a,b=1,d,c,cw,word=2,last_word,l1,l2,target,label;
 long long sentence_position=2,sentence_length=5,sen[]={1,3,2,3,4};
 unsigned long long next_random=0;
 real f,g,neu1[3]={0,0,0},neu1e[3]={0,0,0};
    if (cbow) {  //train the cbow architecture
      // in -> hidden
      cw = 0;
      for (a = b; a < window * 2 + 1 - b; a++) if (a != window) {
        c = sentence_position - window + a;
        if (c < 0) continue;
        if (c >= sentence_length) continue;
        last_word = sen[c];
        if (last_word == -1) continue;
        for (c = 0; c < layer1_size; c++) neu1[c] += syn0[c + last_word * layer1_size];
        cw++;
      }
      if (cw) {
        for (c = 0; c < layer1_size; c++) neu1[c] /= cw;
        if (hs) for (d = 0; d < vocab[word].codelen; d++) {
          f = 0;
          l2 = vocab[word].point[d] * layer1_size;
          // Propagate hidden -> output
          for (c = 0; c < layer1_size; c++) f += neu1[c] * syn1[c + l2];
          if (f <= -MAX_EXP) continue;
          else if (f >= MAX_EXP) continue;
          else f = expTable[(int)((f + MAX_EXP) * (EXP_TABLE_SIZE / MAX_EXP / 2))];
          // 'g' is the gradient multiplied by the learning rate
          g = (1 - vocab[word].code[d] - f) * alpha;
          // Propagate errors output -> hidden
          for (c = 0; c < layer1_size; c++) neu1e[c] += g * syn1[c + l2];
          // Learn weights hidden -> output
          for (c = 0; c < layer1_size; c++) syn1[c + l2] += g * neu1[c];
        }
        // NEGATIVE SAMPLING
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
          for (c = 0; c < layer1_size; c++) f += neu1[c] * syn1neg[c + l2];
          if (f > MAX_EXP) g = (label - 1) * alpha;
          else if (f < -MAX_EXP) g = (label - 0) * alpha;
          else g = (label - expTable[(int)((f + MAX_EXP) * (EXP_TABLE_SIZE / MAX_EXP / 2))]) * alpha;
          for (c = 0; c < layer1_size; c++) neu1e[c] += g * syn1neg[c + l2];
          for (c = 0; c < layer1_size; c++) syn1neg[c + l2] += g * neu1[c];
        }
        // hidden -> in
        for (a = b; a < window * 2 + 1 - b; a++) if (a != window) {
          c = sentence_position - window + a;
          if (c < 0) continue;
          if (c >= sentence_length) continue;
          last_word = sen[c];
          if (last_word == -1) continue;
          for (c = 0; c < layer1_size; c++) syn0[c + last_word * layer1_size] += neu1e[c];
        }
      }
    }
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
