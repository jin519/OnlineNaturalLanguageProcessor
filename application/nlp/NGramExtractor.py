# N-Gram Extraction
# 문장 단위로 n-gram 리스트를 생성하고, 텍스트 내 빈도수를 측정한다.
# 임계값 이상의 n-gram을 추출한다.
from nltk import FreqDist, ngrams

def run(rawTokenListList, numTokens, freqThreshold):
    freqDistMap = {}
    retVal = ""
    total = 0

    # freqDistMap [key: n-gram, value: 빈도수]를 구축한다.
    for rawTokenList in rawTokenListList:
        # 각 문장 토큰 리스트를 numTokens 단위로 묶어서 n-gram 리스트를 생성한다.
        ngramList = ngrams(rawTokenList, numTokens)

        # 각 n-gram의 빈도수를 측정한다.
        freqDist = FreqDist(ngramList)

        for key, value in freqDist.items():
            # map 내 n-gram이 존재하면 빈도수를 누적한다.
            if key in freqDistMap:
                freqDistMap[key] += value
            # 최초 등장 n-gram의 경우 map에 추가한다.
            else:
                freqDistMap[key] = value

    # 임계값 이상의 n-gram을 추출한다.
    for key in freqDistMap:
        freq = freqDistMap[key]

        if freq >= freqThreshold:
            for gram in key:
                retVal += (gram + " ")
            retVal += ("- %d\r\n" % freq)
            total += 1

    retVal = (("total: %d\r\nnumTokens: %d, freqThreshold: %d\r\n\r\n" % (total, numTokens, freqThreshold)) + retVal)

    return retVal
