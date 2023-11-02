// More API functions here:
// https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/image

// the link to your model provided by Teachable Machine export panel
const URL = "https://teachablemachine.withgoogle.com/models/n2gzSDrKO/";

let model, webcam, labelContainer, maxPredictions;

// Load the image model and setup the webcam
async function init() {
  const modelURL = URL + "model.json";
  const metadataURL = URL + "metadata.json";

  // Teachable Machine 모델을 로드
  model = await tmImage.load(modelURL, metadataURL);
  maxPredictions = model.getTotalClasses();

  // 라벨 컨테이너 초기화
  labelContainer = document.getElementById("label-container");
  for (let i = 0; i < maxPredictions; i++) {
    labelContainer.appendChild(document.createElement("div"));
  }
}

// Run the webcam image through the image model
async function predict() {
  var image = document.getElementById("face-image");
  const prediction = await model.predict(image, false);

  let highestProbability = 0;
  let predictedClass = "";

  for (let i = 0; i < maxPredictions; i++) {
    if (prediction[i].probability > highestProbability) {
      highestProbability = prediction[i].probability;
      predictedClass = prediction[i].className;
    }
  }

  // 결과를 화면에 추가
  const resultContainer = document.createElement("div");
  resultContainer.innerHTML = `당신이 닮은 아이돌: ${predictedClass}`;
  labelContainer.appendChild(resultContainer);

  // 이미지를 삭제하면 결과도 삭제
  resultContainer.addEventListener("click", function() {
    labelContainer.removeChild(resultContainer);
  });
}

// 이미지 삭제 함수
function removeUpload() {
  $('.file-upload-input').replaceWith($('.file-upload-input').clone());
  $('.file-upload-content').hide();
  $('.image-upload-wrap').show();

  // 이미지를 삭제하면 결과도 삭제
  const resultContainers = document.querySelectorAll("#label-container div");
  resultContainers.forEach((resultContainer) => {
    labelContainer.removeChild(resultContainer);
  });
}

// 모델 이름에 대한 정보를 반환하는 함수
function getModelInfo(modelName) {
  // 모델 이름에 따라 정보를 반환할 수 있도록 수정
  if (modelName === "modelName1") {
    return { name: "모델1", description: "모델 1에 대한 설명" };
  } else if (modelName === "modelName2") {
    return { name: "모델2", description: "모델 2에 대한 설명" };
  } else {
    return { name: "모델 기본 이름", description: "모델 기본 설명" };
  }
}

function readURL(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    reader.onload = function(e) {
      $('.image-upload-wrap').hide();
      $('.file-upload-image').attr('src', e.target.result);
      $('.file-upload-content').show();
      $('.image-title').html(input.files[0].name);
    };
    reader.readAsDataURL(input.files[0]);
  } else {
    removeUpload();
  }
}

$('.image-upload-wrap').bind('dragover', function () {
  $('.image-upload-wrap').addClass('image-dropping');
});

$('.image-upload-wrap').bind('dragleave', function () {
  $('.image-upload-wrap').removeClass('image-dropping');
});

// Initialize the model and start webcam
init();

// Handle image upload and prediction
document.getElementById("file-input").addEventListener("change", function(e) {
  readURL(this);
  predict();
});
