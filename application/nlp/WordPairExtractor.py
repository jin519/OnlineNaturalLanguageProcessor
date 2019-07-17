from nltk import sent_tokenize
from nltk import RegexpParser
from nltk import word_tokenize
from nltk import pos_tag
from nltk import tree
from re import search

def run(article, pos1, pos2):
    # 텍스트 파일을 문장 단위로 분할하여 sentenceList로 저장
    sentenceList = sent_tokenize(article)

    # 재정의 품사 패턴
    noun = 'FW|NN'      # 명사
    verb = 'MD|VB'      # 동사
    adj = 'JJ|VBN'      # 형용사
    adv = 'W?RB|^RP'    # 부사
    det = 'DT?'         # 한정사
    pron = 'EX|PRP|^WP' # 대명사
    prep = '^TO|^IN'    # 전치사
    conj = 'CC'         # 접속사
    int_ = 'UH'         # 감탄사

    # word pair 패턴 정의
    patternList = ('pattern1: {<%s><%s>}' % (pos1, pos2))

    # 결과를 저장하는 string이다.
    retVal = ''

    # 파서 생성
    parser = RegexpParser(patternList)

    # 리스트 내 모든 문장에 대하여
    for sentence in sentenceList:

        # 공백을 기준으로 tokenizing
        tokenList = word_tokenize(sentence)

        # 리스트 내 모든 토큰들을 품사별로 매핑
        taggedList = pos_tag(tokenList)

        # (토큰, 재정의된 품사) 튜플을 저장할 리스트
        retaggedList = []

        # POS 재정의
        for tagged in taggedList:

            if search(noun, tagged[1]):
                retaggedList.append((tagged[0], 'NOUN'))
            elif search(verb, tagged[1]):
                retaggedList.append((tagged[0], 'VERB'))
            elif search(adj, tagged[1]):
                retaggedList.append((tagged[0], 'ADJ'))
            elif search(adv, tagged[1]):
                retaggedList.append((tagged[0], 'ADV'))
            elif search(det, tagged[1]):
                retaggedList.append((tagged[0], 'DET'))
            elif search(pron, tagged[1]):
                retaggedList.append((tagged[0], 'PRON'))
            elif search(prep, tagged[1]):
                retaggedList.append((tagged[0], 'PREP'))
            elif search(conj, tagged[1]):
                retaggedList.append((tagged[0], 'CONJ'))
            elif search(int_, tagged[1]):
                retaggedList.append((tagged[0], 'INT'))
            else:
                retaggedList.append((tagged[0], tagged[1]))

        # 파싱
        parsedTree = parser.parse(retaggedList)

        # 파일에 demo1 출력
        for subtree in parsedTree:
            if isinstance(subtree, tree.Tree):
                retVal += (subtree[0][0] + ' [' + subtree[0][1] + '] ')
                retVal += (subtree[1][0] + ' [' + subtree[1][1] + ']\n')

    return retVal
