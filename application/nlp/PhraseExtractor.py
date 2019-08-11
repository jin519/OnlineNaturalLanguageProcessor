# Phrase Extraction
# 문장 단위로 토큰 리스트의 품사 태그를 검사하고,
# 인자로 주어진 구(Phrase)를 추출한다.
from nltk import RegexpParser, tree

def run(posTaggedTokenListList, phrase):
    retVal = ""

    # Chunk 정규식 정의
    # Chunk 정규식은 절대적인 기준이 없으며,
    # 개발자가 직접 원문의 내용을 분석하고 상황에 따라 별도로 정의해주어야 한다.
    regexes = """
        NP: {<DT|PP\$>?<JJ>*<NN.*>+} # 명사구
        PP: {<IN><NP>}               # 전치사구
        VP: {<MD>?<VB.*><NP|PP>}     # 동사구
    """

    # 파서를 생성한다.
    parser = RegexpParser(regexes)

    # 파싱한다.
    for posTaggedTokenList in posTaggedTokenListList:
        parsedTree = parser.parse(posTaggedTokenList)

        nodeStackList = []

        for subtree in parsedTree:
            if isinstance(subtree, tree.Tree) and subtree.label() == phrase:
                print(subtree)
                nodeStack = []

                for node in subtree:
                    nodeStack.append(node)

                nodeStackList.append(nodeStack)

        for nodeStack in nodeStackList:
            while nodeStack:
                node = nodeStack.pop(0)

                if isinstance(node, tree.Tree):
                    for subNode in reversed(node):
                        nodeStack.insert(0, subNode)
                else:
                    retVal += (node[0] + " ")

            retVal += "\r\n"

    return retVal
