// alert("kore");

var hantei_num = 0; //結果判定の条件分岐に使う数値
var my_id = 0; //自分が出した手のid
var my_id_num = 0; //自分が出した手のid_num
var com_id_num = 0; //コンピュータが出した手のid_num

//グー、チョキ、パーの文字列を入れた配列を作る
let hand_id = [`gu_btn`, `cho_btn`, `par_btn`];
let hand = [`グー`, `チョキ`, `パー`];
let hantei = [`あいこ`, `あなたの勝ち`, `コンピュータの勝ち`];

//じゃんけん回数のカウント
var push_count = 0;

//startボタンが押されたら画像を表示
$(".start-button").on("click", function () {
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

  $(".me_bg").children("img").attr("src", "./img/soraha.png");
  $(".princess_bg").children("img").attr("src", filename);
});

//グー、チョキ、パーのいずれかのボタンが押されたら実行
$(".trigger").on("click", function () {
  //じゃんけんの回数をカウント
  push_count += 1;
  console.log("push_count:", push_count);

  // 自分の手
  //押されたボタンのIDを取得
  my_id = $(this).attr("id");

  //押されたボタンを押したままにする
  $(this).toggleClass("btn-push");

  if (my_id == "gu_btn_1") {
    my_id_num = "0";
    $(".me-img").children("img").attr("src", "./img/gu_me.png");
    // $("#cho_btn_1").removeClass();

    console.log("remove?");
  }
  if (my_id == "cho_btn_1") {
    my_id_num = "1";
    $(".me-img").children("img").attr("src", "./img/cho_me.png");
  }
  if (my_id == "par_btn_1") {
    my_id_num = "2";
    $(".me-img").children("img").attr("src", "./img/par_me.png");
    console.log("pc img changed");

    // $("#pc_hand #gu_btn")
    //   .toggleClass("btn-disabled")
    //   .css(`pointer-events`, `none`)
    //   .attr(`tabindex`, -1);
    // $("#pc_hand #par_btn")
    //   .toggleClass("btn-disabled")
    //   .css(`pointer-events`, `none`)
    //   .attr(`tabindex`, -1);
  }

  //  PCの手を決める乱数
  com_id_num = Math.floor(Math.random() * 3);

  //PCの手のボタンを押された状態にする
  //IDの指定を配列でできたらかっこいい
  if (com_id_num == 0) {
    $("#gu_btn_2").toggleClass("btn-push");
    $(".pc-img").children("img").attr("src", "./img/gu_princess.png");
  }
  if (com_id_num == 1) {
    $("#cho_btn_2").toggleClass("btn-push");
    $(".pc-img").children("img").attr("src", "./img/cho_princess.png");
  }
  if (com_id_num == 2) {
    $("#par_btn_2").toggleClass("btn-push");
    $(".pc-img").children("img").attr("src", "./img/par_princess.png");
  }

  //私とcomputerのid_numと出した手を確認。
  console.log(`my_id_num:${my_id_num}, my_hand: ${hand[my_id_num]}`);
  console.log(`com_id_num:${com_id_num}, com_hand: ${hand[com_id_num]}`);

  //勝負判定
  if (my_id_num == com_id_num) {
    hantei_num = 0; //0はあいこ
  } else if (my_id_num == 0 && com_id_num == 1) {
    hantei_num = 1; //グーとチョキ。1は私の勝ち
  } else if (my_id_num == 1 && com_id_num == 2) {
    hantei_num = 1; //チョキとパー。1は私の勝ち
  } else if (my_id_num == 2 && com_id_num == 0) {
    hantei_num = 1; //パーとグー。1は私の勝ち
  } else {
    hantei_num = 2; //他のケースではコンピュータの勝ち
  }

  //コンソール上で判定結果とnumを確認。
  console.log(`hantei_num:${hantei_num}, 判定：${hantei[hantei_num]}`);

  //結果をHTML状に反映。
  $("#judgement").text(`${hantei[hantei_num]}`);

  $(".reset").on("click", function () {
    return;
  });
});

//押されたボタンの解除
$(".reset").on("click", function () {
  console.log("removeClass");

  /*私の手のボタンを押すクラスをなくす*/
  $("#gu_btn_1").removeClass("btn-push");
  $("#cho_btn_1").removeClass("btn-push");
  $("#par_btn_1").removeClass("btn-push");

  /*PCの手のボタンを押すクラスをなくす*/
  $("#gu_btn_2").removeClass("btn-push");
  $("#cho_btn_2").removeClass("btn-push");
  $("#par_btn_2").removeClass("btn-push");
});
