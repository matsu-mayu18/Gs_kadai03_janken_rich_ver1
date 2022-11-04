// alert("kore");

$(".player2_select_button").on("click", function () {
  //対戦相手を決める乱数
  player2_num = Math.floor(Math.random() * 5);

  player2_name = [
    "elsa1.png",
    "elsa2.png",
    "elsa3.png",
    "elsa4.png",
    "elsa5.png",
  ];

  filename = "./img/" + player2_name[player2_num];
  console.log(filename);

  $(".player1_view").html('<video id="player1_video"></video>');
  $(".player2_view").children("img").attr("src", filename);

  // camera_on();

  //画像認識(init ~ predictまで)
  let player1_hand_num = image();

  //じゃんけん実行
  janken(player1_hand_num);

  // const video = document.getElementById("player1_video");
  // navigator.mediaDevices
  //   .getUserMedia({
  //     video: true,
  //     audio: false,
  //   })
  //   .then((stream) => {
  //     video.srcObject = stream;
  //     video.play();
  //   })
  //   .catch((e) => {
  //     console.log(e);
  //   });
});

// 機械学習
const URL = "https://teachablemachine.withgoogle.com/models/DjPyL46cv/";
//const URL = "https://teachablemachine.withgoogle.com/models/my_model/";
let model, webcam, labelContainer, maxPredictions, canvas;

async function load_model() {
  const modelURL = URL + "model.json";
  const metadataURL = URL + "metadata.json";

  //学習済みのモデルの読み込み
  //ぐー・ちょき・ぱーの取得
  model = await tmImage.load(modelURL, metadataURL);
  maxPredictions = model.getTotalClasses();
}

async function image() {
  console.log("start init");

  const modelURL = URL + "model.json";
  const metadataURL = URL + "metadata.json";

  // load the model and metadata
  // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
  // or files from your local hard drive
  // Note: the pose library adds "tmImage" object to your window (window.tmImage)
  //学習済みのモデルの読み込み
  //ぐー・ちょき・ぱーの取得
  model = await tmImage.load(modelURL, metadataURL);
  maxPredictions = model.getTotalClasses();

  //Webカメラの起動準備
  console.log("Webcam Setup");
  const flip = true; // whether to flip the webcam
  webcam = new tmImage.Webcam(400, 450, flip); // width, height, flip

  //webカメラの画像を画面に表示
  await webcam.setup(); // request access to the webcam
  await webcam.play();

  //アニメーションを更新するときにloopを呼び出す
  window.requestAnimationFrame(loop);

  // append elements to the DOM
  document.getElementById("player1_video").appendChild(webcam.canvas);
  labelContainer = document.getElementById("label-container");
  for (let i = 0; i < maxPredictions; i++) {
    // and class labels
    labelContainer.appendChild(document.createElement("div"));
  }

  console.log("end init.");
}

//モデルを繰り返し実行する
async function loop() {
  let mark, hand_num;

  webcam.update(); // update the webcam frame
  // await predict(mark, hand_num);
  await predict();

  // if (mark == 1) {
  //   console.log("[loop]mark:", mark);
  // } else if (mark == 0) {
  //   console.log("[loop]mark:", mark);
  // } else {
  //   console.log("[loop]mark:", mark);
  // }
  window.requestAnimationFrame(loop);
}

// run the webcam image through the image model
//予測モデルの実行
// async function predict(mark, hand_num) {
async function predict() {
  // console.log("predict func");
  // predict can take in an image, video or canvas html element
  const prediction = await model.predict(webcam.canvas);

  // let hand_num = 0;
  let handValue = [0, 0, 0];

  //markの初期化
  // mark = 0;

  //gu,cho,parの手のprobabilityを表示
  for (let i = 0; i < maxPredictions; i++) {
    const name = prediction[i].className;
    handValue[i] = prediction[i].probability.toFixed(2);
    const classPrediction = name + ": " + handValue[i];

    //HTMLに反映
    labelContainer.childNodes[i].innerHTML = classPrediction;

    //maxValueが1だったら(手が確定したら)
  }

  // console.log(handValue[0], handValue[1], handValue[2]);

  $("#draw").on("click", function () {
    // alert("on");
  });

  //処理を止める（？）

  //自分の手を確定
}

//カメラをストップ
function stopCamera() {
  webcam.stop();
  window.cancelAnimationFrame(frame);
}

//janken
function janken(player1_hand_num) {
  let com_id_num = 0;

  console.log("in-janken:" + player1_hand_num);

  //player1の手のimgを表示
  console.log("handchange");
  if (player1_hand_num == 0) {
    $(".player1_hand").children("img").attr("src", "./img/gu.png");
    // $(".player1_hand").attr("src", "./img/gu.png");
  }
  if (player1_hand_num == 1) {
    $(".player1_hand").children("img").attr("src", "./img/cho.png");
    // $(".player1_hand").attr("src", "./img/gu.png");
  }
  if (player1_hand_num == 2) {
    $(".player1_hand").children("img").attr("src", "./img/par.png");
    // $(".player1_hand").attr("src", "./img/gu.png");
  }

  // PCの手を確定
  //  PCの手を決める乱数
  com_hand_num = Math.floor(Math.random() * 3);

  //PCの手を表示
  if (com_hand_num == 0) {
    // $("#gu_btn_2").toggleClass("btn-push");
    $(".player2_hand").children("img").attr("src", "./img/gu.png");
  }
  if (com_hand_num == 1) {
    // $("#cho_btn_2").toggleClass("btn-push");
    $(".player2_hand").children("img").attr("src", "./img/cho.png");
  }
  if (com_hand_num == 2) {
    // $("#par_btn_2").toggleClass("btn-push");
    $(".player2_hand").children("img").attr("src", "./img/par.png");
  }

  //勝敗判定
  if (player1_hand_num == com_hand_num) {
    hantei_num = 0; //0はあいこ
  } else if (player1_hand_num == 0 && com_hand_num == 1) {
    hantei_num = 1; //グーとチョキ。1は私の勝ち
  } else if (player1_hand_num == 1 && com_hand_num == 2) {
    hantei_num = 1; //チョキとパー。1は私の勝ち
  } else if (player1_hand_num == 2 && com_hand_num == 0) {
    hantei_num = 1; //パーとグー。1は私の勝ち
  } else {
    hantei_num = 2; //他のケースではコンピュータの勝ち
  }

  //勝敗表示

  //カメラおふ・読み込み停止
}
