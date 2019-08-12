const AnalysisType = {
    NER: '0',
    N_GRAM: '1',
    WORD_PAIR: '2',
    PHRASE: '3'
};

let dom = {
    loadingBox: null,
    fileForm: null,
    radioButtons: null,
    analysisComments: null,
    analysisForms: null,
    ngramNumTokens: null,
    ngramFreqThreshold: null,
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
let prevFileName = null;
let prevRadioIdx = -1;
let loading = false;
let routes = ["/NamedEntity", "/NGram", "/WordPair", "/Phrase"];

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
    dom.loadingBox = document.getElementById("loadingBox");
    dom.fileForm = document.getElementById("fileForm");
    dom.radioButtons = document.getElementsByName("analysisType");

    dom.analysisComments = document.getElementsByClassName("analysisComment");
    dom.analysisForms = document.getElementsByClassName("analysisForm");

    dom.ngramNumTokens = document.getElementById("ngramNumTokens");
    dom.ngramFreqThreshold = document.getElementById("ngramFreqThreshold");
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
    dom.downloadButton.addEventListener("click", onDownloadButtonClick);
}

/**
 * 파일 선택 시 호출된다.
 */
function onFileFormChange() {
    const FILE = dom.fileForm.files[0];

    // 파일 내용을 텍스트로 가져온다.
    if (FILE != null && FILE.name != prevFileName) {
        fileReader.readAsText(FILE);

        deactivateRadioButtons();
        deactivateSubmitButton();
        deactivateDownloadButton();

        hideRawOutput();
        hidePosTaggedOutput();
        hideResultOutput();

        prevFileName = FILE.name;
    }
}

/**
 * 파일이 전부 로드되면 호출된다.
 */
function onFileReaderLoad(event) {
    // 원본 텍스트를 저장 및 출력한다.
    text.raw = event.target.result;
    dom.rawOutput.innerText = text.raw;
    showRawOutput();

    // 라디오 버튼, 분석 시작 버튼을 활성화한다.
    // 첫번째 라디오 버튼을 기본으로 클릭한다.
    activateRadioButtons();
    text.posTagged = null;
    dom.radioButtons[0].click();
    activateSubmitButton();
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
 * 분석 시작 버튼 클릭 시 호출된다.
 */
function onSubmitButtonClick() {
    if (text.posTagged == null) {
        // PosTagging은 파일 로드 후 분석 시작 버튼을 최초 클릭한 시점에 한번만 수행된다.
        // 해당 작업은 비동기 처리 된다.
        // 따라서 작업이 순차적으로 (PosTagging 먼저, 이후 작업 수행) 진행되어야 하므로,
        // PosTagging을 우선 요청하고, 이후 작업은 PosTagging 완료 즉시 재 요청한다.
        requestPosTag();
        return;
    }

    // 현재 영역은 위 분기문이 작동하지 않았을 시, 즉 PosTagging이 완료된 이후 진입하게 된다.
    requestSelectedWork();
}

/**
 * 다운로드 버튼 클릭 시 호출된다.
 */
function onDownloadButtonClick() {
    const ANALYSIS_TYPE = routes[prevRadioIdx];
    const FILE_NAME = ("[" + ANALYSIS_TYPE.replace("/", "") + "]-" + prevFileName);

    // 분석 결과를 로컬에 저장한다.
    download(text.result, FILE_NAME, "text/plain");
}

/**
 * 분석이 시작되면 호출된다.
 */
function onAnalyzingStart() {
    loading = true;
    showLoadingBox();
}

/**
 * 분석이 끝나면 호출된다.
 */
function onAnalyzingFinish() {
    hideLoadingBox();
    activateDownloadButton();
    loading = false;
}

/**
 * 서버로 원본 텍스트 파일을 보내고, PosTagging을 수행한다.
 */
function requestPosTag() {
    if (!loading)
        onAnalyzingStart();

    $.ajax({
        type: "POST",
        url: "/PosTag",
        data: {
            rawText: text.raw
        },

        success: function (response) {
            text.posTagged = response.result;
            dom.posTaggedOutput.innerHTML = text.posTagged;
            showPosTaggedOutput();

            // PosTagging이 완료되면, 본래 선택했던 분석을 수행한다.
            requestSelectedWork();
        }
    });
}

/**
 * 마지막으로 클릭한 라디오 버튼의 인덱스를 조사하여 해당 분석을 수행한다.
 */
function requestSelectedWork() {
    if (!loading)
        onAnalyzingStart();

    $.ajax({
        type: "POST",
        url: routes[prevRadioIdx],
        data: {
            additionalParams: buildAdditionalParams()
        },

        success: function (response) {
            text.result = response.result;
            dom.resultOutput.innerText = text.result;
            showResultOutput();
            onAnalyzingFinish();
        }
    });
}

/**
 * 분석에 필요한 추가 인자들을 라인 단위로 구분하여 문자열 형태로 반환한다.
 * @return {string} 추가 정보
 */
function buildAdditionalParams() {
    let retVal = "";

    switch (prevRadioIdx) {
        case AnalysisType.N_GRAM:
            retVal += (dom.ngramNumTokens.value + "\r\n");
            retVal += dom.ngramFreqThreshold.value;
            break;
        case AnalysisType.WORD_PAIR:
            retVal += (dom.wordpairPosList1.options[dom.wordpairPosList1.selectedIndex].value + "\r\n");
            retVal += (dom.wordpairPosList2.options[dom.wordpairPosList2.selectedIndex].value);
            break;
        case AnalysisType.PHRASE:
            retVal += (dom.phraseList.options[dom.phraseList.selectedIndex].value);
    }

    return retVal;
}

/**
 * 클릭한 라디오 버튼 배경 색을 변경한다.
 * @param {number} index 클릭한 라디오 버튼 인덱스
 */
function markClickedRadioButton(index) {
    if (prevRadioIdx >= AnalysisType.NER)
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
    if (prevRadioIdx > AnalysisType.NER)
        dom.analysisForms[(prevRadioIdx - 1)].style.display = "none";

    if (index > AnalysisType.NER)
        dom.analysisForms[index - 1].style.display = "inline-block";
}

/**
 * 분석 방법에 대한 코멘트를 출력한다.
 * @param {number} index 클릭한 라디오 버튼 인덱스
 */
function showAnalysisComment(index) {
    if (prevRadioIdx >= AnalysisType.NER)
        dom.analysisComments[prevRadioIdx].style.display = "none";

    dom.analysisComments[index].style.display = "inline-block";
}

/**
 * 로딩 박스를 화면에 보여준다.
 */
function showLoadingBox() {
    dom.loadingBox.style.display = "inline-block";
}

/**
 * 로딩 박스를 화면에서 숨긴다.
 */
function hideLoadingBox() {
    dom.loadingBox.style.display = "none";
}

/**
 * 라디오 버튼을 활성화한다.
 */
function activateRadioButtons() {
    dom.radioButtons.forEach(radioButton => radioButton.disabled = false);
}

/**
 * 라디오 버튼을 비활성화한다.
 */
function deactivateRadioButtons() {
    dom.radioButtons.forEach(radioButton => radioButton.disabled = true);
}

/**
 * 분석 시작 버튼을 활성화한다.
 */
function activateSubmitButton() {
    dom.submitButton.disabled = false;
}

/**
 * 분석 시작 버튼을 비활성화한다.
 */
function deactivateSubmitButton() {
    dom.submitButton.disabled = true;
}

/**
 * 다운로드 버튼을 활성화한다.
 */
function activateDownloadButton() {
    dom.downloadButton.disabled = false;
}

/**
 * 다운로드 버튼을 비활성화한다.
 */
function deactivateDownloadButton() {
    dom.downloadButton.disabled = true;
}

/**
 * 원본 텍스트 출력 영역을 화면에 보여준다.
 */
function showRawOutput() {
    dom.rawOutput.style.display = "inline-block";

}

/**
 * 원본 텍스트 출력 영역을 화면에서 숨긴다.
 */
function hideRawOutput() {
    dom.rawOutput.style.display = "none";
}

/**
 * PosTagging 결과 출력 영역을 화면에 보여준다.
 */
function showPosTaggedOutput() {
    dom.posTaggedOutput.style.display = "inline-block";
}

/**
 * PosTagging 결과 출력 영역을 화면에서 숨긴다.
 */
function hidePosTaggedOutput() {
    dom.posTaggedOutput.style.display = "none";
}

/**
 * 분석 결과 출력 영역을 화면에 보여준다.
 */
function showResultOutput() {
    dom.resultOutput.style.display = "inline-block";
}

/**
 * 분석 결과 출력 영역을 화면에서 숨긴다.
 */
function hideResultOutput() {
    dom.resultOutput.style.display = "none";
}