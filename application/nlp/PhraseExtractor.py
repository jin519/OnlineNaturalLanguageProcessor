from nltk import word_tokenize
from nltk import pos_tag
from nltk import sent_tokenize
from nltk import RegexpParser
from nltk import tree


def run(article):
    # 컨텐츠 내에 있는 모든 단어들을 공백 문자열 기준으로 Tokenizing
    rawTokens = word_tokenize(article)

    # Part of Speech(POS) tagging
    # rawTokens(list)내에 저장된 모든 Token들을 POS 별로 매핑
    taggedTokens = pos_tag(rawTokens)

    # Chunk 정규식 정의
    # Chunk 정규식은 절대적인 기준이 없으며, 개발자가 직접 원문의 내용을 분석하고
    # 상황에 따라 별도로 정의해주어야 한다.
    regexes = """
        NP: {<DT|PP\$>?<JJ>*<NN.*>+} # noun phrase
        PP: {<IN><NP>}               # prepositional phrase
        VP: {<MD>?<VB.*><NP|PP>}     # verb phrase
    """

    # 파서 생성
    parser = RegexpParser(regexes)

    # 파싱
    parsedTree = parser.parse(taggedTokens)

    # 결과를 저장하는 string이다.
    retVal = ''

    for subtree in parsedTree:
        if isinstance(subtree, tree.Tree) and subtree.label() == "NP":
            retVal += (str(subtree) + '\r\n')

    return retVal