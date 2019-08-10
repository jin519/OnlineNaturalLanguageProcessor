# POS(Part Of Speech) tagging
# 텍스트를 문장 단위로 분할하고, 각 문장을 토큰화 한다.
# 이후 각 토큰에 품사 태그를 붙인다.

from nltk import sent_tokenize, word_tokenize, pos_tag
from application import nlp

def run(rawText):
    retVal = ""

    # 텍스트를 문장 단위로 분할한다.
    nlp.sentenceList = sent_tokenize(rawText)

    for sentence in nlp.sentenceList:
        # 각 문장을 토큰화 한다.
        rawTokenList = word_tokenize(sentence)

        # 각 토큰에 품사 태그를 붙인다.
        taggedTokenList = pos_tag(rawTokenList)
        nlp.taggedTokenListList.append(taggedTokenList)

        for taggedToken in taggedTokenList:
            retVal += (taggedToken[0] + "<span class='bgAmbigousBlue'>&#x2770;")
            retVal += (taggedToken[1] + "&#x2771;</span> ")

        retVal += "\n"

    return retVal