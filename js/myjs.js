// alert("kore");

$(".start_button").on("click", function () {
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

  $(".player1_bg").children("img").attr("src", "./img/soraha.png");
  $(".player2_bg").children("img").attr("src", filename);

  $(".player1_view").html('<video id="player1_video"></video>');

  const video = document.getElementById("player1_video");
  navigator.mediaDevices
    .getUserMedia({
      video: true,
      audio: false,
    })
    .then((stream) => {
      video.srcObject = stream;
      video.play();
    })
    .catch((e) => {
      console.log(e);
    });
});
