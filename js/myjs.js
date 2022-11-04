// alert("kore");

$(".start_button").on("click", function () {
  let player1_hand_num = 0; //自分の手の初期値
  // alert("kore");

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

  $(".player1_view").html('<div id="player1_video"></div>');
  $(".player2_view").children("img").attr("src", filename);

  //画像認識(init ~ predictまで)
  image();
  // camera_on();

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
let model, webcam, labelContainer, maxPredictions;

function _canvasUpdate() {
  canvasCtx.drawImage(video, 0, 0, canvas.width, canvas.height);
  requestAnimationFrame(_canvasUpdate);
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

//let marker = 0; //markerの初期値
let marker = 0;

//モデルを繰り返し実行する
async function loop() {
  webcam.update(); // update the webcam frame
  window.requestAnimationFrame(loop);

  let hand_num = await predict(); //predictの戻り値を格納。
  console.log("hand_num:" + hand_num);

  if (hand_num == 99) {
    window.requestAnimationFrame(loop); //hand_numが99だったらloopを続ける
  } else {
    console.log("end loop: " + marker); //markerが0以外だったらloopを抜ける
    // window.cancelAnimationFrame(loop);
  }

  //じゃんけん実行
  // janken(hand_num);
}

// run the webcam image through the image model
//予測モデルの実行
async function predict() {
  // console.log("predict func");
  // predict can take in an image, video or canvas html element
  const prediction = await model.predict(webcam.canvas);

  let hand = "";
  let hand_num = 0;
  let maxValue = 0;
  let count = 0;

  //gu,cho,parの手のprobabilityを表示
  for (let i = 0; i < maxPredictions; i++) {
    const name = prediction[i].className;
    const tmpValue = prediction[i].probability.toFixed(2);
    const classPrediction = name + ": " + tmpValue;

    //HTMLに反映
    labelContainer.childNodes[i].innerHTML = classPrediction;
    if (maxValue < tmpValue) {
      //もしtmpValueのほうが大きかったら
      maxValue = tmpValue; //maxValueの値を更新。
      hand_num = i; //その時のiをhand_numとする。
    }

    // if (i % 3 == 2) {
    //   count += 1;
    // }
  }

  //maxValueが1だったら(手が確定したら)
  if (maxValue == 1) {
    hand = prediction[hand_num].className; //手が確定
    return hand_num;
  } else {
    return 99; //そうじゃなかったら99を返す
  }

  //じゃんけん実行
  // janken(hand_num);
  // console.log("koko");

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
