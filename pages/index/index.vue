<template>
  <view class="fjyx">
    <view class="" v-if="gameState === 0">
      <video :src="videoSrc" autoplay loop muted :controls="false"></video>
      <div class="logo">
        <img src="../../static/imgs/big-game-title.png" alt="" />
      </div>
      <div class="begin_game" @click="beginGame">开始游戏</div>
    </view>
    <view class="gameBox" v-else>
      <canvas canvas-id="gameCanvas" width="100vw" height="100vh"></canvas>
      <view class="words" ref="wordsRef">
        <view class="words_box">
          <ul
            class="words_list"
            :style="{ transform: 'translateX(' + translateX + 'px)' }"
          >
            <li
              :class="{
                words_item: true,
                passed: idx < xIndex,
                failed: enemyList[idx]?.failed,
              }"
              v-for="(item, idx) in wordsList"
              :key="idx"
            >
              <view
                :class="{
                  single_word: true,
                  active: idx === xIndex && index === yIndex,
                  error: inputError,
                }"
                v-for="(word, index) in item"
                :key="index"
              >
                {{ word }}
              </view>
            </li>
          </ul>
        </view>
      </view>
      <ul class="states">
        <li class="states_item">
          <view class="states_item_label">生命</view>
          <view class="states_item_val">{{ health }}</view>
        </li>
        <li class="states_item">
          <view class="states_item_label">得分</view>
          <view class="states_item_val">{{ score }}</view>
        </li>
        <li class="states_item">
          <view class="states_item_label">时间</view>
          <view class="states_item_val">{{ gameTime }}</view>
        </li>
      </ul>
      <div class="pause" @click="pauseGame">暂停</div>
    </view>
    <view class="failpage" v-show="gameState === 3">
      <img class="failpage_icon" src="../../static/imgs/faile_bg.svg" alt="" />
      <view class="failpage_item">你输了</view>
      <view class="failpage_item">最终得分: {{ score }}</view>
      <view class="button" @click="resetGame">重新开始</view>
      <view class="button" @click="exitGame">退出游戏</view>
    </view>
    <view class="failpage" v-show="gameState === 4">
      <img
        class="failpage_icon"
        src="../../static/imgs/success-title.svg"
        alt=""
      />
      <view class="failpage_item">你赢了</view>
      <view class="failpage_item">最终得分: {{ score }}</view>
      <view class="button" @click="resetGame">重新开始</view>
      <view class="button" @click="exitGame">退出游戏</view>
    </view>
    <view class="pausepage" v-show="gameState === 2">
      <img class="pausepage_icon" src="../../static/imgs/pause.svg" alt="" />
      <view class="button" @click="continueGame">继续游戏</view>
      <view class="button" @click="resetGame">重新开始</view>
      <view class="button" @click="exitGame">退出游戏</view>
    </view>
  </view>
</template>

<script setup>
import { nextTick, ref, onMounted, watch } from "vue";
import {
  bg_img,
  wordsMock1,
  playerPlane,
  enemyPlane,
  bulletImg,
} from "./mock.js";

const videoSrc = ref("../../static/video/start.mp4");
// 用户飞机大小
const playerPhaneSize = {
  width: 100,
  height: 100,
};
// 敌机大小
const enemyPlaneSize = {
  width: 100,
  height: 100,
};
// 背景图大小
const bgImgSize = {
  width: 100,
  height: 100,
};
const bulletImgSize = {
  width: 20,
  height: 40,
};
const enemyList = ref([]);
const bulletList = ref([]);
const initImgSize = () => {
  let img1 = document.createElement("img");
  let img2 = document.createElement("img");
  let img3 = document.createElement("img");
  let img4 = document.createElement("img");
  img1.src = playerPlane;
  img1.onload = () => {
    playerPhaneSize.width = img1.width;
    playerPhaneSize.height = img1.height;
  };
  img2.src = enemyPlane;
  img2.onload = () => {
    enemyPlaneSize.width = img2.width;
    enemyPlaneSize.height = img2.height;
    initEnemy();
  };
  img3.src = bg_img;
  img3.onload = () => {
    bgImgSize.width = img3.width;
    bgImgSize.height = img3.height;
  };

  img4.src = bulletImg;
  img4.onload = () => {
    bulletImgSize.width = img4.width;
    bulletImgSize.height = img4.height;
  };
};
const initEnemy = () => {
  enemyList.value = [];
  wordsList.value.forEach((item, index) => {
    enemyList.value.push({
      x: parseInt(Math.random() * (window.innerWidth - enemyPlaneSize.width)),
      y: -enemyPlaneSize.height - index * 500,
      text: item,
      live: true,
      textIndex: 0,
    });
  });
};
const wordsRef = ref();
const wordsList = ref([...wordsMock1]);
const xIndex = ref(0);
const yIndex = ref(0);
const gameState = ref(0); // 0: 等待界面， 1: 游戏中， 2: 暂停， 3：游戏失败， 4：游戏胜利
const score = ref(0);
const health = ref(100);
const gameTime = ref("00:00");
const inputError = ref(false);
let ctx = null;
let drawTimer = null;
const beginGame = () => {
  videoSrc.value = "../../static/video/mist.mov";
  setTimeout(() => {
    gameState.value = 1;
    startGame();
		videoSrc.value = "../../static/video/start.mp4";
  }, 500);
};
const translateX = ref(0);
let bgYPosition = 0;
let startTimeVal = 0;
let pauseTimeVal = 0;
const startGame = () => {
  ctx = uni.createCanvasContext("gameCanvas");
  nextTick(() => {
    startTimeVal = new Date().getTime();
    drawTimer = setInterval(gameLoop, 10);
  });
};
const pauseGame = () => {
  gameState.value = 2;
  pauseTimeVal = new Date().getTime();
  clearInterval(drawTimer);
};
const continueGame = () => {
  gameState.value = 1;
  nextTick(() => {
    startTimeVal += new Date().getTime() - pauseTimeVal;
    drawTimer = setInterval(gameLoop, 10);
  });
};
const resetGame = () => {
	exitGame()
	beginGame();
};
const exitGame = () => {
  gameState.value = 0;
  clearInterval(drawTimer);
	bgYPosition = 0;
	startTimeVal = 0;
	pauseTimeVal = 0;
	translateX.value = 0
	gameTime.value = "00:00";
	score.value = 0;
	health.value = 100;
	xIndex.value = 0;
	yIndex.value = 0;
	wordsList.value = [...wordsMock1]
	initEnemy()
};
// 绘制背景
const drawBg = () => {
  ctx.drawImage(bg_img, 0, bgYPosition);
  ctx.drawImage(bg_img, 0, bgYPosition - bgImgSize.height);
  bgYPosition += 2;
  if (bgYPosition >= bgImgSize.height) {
    bgYPosition = 0;
  }
};
// 绘制用户
const drawPlayer = () => {
  ctx.drawImage(
    playerPlane,
    (window.innerWidth - playerPhaneSize.width) / 2,
    window.innerHeight - playerPhaneSize.height - 200
  );
};
// 绘制敌机
const drawEnemy = (
  enemy = {
    x: 0,
    y: 0,
    text: "apple",
    live: true,
    textIndex: 0,
  }
) => {
  ctx.drawImage(enemyPlane, enemy.x, enemy.y);
  let n = enemy.text.length;
  for (let i = 0; i < n; i++) {
    ctx.font = "30px Arial"; // 设置字体大小和字体
    if (enemy.textIndex === 0) {
      ctx.fillStyle = "#fff";
    } else if (i < enemy.textIndex) {
      ctx.fillStyle = "transparent";
    } else {
      ctx.fillStyle = "#d29831";
    }
    ctx.textAlign = "center"; // 设置文字水平居中
    ctx.textBaseline = "middle"; // 设置文字垂直居中
    ctx.fillText(
      enemy.text[i],
      enemy.x + enemyPlaneSize.width / 2 + (i - (n - 1) / 2) * 18,
      enemy.y + enemyPlaneSize.height
    );
  }
};
// 绘制子弹
const drawBullet = (
  bullet = {
    x: (window.innerWidth - bulletImgSize.width) / 2,
    y: window.innerHeight - playerPhaneSize.height - 220,
    angle: 0,
  }
) => {
  ctx.save();
  ctx.translate(bullet.x + bulletImgSize.width / 2, bullet.y);
  ctx.rotate(bullet.angle + Math.PI / 2);
  ctx.drawImage(bulletImg, 0, 0);
  // 恢复画布状态
  ctx.restore();
};
const updateWordAddress = () => {
  nextTick(() => {
    const { x, width } = document
      .querySelector(".words")
      .getBoundingClientRect();
    let centerAddress = x + width / 2;
    let nowDom = document.querySelector(".single_word.active");
    let nowAddress = nowDom.getBoundingClientRect();
    if (nowAddress.left > centerAddress) {
      translateX.value = width / 2 - nowDom.offsetLeft;
    }
  });
};
// 更新数据
const updateData = () => {
  // 敌机位置
  for (const item of enemyList.value) {
    item.y += 1;
    if (item.live && item.y > window.innerHeight - enemyPlaneSize.height - 10) {
      item.failed = true;
      item.live = false;
      xIndex.value++;
      yIndex.value = 0;
      updateWordAddress();
      health.value -= 10;
      break;
    }
    if (item.live && item.text.length <= item.textIndex) {
      item.live = false;
    }
  }

  // 子弹位置
  const speed = 10;
  bulletList.value.forEach((item, index) => {
    item.x += Math.cos(item.angle) * speed;
    item.y += Math.sin(item.angle) * speed;
    item.distance -= speed;
    if (item.distance <= 30) {
      bulletList.value.splice(index, 1);
      enemyList.value[item.target[0]].textIndex = item.target[1];
    }
  });

  // 计时器
  let nowTime = new Date().getTime();
  let disTime = nowTime - startTimeVal;
  let minute =
    parseInt(disTime / 1000 / 60) < 10
      ? "0" + parseInt(disTime / 1000 / 60)
      : parseInt(disTime / 1000 / 60);
  let second =
    parseInt((disTime / 1000) % 60) < 10
      ? "0" + parseInt((disTime / 1000) % 60)
      : parseInt((disTime / 1000) % 60);
  gameTime.value = minute + ":" + second;
};
const render = () => {
  // ctx?.clearRect(0, 0, window.innerWidth, window.innerHeight)
  drawBg();
  for (const item of bulletList.value) {
    drawBullet(item);
  }
  for (const item of enemyList.value) {
    if (
      item.live &&
      item.y + enemyPlaneSize.height > 0 &&
      item.y < window.innerHeight - enemyPlaneSize.height - 10
    ) {
      drawEnemy(item);
    }
  }
  drawPlayer();
  ctx.draw();
};
const gameLoop = () => {
  updateData();
  render();
};

const youWin = () => {
  xIndex.value = 0;
  yIndex.value = 0;
  gameState.value = 4;
};
const gameOver = () => {
  clearInterval(drawTimer);
  gameState.value = 3;
};
const bindKeyupEvent = function (e) {
  if (gameState.value === 1) {
    let input = e.key;
    if (input === wordsList.value[xIndex.value][yIndex.value]) {
      let bux = (window.innerWidth - bulletImgSize.width) / 2;
      let buy = window.innerHeight - playerPhaneSize.height - 220;
      let enemyX = enemyList.value[xIndex.value].x + enemyPlaneSize.width / 2;
      let enemyY = enemyList.value[xIndex.value].y + enemyPlaneSize.height;
      bulletList.value.push({
        x: bux,
        y: buy,
        angle: Math.atan2(enemyY - buy, enemyX - bux),
        distance: Math.sqrt(
          Math.pow(enemyY - buy, 2) + Math.pow(enemyX - bux, 2)
        ),
        target: [xIndex.value, yIndex.value + 1],
      });

      if (wordsList.value[xIndex.value].length <= yIndex.value + 1) {
        xIndex.value++;
        yIndex.value = 0;
        score.value += 10;
        if (xIndex.value >= wordsList.value.length) {
          youWin();
        }
      } else {
        yIndex.value++;
      }
      updateWordAddress();
    } else {
      health.value -= 10;
      inputError.value = true;
      setTimeout(() => {
        inputError.value = false;
      }, 200);
    }
  }
};
onMounted(() => {
  initImgSize();

  document.addEventListener("keyup", bindKeyupEvent);
});
watch(health, (val) => {
  if (val <= 0) {
    gameOver();
  }
});
</script>

<style scoped lang="scss">
.fjyx {
  width: 100vw;
  height: 100vh;
  position: relative;

  video {
    width: 100vw;
    height: 100vh;
  }

  .logo {
    position: absolute;
    left: 50%;
    top: 50px;
    transform: translateX(-50%);
  }

  .begin_game {
    width: 934px;
    height: 90px;
    background: url(../../static/imgs/space-bg.png) no-repeat;
    background-size: 100% 100%;
    text-align: center;
    line-height: 90px;
    font-size: 32px;
    position: absolute;
    left: 50%;
    bottom: 150px;
    transform: translateX(-50%);
    cursor: pointer;
    color: #fff;
  }

  .gameBox {
    width: 100vw;
    height: 100vh;

    canvas {
      width: 100%;
      height: 100%;
    }

    .words {
      width: 700px;
      height: 70px;
      background: url(/static/imgs/input-bg.svg) no-repeat;
      background-size: 100% 100%;
      position: absolute;
      bottom: 100px;
      left: 50%;
      transform: translateX(-50%);
      box-sizing: border-box;
      padding: 0 20px;

      &_box {
        width: 100%;
        height: 100%;
        overflow: hidden;
      }

      &_list {
        display: flex;
        align-items: center;
        gap: 10px;
        height: 70px;
        width: 100%;
        transition: 0.2s;
      }

      &_item {
        display: flex;
        align-items: center;
        gap: 2px;
        color: #fff;

        &.passed {
          color: rgba(249, 250, 252, 0.25);

          &.failed {
            color: rgba(229, 79, 74, 0.3);
          }
        }
      }

      .single_word {
        min-width: 17px;
        height: 50px;
        line-height: 50px;
        text-align: center;
        font-size: 32px;

        &.active {
          background: rgba(255, 255, 255, 0.4);

          &.error {
            background: none;
            color: rgba(255, 0, 0, 0.4);
          }
        }
      }
    }
  }
}

.states {
  position: absolute;
  left: 30px;
  top: 30px;
  color: #f9fcfa;

  &_item {
    display: flex;
    gap: 10px;
    font-size: 18px;
    line-height: 32px;
  }
}

.pausepage {
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.8);
  position: absolute;
  left: 0;
  top: 0;
  display: flex;
  flex-direction: column;
  align-items: center;

  &_icon {
    width: 1000px;
    margin-bottom: 30px;
    margin-top: 180px;
  }

}

.button {
    width: 220px;
    height: 30px;
    background: url(../../static/imgs/button_bg.svg) no-repeat;
    background-size: 100% 100%;
    line-height: 30px;
    text-align: center;
    color: #fff;
    cursor: pointer;
    margin:0 auto 20px;
		font-size: 16px;
  }
.pause {
  position: absolute;
  right: 20px;
  top: 20px;
  cursor: pointer;
  color: #fff;
  font-size: 28px;
}

.failpage {
  text-align: center;
  font-size: 32px;
  line-height: 72px;
  width: 100vw;
  height: 100vh;
  position: absolute;
  background: rgba(0, 0, 0, 0.5);
  left: 0;
  top: 0;

  &_icon {
    width: 1000px;
    margin-bottom: 30px;
    margin-top: 200px;
  }
}
</style>
