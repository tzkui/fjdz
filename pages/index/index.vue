<template>
	<view class="fjyx">
		<view class="" v-if="!isGame">
			<button @click="beginGame">开始游戏</button>
		</view>
		<view class="gameBox" v-if="isGame">
			<canvas canvas-id="gameCanvas" width="100vw" height="100vh"></canvas>
		</view>
	</view>
</template>

<script setup>
	import {
		nextTick,
		ref
	} from 'vue';
	import {
		bg_img
	} from './mock.js'

	const isGame = ref(false)
	let ctx = null;
	const plane = {
		x: 1
	}
	const beginGame = () => {
		isGame.value = true;
		startGame()
	}
	const startGame = () => {
		ctx = uni.createCanvasContext("gameCanvas");
		nextTick(()=>{
			
			ctx.drawImage(bg_img, 0, 0);
			ctx.draw()
		})
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
		}
	}
</style>