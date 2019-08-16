# Online-Natural-Language-Processor

>프로젝트 설정에 필요한 자세한 내용들은 <a href="https://github.com/jin519/Online-Natural-Language-Processor/blob/29dd3745102bbaa59789a41f548add28ab21cfb4/documentation/.README.md">다음 문서</a>를 참고하십시오.

>영문 텍스트 파일을 입력 받아 다양한 형태의 nlp를 온라인으로 수행할 수 있는 웹 페이지입니다.<br>
<a href="http://www.godjin.online:8000">이곳</a>에서 서비스를 이용해 보실 수 있습니다. 본 프로젝트는 다음과 같은 기능을 제공합니다.<br>


<ul>
  <li><a href="application/nlp/PosTagger.py"><b>Pos Tagging</b></a>
      
    텍스트를 가공하여 토큰 단위로 품사 태그를 붙여서 출력합니다.
  
  </li>
   
  <li><a href="application/nlp/NamedEntityRecognizer.py"><b>Named Entity Recognition</b></a>
    
    토큰 별 유형 정보를 출력합니다. 
  
  <li><a href="application/nlp/NGramExtractor.py"><b>N-Gram Extraction</b></a>
  
    주어진 문장을 토큰 별로 분할한 뒤, n개 단위로 묶어 n-gram 리스트를 생성합니다.
    문서 내 n-gram들의 빈도수를 측정합니다.
    임계값 이상의 n-gram을 출력합니다.
    
  </li>
  
  <li><a href="application/nlp/WordPairExtractor.py"><b>Word-Pair Extraction</b></a>

    사용자가 두개의 품사를 선택합니다.
    주어진 문장을 토큰 별로 분할한 뒤, 연속되는 토큰의 품사를 조사합니다.
    선택한 품사들과 일치하는 토큰 쌍을 출력합니다.
    
  </li>
  
  <li><a href="application/nlp/PhraseExtractor.py"><b>Phrase Extraction</b></a>
    
    사용자가 추출할 구(Phrase)를 선택합니다.
    주어진 문장 내 해당되는 구를 출력합니다.
    
  </li>
</ul>

Demo

<ul>
  <li>파일 선택<img src="md/demo1.gif"></li>
  <li>설명 보기<img src="md/demo2.gif"></li>
  <li>Named Entity Recognition<img src="md/demo3.gif"></li>
  <li>N-Gram Extraction<img src="md/demo4.gif"></li>
  <li>Word-Pair Extraction<img src="md/demo5.gif"></li>
  <li>Phrase Extraction<img src="md/demo6.gif"></li>
  <li>다운로드<img src="md/demo7.gif"></li>
</ul>
