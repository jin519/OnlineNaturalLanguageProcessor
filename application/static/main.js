const ProcessingType = {
    NER: '0',
    N_GRAM: '1',
    WORD_PAIR: '2',
    PHRASE: '3'
};

let dom = {
    fileForm: null,
    radioButtons: null,
    analysisComments: null,
    analysisForms: null,
    ngramNumTokens: null,
    ngramsFreqThreshold: null,
    wordpairPosList1: null,
    wordpairPosList2: null,
    phraseList: null,
    submitButton: null,
    downloadButton: null,
    rawOutput: null,
    posTaggedOutput: null,
    resultOutput: null
};

let fileReader = null;

let prevRadioIdx = -1;

let text = {
    raw: null,
    posTagged: null,
    result: null
};

/**
 * 웹 페이지 로드가 완료되면 호출된다.
 */
function init() {
    getDomReferences();
    initResources();
    registerListeners();
}

/**
 * dom 객체 레퍼런스를 가져온다.
 */
function getDomReferences() {
    dom.fileForm = document.getElementById("fileForm");
    dom.radioButtons = document.getElementsByName("analysisType");

    dom.analysisComments = document.getElementsByClassName("analysisComment");
    dom.analysisForms = document.getElementsByClassName("analysisForm");

    dom.ngramNumTokens = document.getElementById("ngramNumTokens");
    dom.ngramsFreqThreshold = document.getElementById("ngramsFreqThreshold");
    dom.wordpairPosList1 = document.getElementById("wordpairPosList1");
    dom.wordpairPosList2 = document.getElementById("wordpairPosList2");
    dom.phraseList = document.getElementById("phraseList");

    dom.submitButton = document.getElementById("submitButton");
    dom.downloadButton = document.getElementById("downloadButton");

    dom.rawOutput = document.getElementById("rawOutput");
    dom.posTaggedOutput = document.getElementById("posTaggedOutput");
    dom.resultOutput = document.getElementById("resultOutput");
}

/**
 * 리소스를 초기화한다.
 */
function initResources() {
    fileReader = new FileReader();
}

/**
 * 이벤트 리스너를 등록한다.
 */
function registerListeners() {
    dom.fileForm.addEventListener("change", onFileFormChange);
    fileReader.addEventListener("load", onFileReaderLoad);
    dom.radioButtons.forEach(radioButton => radioButton.addEventListener("click", onRadioButtonClick));
    dom.submitButton.addEventListener("click", onSubmitButtonClick);
}

/**
 * 파일 선택 시 호출된다.
 * 파일 내용을 텍스트로 가져온다.
 */
function onFileFormChange() {
    fileReader.readAsText(dom.fileForm.files[0]);
}

/**
 * 파일이 전부 로드되면 호출된다.
 * 원본 텍스트를 저장 및 출력한다.
 * 라디오 버튼, 분석 시작 버튼을 활성화한다.
 */
function onFileReaderLoad(event) {
    text.raw = event.target.result;
    dom.rawOutput.style.display = "inline-block";
    dom.rawOutput.innerText = text.raw;

    activateRadioButtons();
    dom.radioButtons[0].click(); // 첫번째 라디오 버튼을 기본으로 클릭한다.
    activateSubmitButton();
}

/**
 * 라디오 버튼을 활성화한다.
 */
function activateRadioButtons() {
    dom.radioButtons.forEach(radioButton => radioButton.disabled = false);
}

/**
 * 라디오 버튼 클릭 시 호출된다.
 */
function onRadioButtonClick() {
    const RADIO_IDX = this.value;

    markClickedRadioButton(RADIO_IDX);
    showAnalysisForm(RADIO_IDX);
    showAnalysisComment(RADIO_IDX);

    prevRadioIdx = RADIO_IDX;
}

/**
 * 클릭한 라디오 버튼 배경 색을 변경한다.
 * @param {number} index 클릭한 라디오 버튼 인덱스
 */
function markClickedRadioButton(index) {
    if (prevRadioIdx >= ProcessingType.NER)
        dom.radioButtons[prevRadioIdx].parentElement.style.backgroundColor = "aliceblue";

    dom.radioButtons[index].parentElement.style.backgroundColor = "#a6c7ff";
}

/**
 * 분석 방법에 필요한 폼을 출력한다.
 * @param {number} index 클릭한 라디오 버튼 인덱스
 */
function showAnalysisForm(index) {
    // 참고. NER의 경우 추가 폼이 없기 때문에, dom.analysisForm 배열이 왼쪽으로 한칸 씩 당겨진다.
    // dom.analysisForm[0]: N-GRAM, dom.analysisForm[1]: Word-Pair, dom.analysisForm[2]: Phrase
    if (prevRadioIdx > ProcessingType.NER)
        dom.analysisForms[(prevRadioIdx - 1)].style.display = "none";

    if (index > ProcessingType.NER)
        dom.analysisForms[index - 1].style.display = "inline-block";
}

/**
 * 분석 방법에 대한 코멘트를 출력한다.
 * @param {number} index 클릭한 라디오 버튼 인덱스
 */
function showAnalysisComment(index) {
    if (prevRadioIdx >= ProcessingType.NER)
        dom.analysisComments[prevRadioIdx].style.display = "none";

    dom.analysisComments[index].style.display = "inline-block";
}

/**
 * 분석 시작 버튼을 활성화한다.
 */
function activateSubmitButton() {
    dom.submitButton.disabled = false;
}

/**
 * 분석 시작 버튼 클릭 시 호출된다.
 */
function onSubmitButtonClick() {
    let params = buildAdditionalParams();

    if (text.posTagged == null)
        requestAnalysis("/PosTag", null);

    switch (prevRadioIdx) {
        case ProcessingType.NER:
            requestAnalysis("/NamedEntity", params);
            break;
        case ProcessingType.N_GRAM:
            requestAnalysis("/NGram", params);
            break;
        case ProcessingType.WORD_PAIR:
            requestAnalysis("/WordPair", params);
            break;
        case ProcessingType.PHRASE:
            requestAnalysis("/Phrase", params);
    }
}

/**
 * 분석에 필요한 추가 인자들을 라인 단위로 구분하여 문자열 형태로 반환한다.
 * @return {string} 추가 정보
 */
function buildAdditionalParams() {
    let retVal = null;

    switch (prevRadioIdx) {
        case ProcessingType.N_GRAM:
            retVal += (dom.ngramsNumTokens.value + "\n");
            retVal += (dom.ngramsFreqThreshold.value);
            break;
        case ProcessingType.WORD_PAIR:
            retVal += (dom.wordpairPosList1.options[dom.wordpairPosList1.selectedIndex].value + "\n");
            retVal += (dom.wordpairPosList2.options[dom.wordpairPosList2.selectedIndex].value);
            break;
        case ProcessingType.PHRASE:
            retVal += (dom.phraseList.options[dom.phraseList.selectedIndex].value);
    }

    return retVal;
}

/**
 * 서버로 원본 텍스트 파일을 보내고, 분석 결과를 저장 및 출력한다.
 * 경우에 따라 추가 정보를 인자로 넘길 수 있다.
 * @param {string} route 서버 대응 루틴
 * @param {string} params 추가 정보
 */
function requestAnalysis(route, params) {
    $.ajax({
        type: "POST",
        url: route,

        // data는 이름 : 컨텐츠 쌍으로 구성된다. (json format)
        data: {
            rawText: text.raw,
            additionalParams: params
        },

        // 분석 결과를 저장하고, 화면에 출력한다.
        success: function (response) {
            if (route == "/PosTag") {
                text.posTagged = response.result;
                dom.posTaggedOutput.innerText = text.posTagged;
            } else {
                text.result = response.result;
                dom.resultOutput.innerText = text.result;
            }
        }
    });
}