#include "../codebase/src/fasttext.h"
#include "../codebase/src/dictionary.h"
#include "../codebase/src/densematrix.h"
#include "../codebase/src/vector.h"
#include "../codebase/src/model.h"
#include "../codebase/src/loss.h"
#include <fstream>
#include <sstream>
#include <iostream>
#include <iomanip>
using namespace fasttext;
int main(){
 auto a=std::make_shared<Args>();a->dim=2;a->minn=3;a->maxn=3;a->bucket=8;a->minCount=1;a->verbose=0;a->model=model_name::sg;a->loss=loss_name::softmax;
 auto d=std::make_shared<Dictionary>(a);std::istringstream corpus("run run run cat\n");d->readFromFile(corpus);
 auto wi=std::make_shared<DenseMatrix>(d->nwords()+a->bucket,2),wo=std::make_shared<DenseMatrix>(d->nwords(),2);wi->zero();wo->zero();
 wi->at(d->getId("run"),0)=8;
 for(int b=0;b<8;b++){wi->at(d->nwords()+b,0)=b;wi->at(d->nwords()+b,1)=1;}
 const char* path="fixture.bin";
 {std::ofstream out(path,std::ios::binary);int32_t magic=793712314,version=12;bool q=false;out.write((char*)&magic,4);out.write((char*)&version,4);a->save(out);d->save(out);out.write((char*)&q,sizeof q);wi->save(out);out.write((char*)&q,sizeof q);wo->save(out);}
 FastText f;f.loadModel(path);std::cout<<std::setprecision(9)<<"WORDS "<<d->nwords()<<"\n";
 for(int i=0;i<d->nwords();i++)std::cout<<"WORD "<<i<<" "<<d->getWord(i)<<"\n";
 for(std::string word:{"run","runs","aaaa",u8"é",u8"e\u0301",""}){
  std::vector<int32_t> ids;std::vector<std::string> strings;d->getSubwords(word,ids,strings);
  std::cout<<"QUERY "<<std::quoted(word)<<" ID "<<f.getWordId(word)<<"\n";
  for(size_t i=0;i<ids.size();i++)std::cout<<"PART "<<std::quoted(strings[i])<<" HASH "<<d->hash(strings[i])<<" ROW "<<ids[i]<<"\n";
  Vector v(2);f.getWordVector(v,word);std::cout<<"VECTOR "<<v[0]<<" "<<v[1]<<"\n";
 }
 // A separate one-step observation of unchanged Model::update, with a softmax
 // output chosen only to make the input-row update coefficient easy to inspect.
 wo->at(0,0)=1;f.setMatrices(wi,wo);
 std::shared_ptr<Matrix> outMatrix=wo;
 auto loss=std::make_shared<SoftmaxLoss>(outMatrix);
 Model m(wi,wo,loss,false);Model::State s(2,d->nwords(),0);
 auto rows=d->getSubwords("run");auto before=wi->at(d->nwords()+2,0);
 m.update(rows,std::vector<int32_t>{0},0,0.1,s);
 std::cout<<"UPDATE hidden "<<s.hidden[0]<<" "<<s.hidden[1]<<" grad "<<s.grad[0]<<" "<<s.grad[1]<<" repeated-row-delta "<<wi->at(d->nwords()+2,0)-before<<"\n";
 std::cout<<"PAYLOAD input "<<(d->nwords()+a->bucket)*2*sizeof(real)<<" buckets "<<a->bucket*2*sizeof(real)<<"\n";
}
