<template>
	<view class="listpage">
    <view class="title">选择游戏</view>
    <ul class="game_list">
      <li v-for="item in gameList" :key="item.id" @click="playGame(item)">
        <img :src="item.img" alt="">
      </li>
    </ul>
  </view>
</template>

<script setup>
import {ref} from 'vue';

const gameList = ref([
  {id: 1,img: "../../static/imgs/game1.png"},
  {id: 2,img: "../../static/imgs/game2.jpg"},
  {id: 3,img: "../../static/imgs/game3.jpg", path: "/pages/fjdz/index"},
])

const playGame = (item) => {
  console.log("xxxx", uni)
  uni.navigateTo({
    url: item.path || '/pages/developing/index'
  })
}
</script>

<style lang="scss" scoped>
.listpage{
  width: 100vw;
  height: 100vh;
  background: #22252e;
  .title{
    text-align: center;
    color: #fff;
    font-weight: 600;
    font-size: 32px;
    padding-top: 200px;
    margin-bottom: 40px;
  }
  .game_list{
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 32px;
    li{
      width: 335px;
      height: 425px;
      border-radius: 10px;
      overflow: hidden;
      cursor: pointer;
      img{
        width: 100%;
        height: 100%;
        transition: .3s;
      }
      &:hover{
        img{
          transform: scale(1.1);
          transform-origin: center center;
        }
      }
    }
  }
}
</style>