# from application.nlp import comprehend
# from nltk import sent_tokenize
#
# def run(article):
#     # 기사를 라인 별로 분할하여 리스트로 저장한다.
#     sentences = sent_tokenize(article)
#
#     # Map 객체로써 key는 entity 명, value는 타입이다.
#     # ex. key: NEW YORK, value: LOCATION
#     dictMap = {}
#
#     # 결과를 저장하는 string이다.
#     retVal = ''
#
#     # sentences 내에 있는 모든 sentence에 대해
#     for sentence in sentences:
#         # entity를 조사한다.
#         entities = comprehend.detect_entities(Text=sentence, LanguageCode='en')
#
#         # entities 내에 있는 모든 entitiy에 대해
#         for entity in entities["Entities"]:
#             # 이름과 type을 저장한다. 이름은 소문자로 저장한다.
#             key = entity["Text"].lower()
#             value = entity["Type"]
#
#             # dictMap에 해당 이름의 entity가 존재하지 않는 경우에 한해서
#             # entity를 추가하고, retVal에 반영한다.
#             if key not in dictMap:
#                 dictMap[key] = value
#                 row = (key + ': ' + value + '\r\n')
#                 retVal += row
#
#     return retVal
