# Word-Pair Extraction
# 문장 단위로 연속되는 두개 토큰의 품사 태그를 조사한다.
# 사용자가 선택한 품사들과 일치하는 토큰 쌍을 추출한다.
from nltk import RegexpParser, tree

def run(posTaggedTokenListList, pos1, pos2):
    retVal = ''

    # word pair 정규식을 정의한다.
    regex = ('pattern: {<%s><%s>}' % (getPosTagRegex(pos1), getPosTagRegex(pos2)))

    # 파서를 생성한다.
    parser = RegexpParser(regex)

    # 파싱한다.
    for posTaggedTokenList in posTaggedTokenListList:
        parsedTree = parser.parse(posTaggedTokenList)

        for subtree in parsedTree:
            if isinstance(subtree, tree.Tree):
                retVal += (subtree[0][0] + " ")
                retVal += (subtree[1][0] + "\r\n")

    return retVal

# 각 품사 별 태그 패턴을 정의한다.
def getPosTagRegex(posTag):
    retVal = ""

    # 명사
    if posTag == "NOUN":
        retVal = "NNPS|NNP|NNS|NN"

    # 동사
    elif posTag == "VERB":
        retVal = "VBZ|VBP|VBN|VBG|VBD|VB|MD"

    # 형용사
    elif posTag == "ADJ":
        retVal = "JJS|JJR|JJ"

    # 부사
    elif posTag == "ADV":
        retVal = "WRB|RP|RBS|RBR|RB"

    # 한정사
    elif posTag == "DET":
        retVal = "PDT|DT"

    # 대명사
    elif posTag == "PRON":
        retVal = "WP$|WP|WDT|PRP$|PRP"

    # 전치사
    elif posTag == "PREP":
        retVal = "TO"

    # 접속사
    elif posTag == "CONJ":
        retVal = "IN|CC"

    # 감탄사
    elif posTag == "INT":
        retVal = "UH"

    return retVal