# 프로그램 실행에 앞서, 먼저 처리되는 초기화 용 파일이다.

# import boto3
# import csv
#
# # csv file을 열고,
# csvFile = open('nlp/accessKeys.csv', 'r')
#
# # access key 정보를 가져온다.
# pair = list(csv.DictReader(csvFile))[0]
# acc_id = pair['Access key ID']
# acc_pw = pair['Secret access key']
#
# # csv 파일을 닫는다.
# csvFile.close()
#
# # AWS 서버에서 인증을 받아 클라이언트 객체를 생성한다.
# comprehend = boto3.client(
#     service_name='comprehend',
#     region_name='us-east-1',
#     aws_access_key_id=acc_id,
#     aws_secret_access_key=acc_pw)

# 텍스트를 문장 단위로 분할하여 저장한 리스트
# @example Hello my name is Jin. Nice to meet you!
# 원소1 - 'Hello my name is Jin.'
# 원소2 - 'Nice to meet you!'
sentenceList = ""

# 텍스트를 문장 단위로 분할한 뒤,
# 각 문장 별 품사 태그를 저장한 리스트를 다시 리스트로 저장한
# 전체 텍스트의 "태그 리스트" 리스트
# @example Hello my name is Jin. Nice to meet you!
# 리스트1 - [('Hello', '품사'), ('my', '품사'), ('name', '품사')...]
# 리스트2 - [('Nice', '품사'), ('to', '품사')...]
taggedTokenListList = []