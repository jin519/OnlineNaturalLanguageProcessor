import csv
import boto3

# csv file을 열고,
csvFile = open('nlp/accessKeys.csv', 'r')

# access key 정보를 가져온다.
pair = list(csv.DictReader(csvFile))[0]
acc_id = pair['Access key ID']
acc_pw = pair['Secret access key']

# csv 파일을 닫는다.
csvFile.close()

# AWS 서버에서 인증을 받아 클라이언트 객체를 생성한다.
comprehend = boto3.client(
    service_name='comprehend',
    region_name='us-east-1',
    aws_access_key_id=acc_id,
    aws_secret_access_key=acc_pw)