# Named Entity Recognition
# 텍스트에서 엔티티를 추출하고, 각 엔티티에 해당하는 유형 정보를 알아낸다.
from application.nlp import comprehend

def run(sentenceList):
    dictMap = {}
    retVal = ''

    for sentence in sentenceList:
        # 각 문장 별 entity를 조사한다.
        entities = comprehend.detect_entities(Text=sentence, LanguageCode='en')

        for entity in entities["Entities"]:
            # dictMap에 [key: 엔티티 명, value: 유형]을 저장한다.
            key = entity["Text"]
            value = entity["Type"]

            # dictMap에 동일한 엔티티 명이 존재하지 않는 경우에 한해서
            # 엔티티를 추가하고, retVal에 반영한다.
            if key not in dictMap:
                dictMap[key] = value
                row = (key + ': ' + value + '\r\n')
                retVal += row

    return retVal
