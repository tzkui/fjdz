<template>
	<view class="fjyx">
		<view class="" v-if="!isGame">
			<button @click="beginGame">开始游戏</button>
		</view>
		<view class="gameBox" v-if="isGame">
			<canvas canvas-id="gameCanvas" width="100vw" height="100vh"></canvas>
			<view class="words" ref="wordsRef">
				<view class="words_box">
					<ul class="words_list" :style="{ transform: 'translateX(' + translateX + 'px)' }">
						<li class="words_item" v-for="(item, idx) in wordsList" :key="idx">
							<view :class="{
								single_word: true,
								active: idx === xIndex && index === yIndex,
								error: inputError
							}" v-for="(word, index) in item" :key="index">
								{{ word }}
							</view>
						</li>
					</ul>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import {
	nextTick,
	ref
} from 'vue';
import {
	bg_img,
	wordsMock1,
	playerPlane,
	enemyPlane
} from './mock.js'

const wordsRef = ref()
const wordsList = ref(wordsMock1);
const xIndex = ref(0)
const yIndex = ref(0)
const isGame = ref(false)
const score = ref(100)
const inputError = ref(false)
let ctx = null;
let drawTimer = null;
const beginGame = () => {
	isGame.value = true;
	startGame()
}
const translateX = ref(0)
const startGame = () => {
	ctx = uni.createCanvasContext("gameCanvas");
	let bgHeight = 2880; // 背景图片的高度
	let yPosition = 0; // 背景图片的当前y坐标
	nextTick(() => {
		drawTimer = setInterval(() => {
			ctx.drawImage(bg_img, 0, yPosition);
			ctx.drawImage(bg_img, 0, yPosition - bgHeight); // 在底部绘制一个新的背景图
			ctx.drawImage(playerPlane, window.innerWidth / 2 - 70 , window.innerHeight-400)
			yPosition += 2; // 每次循环背景向上滚动2px

			// 如果背景图片滚动完毕，重置背景位置
			if (yPosition >= bgHeight) {
				yPosition = 0; // 重置背景位置
			}

			ctx.draw();

		}, 10)
	})
	document.addEventListener("keyup", function (e) {
		if (isGame.value) {
			let input = e.key;
			if (input === wordsList.value[xIndex.value][yIndex.value]) {
				if (wordsList.value[xIndex.value].length <= yIndex.value + 1) {
					xIndex.value++;
					yIndex.value = 0;
					console.log("xxxx", xIndex.value, wordsList)
					if (xIndex.value >= wordsList.value.length) {
						youWin()
					}
				} else {
					yIndex.value++
				}
				nextTick(() => {
					const { x, width } = document.querySelector(".words").getBoundingClientRect()
					let centerAddress = x + width / 2;
					let nowDom = document.querySelector(".single_word.active")
					let nowAddress = nowDom.getBoundingClientRect();
					console.log(nowAddress)
					if (nowAddress.left > centerAddress) {
						translateX.value = width / 2 - nowDom.offsetLeft
					}
				})
			} else {
				inputError.value = true;
				score.value -= 10;
				if (score.value <= 0) {
					gameOver()
				}
				setTimeout(() => {
					inputError.value = false;
				}, 50)
			}
		}
	})
}
const youWin = () => {                                                        
	xIndex.value = 0;
	yIndex.value = 0
}
const gameOver = () => {
	clearInterval(drawTimer)
	isGame.value = false;
}
</script>

<style scoped lang="scss">
.fjyx {
	width: 100vw;
	height: 100vh;

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
				transition: .2s;
			}

			&_item {
				display: flex;
				align-items: center;
				gap: 2px;

			}

			.single_word {
				min-width: 17px;
				height: 50px;
				line-height: 50px;
				text-align: center;
				font-size: 32px;
				color: #fff;

				&.active {
					background: rgba(255, 255, 255, 0.4);

					&.error {
						background: none;
						color: rgba(255, 0, 0, 0.4)
					}
				}
			}
		}
	}
}
</style>