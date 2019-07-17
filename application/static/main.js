document.writeln("<script src='../static/download.js?1906241034'></script>");

var fileReaderForm; // file reader dom 객체
var fileReader; // file reader 객체
var input; // 입력받은 텍스트 파일을 출력하는 dom 객체
var output; // 분석 결과를 출력하는 dom 객체

var radioButtons; // 라디오 버튼 레퍼런스 리스트
var currentRadioIdx;

var wordPairParamUI;
var posList1;
var posList2;

var ngramsParamUI;
var ngramsNumTokens;
var ngramsFreqThreshold;

var phraseParamUI;
var phraseList;

var submitButton; // 전송 버튼
var downloadButton; // 다운로드 버튼

var localText; // 사용자가 선택한 텍스트 파일을 저장하는 string 변수
var serverResult; // 서버가 가공한 텍스트 파일을 저장하는 string 변수

var currentRoute = null;

function onLoadTextFile() {
    submitButton.disabled = false;

    for (var i = 0; i < radioButtons.length; i++)
        radioButtons[i].disabled = false;
}

// 초기화 함수
function init() {
    // dom 객체를 가져온다.
    fileReaderForm = document.getElementById("fileReaderForm");
    input = document.getElementById("input");
    output = document.getElementById("output");
    radioButtons = document.getElementsByName("radioButtons");

    submitButton = document.getElementById("submit");
    downloadButton = document.getElementById("download");

    ngramsParamUI = document.getElementById("ngramsParamUI");
    ngramsNumTokens = document.getElementById("ngramsNumTokens");
    ngramsFreqThreshold = document.getElementById("ngramsFreqThreshold");

    wordPairParamUI = document.getElementById("wordPairParamUI");
    posList1 = document.getElementById("posList1");
    posList2 = document.getElementById("posList2");

    phraseParamUI = document.getElementById("phraseParamUI");
    phraseList = document.getElementById("phraseList");

    // localText, serverResult를 null로 초기화한다.
    localText = null;
    serverResult = null;

    // file reader 객체를 만든다.
    fileReader = new FileReader();

    // onload 리스너를 단다. 콜백 함수로, 파일 로드가 완료되면 실행된다.
    fileReader.onload = function (event) {
        // 읽어온 문자열을 localText에 할당한다.
        localText = event.target.result;

        // output 객체의 innerText로 localText를 설정한다.
        input.innerText = localText;

        onLoadTextFile();
    };
}

// 사용자가 파일을 선택하면 불리는 콜백 함수
function fileRead() {
    // 텍스트 파일을 읽어온다.
    fileReader.readAsText(fileReaderForm.files[0]);
}

function onRadioChange(target) {
    currentRadioIdx = parseInt(target.value);

    switch (currentRadioIdx) {
        // NamedEntity
        case 0:
            currentRoute = "/NamedEntity";
            ngramsParamUI.style.display = "none";
            wordPairParamUI.style.display = "none";
            phraseParamUI.style.display = "none";
            break;

        // NGrams
        case 1:
            currentRoute = "/NGrams";
            ngramsParamUI.style.display = "inline-block";
            wordPairParamUI.style.display = "none";
            phraseParamUI.style.display = "none";
            break;

        // WordPair
        case 2:
            currentRoute = "/WordPair";
            ngramsParamUI.style.display = "none";
            wordPairParamUI.style.display = "inline-block";
            phraseParamUI.style.display = "none";
            break;

        // Phrase
        case 3:
            currentRoute = "/Phrase";
            ngramsParamUI.style.display = "none";
            wordPairParamUI.style.display = "none";
            phraseParamUI.style.display = "inline-block";
            break;
    }
}

function buildAdditionalParams() {
    var retVal = "";

    switch (currentRadioIdx) {
        // NamedEntity
        case 0:
            break;

            // NGrams
        case 1:
            retVal += (ngramsNumTokens.value + "\n");
            retVal += (ngramsFreqThreshold.value + "\n");
            break;

            // WordPair
        case 2:
            retVal += (posList1.options[posList1.selectedIndex].value + "\n");
            retVal += (posList2.options[posList2.selectedIndex].value + "\n");
            break;

            // Phrase
        case 3:
            retVal += (phraseList.options[phraseList.selectedIndex].value);
            break;
    }

    return retVal;
}

// 전송 버튼을 누르면 호출되는 콜백 함수
function submitBtnOnClick() {
    if (currentRoute == null) {
        alert("먼저 분석 종류를 선택해주시기 바랍니다.");
        return;
    }

    onAnalyzingStart();
    alert("분석을 시작합니다.");

    var params = buildAdditionalParams();

    // 서버로 읽어온 텍스트 파일을 보내고, 가공된 데이터를 가져온다.
    $.ajax({
        type: "POST",
        url: currentRoute,

        // data는 이름 : 컨텐츠 쌍으로 구성된다. (json format)
        data: {
            article: localText,
            additionalParams: params
        },
        success: function (response) {
            // 분석한 결과를 serverResult에 저장하고, 알림을 띄운 후 innerText로 설정한다.
            serverResult = response['result'];

            output.innerText = serverResult;
            onAnalyzingFinish();

            alert('분석이 완료되었습니다.');
        }
    });
}

// 다운로드 버튼을 누르면 호출되는 콜백 함수
function downloadBtnOnClick() {
    // 분석 결과를 로컬에 저장한다.
    download(serverResult, "result.txt", "text/plain");

    for (var i = 0; i < radioButtons.length; i++)
        radioButtons[i].disabled = true;
}

function onAnalyzingStart() {
    fileReaderForm.disabled = true;
    submitButton.disabled = true;

    for (var i = 0; i < radioButtons.length; i++)
        radioButtons[i].disabled = true;

    downloadButton.disabled = true;
}

function onAnalyzingFinish() {
    fileReaderForm.disabled = false;
    submitButton.disabled = false;

    for (var i = 0; i < radioButtons.length; i++)
        radioButtons[i].disabled = false;

    downloadButton.disabled = false;
}