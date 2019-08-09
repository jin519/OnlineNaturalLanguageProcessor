// 분석 방법 enum
const ProcessingType = {
    NER: '0',
    N_GRAM: '1',
    WORD_PAIR: '2',
    PHRASE: '3'
};

// 출력 영역
var rawOutput;
var posTaggedOutput;
var resultOutput;

// 파일 관리
var fileForm;
var fileReader;

// 라디오 버튼
var radios;
var radioComments;
var radioForms;
var prevRadioIdx = -1;

// 분석 시작 버튼
var submitBtn;

// 서버 통신
var rawText;
var posTaggedText;
var resultText;

function init() {
    initOutputs();
    initFileManager();
    initRadios();

    submitButton = document.getElementById("submitButton");
}

/**
 * 출력 영역에 대한 dom 객체 레퍼런스를 가져온다.
 */
function initOutputs() {
    rawOutput = document.getElementById("rawOutput");
    posTaggedOutput = document.getElementById("posTaggedOutput");
    resultOutput = document.getElementById("resultOutput");
}

/**
 * 파일 폼 dom 객체 레퍼런스를 가져온다.
 * fileReader 객체를 생성하고, 이벤트 리스너를 등록한다.
 */
function initFileManager() {
    fileForm = document.getElementById("fileForm");
    fileReader = new FileReader();

    // 사용자가 파일을 선택하면 내용을 텍스트로 가져온다.
    fileForm.addEventListener("change", function () {
        fileReader.readAsText(fileForm.files[0]);
    });

    // 파일이 전부 로드되면 원본 텍스트를 저장 및 출력한다.
    // 라디오 버튼, 분석 시작 버튼을 활성화한다.
    fileReader.addEventListener("load", function (event) {
        rawText = event.target.result;
        rawOutput.style.display = "inline-block";
        rawOutput.innerText = rawText;

        activateRadios();
        radios[0].click(); // 첫번째 라디오 버튼을 기본으로 클릭한다.
        activateSubmitButton();
    });
}

/**
 * 라디오 버튼 dom 객체 레퍼런스를 가져오고, 이벤트 리스너를 등록한다.
 */
function initRadios() {
    radios = document.getElementsByName("processingType");
    radioComments = document.getElementsByClassName("hiddenComment");
    radioForms = document.getElementsByClassName("hiddenForm");

    radios.forEach(radio => radio.addEventListener("click", onRadioClick));
}

/**
 * 분석 시작 버튼 dom 객체 레퍼런스를 가져오고, 이벤트 리스너를 등록한다.
 */
function initSubmitButton() {
    submitBtn = document.getElementsById("submitButton");
}

/**
 * 라디오 버튼을 활성화한다.
 */
function activateRadios() {
    radios.forEach(radio => radio.disabled = false);
}

/**
 * 라디오 버튼 클릭 시 호출된다.
 */
function onRadioClick() {
    const RADIO_IDX = this.value;

    markClickedRadio(RADIO_IDX);
    showRadioForm(RADIO_IDX);
    showRadioComment(RADIO_IDX);

    prevRadioIdx = RADIO_IDX;
}

/**
 * 라디오 버튼 클릭 시 버튼 배경색을 강조한다.
 * @param {number} radioIdx 클릭한 라디오 버튼 인덱스
 */
function markClickedRadio(radioIdx) {
    if (prevRadioIdx >= ProcessingType.NER)
        radios[prevRadioIdx].parentElement.style.backgroundColor = "aliceblue";

    radios[radioIdx].parentElement.style.backgroundColor = "#a6c7ff";
}

/**
 * 라디오 버튼 클릭시 대응하는 분석 방법에 필요한 폼을 출력한다.
 * NER의 경우 추가로 필요한 폼이 없기 때문에, radioForm 배열이 왼쪽으로 한칸 씩 당겨진다.
 * @example
 * radioForm[0]: N-GRAM, radioForm[1]: Word-Pair, radioForm[2]: Phrase
 * @param {number} radioIdx 클릭한 라디오 버튼 인덱스
 */
function showRadioForm(radioIdx) {
    if (prevRadioIdx > ProcessingType.NER)
        radioForms[(prevRadioIdx - 1)].style.display = "none";

    if (radioIdx > ProcessingType.NER)
        radioForms[radioIdx - 1].style.display = "inline-block";
}

/**
 * 라디오 버튼 클릭시 대응하는 분석 방법에 대한 코멘트를 출력한다.
 * @param {number} radioIdx 클릭한 라디오 버튼 인덱스
 */
function showRadioComment(radioIdx) {
    if (prevRadioIdx >= ProcessingType.NER)
        radioComments[prevRadioIdx].style.display = "none";

    radioComments[radioIdx].style.display = "inline-block";
}

/**
 * 분석 시작 버튼을 활성화한다.
 */
function activateSubmitButton() {
    submitButton.disabled = false;
}

// 분석 시작 버튼 클릭 시 호출된다.

// 서버로 원본 텍스트 파일을 보내고, 가공된 데이터를 가져온다.
// @param route: 경로
function requestAnalysis(route) {
    // $.ajax({
    //     type: "POST",
    //     url: route,

    //     // data는 이름 : 컨텐츠 쌍으로 구성된다. (json format)
    //     data: {
    //         article: rawText,
    //         additionalParams: params
    //     },
    //     success: function (response) {
    //         // 분석한 결과를 serverResult에 저장하고, 알림을 띄운 후 innerText로 설정한다.
    //         resultText = response['result'];

    //         output.innerText = serverResult;
    //         onAnalyzingFinish();

    //         alert('분석이 완료되었습니다.');
    //     }
    // });
}