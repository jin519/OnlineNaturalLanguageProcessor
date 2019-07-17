# 프로그램 실행에 앞서, 먼저 처리되는 초기화 용 파일이다.
# 이름 변경 금지!

from flask import Flask, render_template, request, jsonify
from application.nlp import EntityDetector
from application.nlp import WordPairExtractor
from application.nlp import PhraseExtractor
from application.nlp import NGramsExtractor

# Flask 인스턴스를 생성한다. (클라이언트의 각종 response를 처리해줌)
flaskInstance = Flask(__name__)

# Flask로 만든 웹 서버 프로그램의 기본 경로는 http://IP주소:포트번호이다.
# 이 경로가 항상 앞에 따라다니며, 뒤의 경로는 개발자 마음대로 지정이 가능하다.
# @와 함께 Flask의 인스턴스.route("하위 경로명")을 지정하면 기본 경로+하위 경로에 대한 처리 기능을 추가할 수 있다.

# http://IP주소:포트번호/ 로 접속하고, 'index.html'을 화면에 띄운다.
@flaskInstance.route("/")
def index(name=None):
    return render_template('index.html', name=name)

# http://IP주소:포트번호/NamedEntity 로 접속하고, 서버에 article을 보내서 가공된 결과물을 받는다.
@flaskInstance.route("/NamedEntity", methods=['POST'])
def NamedEntity(name=None):
    article = request.form['article']

    # some logic in here
    result = EntityDetector.run(article)

    retVal = {'result': result}
    return jsonify(retVal)

# http://IP주소:포트번호/WordPair 로 접속하고, 서버에 article을 보내서 가공된 결과물을 받는다.
@flaskInstance.route("/WordPair", methods=['POST'])
def WordPair(name=None):
    article = request.form['article']
    additionalParams = request.form['additionalParams'].splitlines()

    pos1 = additionalParams[0]
    pos2 = additionalParams[1]

    # some logic in here
    result = WordPairExtractor.run(article, pos1, pos2)

    retVal = {'result': result}
    return jsonify(retVal)

# http://IP주소:포트번호/Phrase 로 접속하고, 서버에 article을 보내서 가공된 결과물을 받는다.
@flaskInstance.route("/Phrase", methods=['POST'])
def Phrase(name=None):
    article = request.form['article']
    phrase = request.form['additionalParams']

    # some logic in here
    result = PhraseExtractor.run(article, phrase)

    retVal = {'result': result}
    return jsonify(retVal)


@flaskInstance.route("/NGrams", methods=['POST'])
def NGrams(name=None):
    article = request.form['article']
    additionalParams = request.form['additionalParams'].splitlines()

    numTokens = int(additionalParams[0])
    freqThreshold = int(additionalParams[1])

    # some logic in here
    result = NGramsExtractor.run(article, numTokens, freqThreshold)

    retVal = {'result': result}
    return jsonify(retVal)
