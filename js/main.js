const size = 700;
const initialLength = 7;

// 餌の分増える
const extensionLength = 10;
// プレイヤーのポジションの点
const mousePositionList = [];
// プレイヤーの幅
let mouseWidth = 8;


// mx, my 自分自身の位置（canvasの中心）
let mx = size / 2;
let my = size / 5;
// プレイヤーのスピードと角度
let speed = 2.5;
let angle = 90;
// 操作の動き
let move = 0;
// コンテキストは初期値空にしとく
let ctx = null;

// えさ(チーズ)
let fx = 0;
let fy = 0;

let gameover = false;

// 初期値設定
const init = () => {
  // canvasをIDから取得
  const canvas = document.getElementById("canvas");
  // 描画用のコンテキスト取得(なんかcanvas描画に使うみたい)CanvasRenderingContext2D(以降CRC2D)っていうのを使いますよ
  ctx = canvas.getContext("2d");

  for(let i = 0; i < initialLength; i++) {
    mousePositionList.push([mx, my])
  }

  document.getElementById("left").onpointerdown = (e) => {
    // preventDefaultはデフォルトのイベント動作をキャンセルするためのメソッド
    e.preventDefault();
    move = -1;
  }
  document.getElementById("right").onpointerdown = (e) => {
    e.preventDefault();
    move = 1;
  }

  document.onpointerup = (e) => {
    e.preventDefault();
    move = 0;
  }

}

// レンダリング用関数
const render = () => {
  // fillStyleはCRC2Dのプロパティ塗りつぶし
  ctx.fillStyle = "#000"
  // ctx.fillStyle = "rgba(0, 0, 0, 0)"
  // ctx.fillStyle = "rgba(" + [255, 255, 255, 0.5] + ")"
  // ctx.fillStyle = url(./img/S__101638181.jpg);
  // fullRect(始点x, 始点y, width, height);
  ctx.fillRect(0, 0, size, size);

  if(gameover) {
    ctx.fillStyle = "#800"
  } else {
    ctx.fillStyle = "#c0c0c0"
  }

  // プレイヤー描画
  // ctx.fillStyle = "#c0c0c0"
  for(let i = 0; i < mousePositionList.length; i++) {
    const [x, y] = mousePositionList[i];
    // CRC2Dの描画始める宣言
    ctx.beginPath();
    // 円をかく
    // ctx.arc(x,y,radius,startAngle,endAngle)
    // xy半径、radius青木型の描画領域、startAngle=0,endAngle=360で円。ただし弧度法。
    ctx.arc(x, y, mouseWidth, 0, Math.PI*2)
    ctx.fill();
  }

  // えさかく
  ctx.fillStyle = "#ffd61a"
  // ctx.fillStyle = `hsl(${Math.random() * 360}deg,100%, 50%)`;
  ctx.beginPath();
  ctx.moveTo(fx, fy);
  ctx.arc(fx, fy, 30, 0, Math.PI/4)
  ctx.fill();

  // 左目
  const lex = mx + Math.cos((angle - 50) * Math.PI / 180) * mouseWidth * 0.5;
  const ley = my + Math.sin((angle - 50) * Math.PI / 180) * mouseWidth * 0.5;
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.arc(lex, ley, mouseWidth * 0.3, 0, Math.PI*2);
  ctx.fill();
  ctx.fillStyle = "#000";
  ctx.beginPath();
  ctx.arc(lex, ley, mouseWidth * 0.2, 0, Math.PI*2);
  ctx.fill();

  // 右目
  const rex = mx + Math.cos((angle + 50) * Math.PI / 180) * mouseWidth * 0.5;
  const rey = my + Math.sin((angle + 50) * Math.PI / 180) * mouseWidth * 0.5;
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.arc(rex, rey, mouseWidth * 0.3, 0, Math.PI*2);
  ctx.fill();
  ctx.fillStyle = "#000";
  ctx.beginPath();
  ctx.arc(rex, rey, mouseWidth * 0.2, 0, Math.PI*2);
  ctx.fill();

  // 左耳
  const leax = mx + Math.cos((angle - 130) * Math.PI / 180) * mouseWidth * 1;
  const leay = my + Math.sin((angle - 130) * Math.PI / 180) * mouseWidth * 1;
  ctx.fillStyle = "#777777";
  ctx.beginPath();
  ctx.arc(leax, leay, mouseWidth * 0.7, 0, Math.PI*2);
  ctx.fill();


  // 右耳
  const reax = mx + Math.cos((angle + 130) * Math.PI / 180) * mouseWidth * 1;
  const reay = my + Math.sin((angle + 130) * Math.PI / 180) * mouseWidth * 1;
  ctx.fillStyle = "#777777";
  ctx.beginPath();
  ctx.arc(reax, reay, mouseWidth * 0.7, 0, Math.PI*2);
  ctx.fill();

  // 鼻
  const rnx = mx + Math.cos((angle + 0) * Math.PI / 180) * mouseWidth * 1;
  const rny = my + Math.sin((angle + 0) * Math.PI / 180) * mouseWidth * 1;
  ctx.fillStyle = "#000";
  ctx.beginPath();
  ctx.arc(rnx, rny, mouseWidth * 0.2, 0, Math.PI*2);
  ctx.fill();


};

const checkCollision = () => {
  if(mx < mouseWidth || mx >= size - mouseWidth || my < mouseWidth || my >= size - mouseWidth){
    gameover = true;
  }

  // えさ、一定の範囲内で食べたことにしてfx=0にして描画し直す。
  if ( (fx - mx) ** 2 + (fy - my) ** 2 < (mouseWidth * 2 + 4) ** 2) {
    fx = 0;
    mouseWidth += 5;
    speed += 0.4;

    // const lastPos = mousePositionList[0];
    // for(let i = 0; i < extensionLength; i++) {
    //   mousePositionList.unshift(lastPos);
    // }
    return;
  }

};

const update = () => {
  angle += move * 5;
  // speed*cos(angle)→X座標成分
  // speed*sin(angle)→Y座標成分
  mx += Math.cos(angle*Math.PI / 180) * speed;
  my += Math.sin(angle*Math.PI / 180) * speed;

  mousePositionList.push([mx, my]);
  mousePositionList.shift();

  checkCollision();
}




// ロード繰り返す
window.onload = async () => {
  init();
  while (true) {
    if(fx === 0) {
      fx = Math.random() * (size - mouseWidth * 2) + mouseWidth;
      fy = Math.random() * (size - mouseWidth * 2) + mouseWidth;
    }
    render();
    if(gameover) {
      return;
    }
    update();
    await new Promise((r) => setTimeout(r,16));
  }
};
