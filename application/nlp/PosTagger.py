# POS(Part Of Speech) tagging
# 토큰 별 품사 정보를 알아낸다.

from nltk import sent_tokenize, word_tokenize, pos_tag


def run(rawText):

    retVal = ""

    # 텍스트를 문장 단위로 분할한다.
    sentenceList = sent_tokenize(rawText)
    taggedTokenListList = []

    for sentence in sentenceList:
        # 각 문장을 토큰화 한다.
        rawTokenList = word_tokenize(sentence)

        # 각 토큰에 품사 태그를 붙인다.
        taggedTokenList = pos_tag(rawTokenList)
        taggedTokenListList.append(taggedTokenList)

        for taggedToken in taggedTokenList:
            retVal += (taggedToken[0] + "<span class='bgAmbigousBlue'>&#x2770;")
            retVal += (taggedToken[1] + "&#x2771;</span> ")

        retVal += "\n"

    return retVal, sentenceList, taggedTokenListList
