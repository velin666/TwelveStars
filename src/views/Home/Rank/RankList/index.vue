<template>
  <div
    class="RankList"
    :class="[
      'decor' + ((tabIndex === 1 ? Math.floor(rankIndex / 2) : rankIndex) + 1),
      tabIndex === 2 ? 'room-style' : '',
    ]"
  >
    <TableList
      :list-data="resActRank.rankList || []"
      :page="resActRank.pageNum"
      :show-topic="tabIndex === 1 && resActRank.pageNum === 1 ? 'topic-tri' : ''"
      scroll-to-top
      user-visible
    >
      <!-- 前三 -->
      <template #topicList="{ item }">
        <img class="avatar" :src="item.imgUrl || unknownIcon" alt="" />
        <div class="detail">
          <div class="score">
            <p>{{ item.score || 0 }}</p>
            <div
              v-if="tabIndex === 1 && item.dataId && item.dataId !== resActRank.baseInfo.dataId"
              class="btn"
              @click="openSendDialog(item.dataId || 0)"
            ></div>
          </div>
          <div class="info">
            <p>昵称:{{ omitValue(item.name || '虚位以待', 5) }}</p>
            <p>ID:{{ item.dataId ? item.dataId + 10000 : 0 }}</p>
          </div>
        </div>
      </template>
      <!-- 列表 -->
      <template #tableList="{ item }">
        <div class="avatar">
          <p class="rank">第{{ item.rank }}名</p>
          <img :src="item.imgUrl" alt="" />
        </div>
        <div class="detail">
          <p class="text">
            {{ tabIndex === 1 ? '昵称' : '房间' }}:<span>{{
              omitValue(item.name || '虚位以待', 5)
            }}</span>
          </p>
          <p class="text">
            ID: <span>{{ item.dataId + 10000 }}</span>
          </p>
        </div>
        <div class="value">
          <div class="score">
            <p>
              {{ tabIndex === 1 ? (Math.floor(rankIndex / 2) ? '星辰' : '星际') : '宇宙' }}值:{{
                item.score || 0
              }}
            </p>
          </div>
          <img
            src="@/assets/btn/send-btn.png"
            alt=""
            class="btn"
            @click="tabIndex === 1 ? openSendDialog(item.dataId || 0) : toRoom(item.dataId)"
          />
        </div>
      </template>
      <!-- 页脚 -->
      <template #footer>
        <Pagination
          v-model:page="resActRank.pageNum"
          :total-page="resActRank.totalPage || 1"
          @reload-list="getRankInfo"
        >
          <template #prev>
            <p class="btn-wrap">上一页</p>
          </template>
          <template #next>
            <p class="btn-wrap">下一页</p>
          </template>
        </Pagination>
      </template>
      <!-- 用户信息 -->
      <template #user>
        <div
          class="user-frame"
          :class="[
            'decor' + ((tabIndex === 1 ? Math.floor(rankIndex / 2) : rankIndex) + 1),
            tabIndex === 2 ? 'room-style' : '',
          ]"
        >
          <div class="avatar">
            <p class="id">
              ID:{{ resActRank.baseInfo.dataId ? resActRank.baseInfo.dataId + 10000 : 0 }}
            </p>
            <img :src="resActRank.baseInfo.imgUrl || unknownIcon" alt="" />
          </div>
          <div class="detail">
            <p class="text">
              {{ tabIndex === 1 ? '昵称' : '房间' }}:<span>{{ resActRank.baseInfo.name }}</span>
            </p>
            <p class="text">
              {{ rankIndex % 2 ? '总榜' : '日榜' }}:
              <span>{{
                resActRank.baseInfo.rank
                  ? resActRank.baseInfo.rank > 50
                    ? '50+'
                    : resActRank.baseInfo.rank
                  : '暂无排名'
              }}</span>
            </p>
          </div>
          <div class="value">
            <p class="label">
              {{ tabIndex === 1 ? (Math.floor(rankIndex / 2) ? '星辰' : '星际') : '宇宙' }}值
            </p>
            <div class="score">
              <p>{{ resActRank.baseInfo.score || 0 }}</p>
            </div>
            <p class="distance">
              距离{{
                resActRank.baseInfo.rank && resActRank.baseInfo.rank <= 50 ? '上一名' : '上榜'
              }}:<span>{{ resActRank.baseInfo.distanceScore || 0 }}</span>
            </p>
          </div>
        </div>
      </template>
    </TableList>

    <!-- 送礼弹框 -->
    <Model v-model="dialog.sendDialog">
      <div class="send-dialog">
        <img src="@/assets/text/send-title.png" alt="" class="title" />
        <p class="base-tips">
          <img src="@/assets/icon/white-star.png" alt="" />给对方赠以下礼物可以增加{{
            Math.floor(rankIndex / 2) ? '星辰' : '星际'
          }}值哦~<img src="@/assets/icon/white-star.png" alt="" />
        </p>

        <swiper
          effect="coverflow"
          :slides-per-view="2.5"
          centered-slides
          :coverflow-effect="{
            rotate: 60,
            slideShadows: false,
          }"
          @slide-change="(swiper: SwiperType) => (dialog.sendIndex = swiper.activeIndex)"
          :modules="[EffectCoverflow]"
          class="gift-list"
        >
          <swiper-slide v-for="(item, index) in resBaseGift" :key="index + 'gift'">
            <div class="gift-item" @click="dialog.sendIndex = index">
              <div class="gift-frame" :class="{ active: index === dialog.sendIndex }">
                <img :src="item.vgImg" alt="" />
              </div>
              <p class="name">{{ item.vgName }}</p>
            </div>
          </swiper-slide>
        </swiper>
        <p class="input-tips">请输入数量:</p>
        <InputNumber v-model="dialog.count">
          <template #reduce>
            <img src="@/assets/icon/reduce-icon.png" alt="" />
          </template>
          <template #add>
            <img src="@/assets/icon/add-icon.png" alt="" />
          </template>
        </InputNumber>
        <div class="btn-wrapper" @click="sending">
          <p>确认赠送</p>
        </div>
        <img
          src="@/assets/icon/close-icon.png"
          alt=""
          class="close-icon"
          @click="dialog.sendDialog = false"
        />
      </div>
    </Model>
  </div>
</template>

<script setup lang="ts">
// Import Swiper Vue.js components
import { Swiper, SwiperSlide } from 'swiper/vue'
// import required modules
import { EffectCoverflow } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/effect-fade'

import { baseKey } from '@/views/data'
import InputNumber from '@/components/InputNumber/index.vue'
//
import { omitValue } from '@/util'
//
import unknownIcon from '@/assets/icon/unknown-icon.png'
import { roomRank, userRank } from '@/views/mock'

/**
 * 初始化
 */
const { rankIndex } = defineProps<{ rankIndex: number }>()
/** 通用请求hooks */
const { showToast } = useTools()
const { resActRank } = usePublicRequest()
const { tabIndex, resBaseGift } = inject(baseKey)!

/**
 * 榜单信息相关
 */
/** 获取榜单信息 */
const getRankInfo = () =>
  setTimeout(() => {
    resActRank.value = tabIndex.value === 2 ? roomRank : userRank
  })
// getActRank({
//   pageNum: resActRank.value.pageNum || 1,
//   pageSize: resActRank.value.pageSize || 10,
//   rankCategory: tabIndex.value === 2 ? 2 : Math.floor(rankIndex / 2) ? 1 : 3,
//   type: Number(!(rankIndex % 2)),
// })

getRankInfo()

const toRoom = (id: number) => {
  showToast('模拟跳转房间打榜~')
}

/**
 * 弹框
 */
/** 弹框信息 */
const dialog = reactive({
  /** 送礼 */
  sendDialog: false,
  /** 赠送uid */
  toUid: 0,
  /** 选择礼物下标 */
  sendIndex: 0,
  /** 送礼数量 */
  count: 1,
})

const openSendDialog = (toUid: number) => {
  dialog.sendIndex = 0
  dialog.count = 1
  dialog.toUid = toUid
  dialog.sendDialog = true
}

/** 打榜 */
const sending = () => {
  if (!dialog.count) return showToast('请输入有效数量~')
  setTimeout(() => {
    showToast('赠送成功~')
    dialog.sendDialog = false
    setTimeout(() => {
      getRankInfo()
    }, 800)
  }, 50)
}
</script>

<style scoped lang="less">
.RankList {
  position: relative;
  .flex-column;
  :deep(.Table) {
    width: 100%;
    // .bg-normal('@/assets/bg/topic-bg.png', 3.35rem 3.75rem);
    .topic-tri {
      margin: 0.15rem 0;
      width: 3.2rem;
      .topic-item {
        position: relative;
        .flex-column;
        &::before {
          content: '';
          width: 0.27rem;
          height: 0.64rem;
          position: absolute;
          z-index: 3;
          transform-origin: center top;
          animation: badge-show 0.3s 0.5s 1 both;
          @keyframes badge-show {
            0% {
              transform: scaleY(0);
            }
            100% {
              transform: scaleY(1);
            }
          }
        }
        .detail {
          .flex-column;
          .ab-X;
          .score {
            position: relative;
            .flex-center;
            &::before {
              content: '';
              .ab2-Y;
              left: -0.1rem;
            }
          }
          .info {
            margin-top: 0.08rem;
            position: relative;
            .flex-centerColumn;
            &::before {
              background: linear-gradient(0deg, #28007b 0%, #4b68f1 100%);
              border: 0.01rem solid #ffffff;
              mask-image: linear-gradient(
                90deg,
                rgba(0, 0, 0, 0) 0%,
                rgba(255, 255, 255, 0.8) 20% 80%,
                rgba(0, 0, 0, 0) 100%
              );
              mask-size: 100%;
              .ab2-center;
              content: '';
            }
            > p {
              position: relative;
              z-index: 2;
              font-size: 0.11rem;
              font-family: Source Han Serif CN;
              font-weight: 800;
              font-style: italic;
              color: #ffffff;
            }
          }
        }
        &:nth-child(1) {
          margin: 0.29rem 0 0.32rem;
          &::before {
            right: 0.55rem;
            top: -0.25rem;
            .bg-normal('@/assets/bg/rank1.png');
          }
          &::after {
            content: '';
            width: 2.38rem;
            height: 1.03rem;
            .ab-X(2);
            top: 0;
            .bg-normal('@/assets/icon/ring-decor.png');
            animation: ring-ring 0.7s linear infinite alternate;
            @keyframes ring-ring {
              0% {
                opacity: 0.6;
                filter: drop-shadow(0 0 0 #fff);
              }
              100% {
                opacity: 1;
                filter: drop-shadow(0 0 0.04rem #fff);
              }
            }
          }
          .detail {
            transform: translateX(-0.02rem);
            top: -0.32rem;
            width: 2.64rem;
            height: 2.19rem;
            .bg-normal('@/assets/bg/top1-frame.png');
            .score {
              margin-top: 1.4rem;
              width: 1.11rem;
              height: 0.28rem;
              .bg-normal('@/assets/bg/rank-name1.png');
              > p {
                font-size: 0.13rem;
                font-family: Source Han Serif CN;
                font-weight: 800;
                font-style: italic;
                color: #ffffff;
                .word-stroke(#E9581E);
              }
              .btn {
                .ab2-Y;
                right: -0.3rem;
                width: 0.61rem;
                height: 0.31rem;
                .bg-normal('@/assets/btn/send-btn1.png');
              }
            }
            .info {
              height: 0.4rem;
              &::before {
                width: 1.86rem;
                height: 0.4rem;
              }
            }
          }
          .avatar {
            .round(1.01rem);
          }
        }
        &:nth-child(2),
        &:nth-child(3) {
          margin: 0.82rem 0 0.5rem;
          .avatar {
            .round(0.79rem);
          }
          .detail {
            .score {
              width: 0.89rem;
              height: 0.22rem;
              > p {
                font-size: 0.09rem;
                font-family: Source Han Serif CN;
                font-weight: 800;
                font-style: italic;
                color: #ffffff;
              }
              .btn {
                .ab2-Y;
                right: -0.2rem;
                width: 0.49rem;
                height: 0.24rem;
                .bg-normal('@/assets/btn/send-btn2.png');
              }
            }
            .info {
              height: 0.36rem;
              &::before {
                width: 1.44rem;
                height: 0.36rem;
              }
              > p {
                font-size: 0.09rem;
              }
            }
          }
        }
        &:nth-child(2) {
          &::before {
            right: -0.05rem;
            top: -0.2rem;
            .bg-normal('@/assets/bg/rank2.png');
          }
          .detail {
            transform: translateX(-0.08rem);
            top: -0.2rem;
            width: 1.71rem;
            height: 1.48rem;
            .bg-normal('@/assets/bg/top2-frame.png');
            .score {
              margin-top: 1.02rem;
              .bg-normal('@/assets/bg/rank-name2.png');
              > p {
                .word-stroke(#A534D9);
              }
            }
          }
        }
        &:nth-child(3) {
          &::before {
            right: 0.08rem;
            top: -0.2rem;
            .bg-normal('@/assets/bg/rank3.png');
          }
          .detail {
            top: -0.1rem;
            width: 1.35rem;
            height: 1.37rem;
            .bg-normal('@/assets/bg/top3-frame.png');
            .score {
              margin-top: 0.95rem;
              .bg-normal('@/assets/bg/rank-name3.png');
              > p {
                .word-stroke(#913b15);
              }
            }
          }
        }
      }
    }
    .table-list {
      margin-top: 0.2rem;
      .table-item {
        width: 3.15rem;
        height: 0.97rem;
        box-sizing: border-box;
        padding-top: 0.08rem;
        .flex-center;
        .avatar {
          margin-left: 0.42rem;
          position: relative;
          .rank {
            .ab2-X(2);
            bottom: -0.15rem;
            .flex-center;
            width: 0.56rem;
            height: 0.19rem;
            font-size: 0.08rem;
            font-family: Adobe Heiti Std;
            font-weight: 600;
            font-style: italic;
            color: #a12b1c;
            .bg-normal('@/assets/bg/table-rank-bg.png');
          }
          &::before {
            content: '';
            .ab2-X;
            top: -0.05rem;
            width: 0.74rem;
            height: 0.59rem;
            .bg-normal('@/assets/bg/rank-avatar.png');
            // animation: bb-rotate 1s ease-in-out infinite alternate;
          }
          > img {
            transform: translateX(0.02rem);
            .round(0.39rem);
          }
        }
        .detail {
          flex-grow: 1;
          text-align: left;
          margin-left: 0.18rem;
          .text {
            margin: 0.02rem 0;
            font-size: 0.1rem;
            font-family: Source Han Serif CN;
            font-weight: 200;
            font-style: italic;
            color: #ffffff;
            > span {
              font-weight: 600;
            }
          }
        }
        .value {
          .flex-column;
          margin-right: 0.24rem;
          .score {
            margin-top: 0.1rem;
            position: relative;
            .flex-center;
            padding: 0 0.1rem 0 0.12rem;
            height: 0.14rem;
            box-sizing: border-box;
            &::before {
              .ab2-center;
              content: '';
              width: 0.73rem;
              height: 0.14rem;
              border: 0.01rem solid #ffffff;
              mask-image: linear-gradient(
                90deg,
                rgba(0, 0, 0, 0) 0%,
                rgba(255, 255, 255, 0.8) 50%,
                rgba(0, 0, 0, 0) 100%
              );
              mask-size: 100%;
            }
            // &::after {
            //   content: '';
            //   .ab2-Y(2);
            //   left: -0.1rem;
            // }
            > p {
              position: relative;
              z-index: 2;
              font-size: 0.09rem;
              font-family: Source Han Serif CN;
              font-weight: 500;
              font-style: italic;
              color: #ffffff;
            }
          }
          .btn {
            margin-top: 0.02rem;
            width: 0.63rem;
            height: 0.24rem;
          }
        }
      }
    }
    .Pagination {
      margin: 0.2rem 0 0.65rem;
      .btn {
        opacity: 0.5;
        .btn-wrap {
          width: 0.95rem;
          height: 0.26rem;
          .bg-normal('@/assets/bg/page-btn.png');
          .flex-center;
          font-size: 0.1rem;
          font-family: Source Han Serif CN;
          font-weight: bold;
          font-style: italic;
          color: #ffffec;
        }
        &.active {
          opacity: 1;
        }
      }
      .page {
        font-size: 0.14rem;
        font-weight: 400;
        color: #ffffff;
        margin: 0 0.2rem 0.04rem;
      }
    }
  }
  &.decor1 {
    :deep(.Table) {
      .topic-tri {
        .topic-item {
          .detail {
            .score {
              &::before {
                .bg-normal('@/assets/icon/decor-ball1.png');
              }
            }
          }
          &:nth-child(1) {
            .detail {
              .score {
                &::before {
                  width: 0.32rem;
                  height: 0.22rem;
                }
              }
            }
          }
          &:nth-child(2),
          &:nth-child(3) {
            .detail {
              .score {
                &::before {
                  width: 0.25rem;
                  height: 0.18rem;
                }
              }
            }
          }
        }
      }
      .table-list {
        .table-item {
          .bg-normal('@/assets/bg/rank-personal-bg.png');
          .value {
            .score {
              &::before {
                background: #6b3ef3;
              }
              &::after {
                width: 0.21rem;
                height: 0.16rem;
                .bg-normal('@/assets/icon/decor-ball1.png');
              }
            }
          }
        }
      }
    }
  }
  &.decor2 {
    :deep(.Table) {
      .topic-tri {
        .topic-item {
          .detail {
            .score {
              &::before {
                .bg-normal('@/assets/icon/decor-ball2.png');
              }
            }
          }
          &:nth-child(1) {
            .detail {
              .score {
                &::before {
                  width: 0.34rem;
                  height: 0.31rem;
                }
              }
            }
          }
          &:nth-child(2),
          &:nth-child(3) {
            .detail {
              .score {
                &::before {
                  width: 0.24rem;
                  height: 0.22rem;
                }
              }
            }
          }
        }
      }
      .table-list {
        .table-item {
          .bg-normal('@/assets/bg/rank-room-bg.png');
          .value {
            .score {
              &::before {
                background: #445fe8;
              }
              &::after {
                width: 0.24rem;
                height: 0.22rem;
                .bg-normal('@/assets/icon/decor-ball1.png');
              }
            }
          }
        }
      }
    }
  }
  &.room-style {
    :deep(.Table) {
      .table-list {
        .table-item {
          .value {
            .score {
              &::after {
                left: -0.2rem;
                top: 0.05rem;
                width: 0.45rem;
                height: 0.28rem;
                .bg-normal('@/assets/icon/decor-ball3.png');
              }
            }
          }
        }
      }
    }
  }
}
.user-frame {
  position: relative;
  width: 3.75rem;
  height: 1.17rem;
  transform: translateY(0.06rem);
  .flex-center;
  box-sizing: border-box;
  padding-top: 0.2rem;
  .avatar {
    margin-left: 0.51rem;
    position: relative;
    .id {
      .ab2-X(2);
      bottom: -0.15rem;
      .flex-center;
      width: 0.56rem;
      height: 0.19rem;
      font-size: 0.07rem;
      font-family: Adobe Heiti Std;
      font-weight: 600;
      font-style: italic;
      color: #a12b1c;
      .bg-normal('@/assets/bg/table-rank-bg.png');
    }
    &::before {
      content: '';
      .ab2-X;
      top: -0.05rem;
      width: 0.74rem;
      height: 0.59rem;
      .bg-normal('@/assets/bg/rank-avatar.png');
      // animation: bb-rotate 1s ease-in-out infinite alternate;
    }
    > img {
      transform: translateX(0.02rem);
      .round(0.39rem);
    }
  }
  .detail {
    flex-grow: 1;
    text-align: left;
    margin-left: 0.24rem;
    margin-top: 0.1rem;
    .text {
      margin: 0.02rem 0;
      font-size: 0.1rem;
      font-family: Source Han Serif CN;
      font-weight: 200;
      font-style: italic;
      color: #ffffff;
      > span {
        font-weight: 600;
      }
    }
  }
  .value {
    .flex-column;
    margin-right: 0.24rem;
    .label {
      font-size: 0.08rem;
      font-family: Source Han Serif CN;
      font-weight: 500;
      font-style: italic;
      color: #ffffff;
    }
    .score {
      position: relative;
      .flex-center;
      padding: 0 0.1rem 0 0.12rem;
      width: 0.8rem;
      height: 0.17rem;
      box-sizing: border-box;
      &::before {
        .ab2-center;
        content: '';
        width: 0.8rem;
        height: 0.17rem;
        border: 0.01rem solid #ffffff;
        mask-image: linear-gradient(90deg, rgba(255, 255, 255, 0.8) 50%, rgba(0, 0, 0, 0) 100%);
        mask-size: 100%;
      }
      &::after {
        content: '';
        .ab2-Y(2);
        left: -0.1rem;
      }
      > p {
        position: relative;
        z-index: 2;
        font-size: 0.11rem;
        font-family: Source Han Serif CN;
        font-weight: 500;
        font-style: italic;
        color: #ffffff;
      }
    }
    .distance {
      margin-top: 0.1rem;
      font-size: 0.1rem;
      font-family: Source Han Serif CN;
      font-weight: 200;
      font-style: italic;
      color: #ffffff;
      > span {
        font-weight: 500;
      }
    }
  }
  &.decor1 {
    .bg-normal('@/assets/bg/user-personal-bg.png');
    .value {
      .score {
        &::before {
          background: #6b3ef3;
        }
        &::after {
          width: 0.21rem;
          height: 0.16rem;
          .bg-normal('@/assets/icon/decor-ball1.png');
        }
      }
    }
  }
  &.decor2 {
    .bg-normal('@/assets/bg/user-room-bg.png');
    .value {
      .score {
        &::before {
          background: #0f3299;
        }
        &::after {
          width: 0.24rem;
          height: 0.22rem;
          .bg-normal('@/assets/icon/decor-ball2.png');
        }
      }
    }
  }
  &.room-style {
    .value {
      .score {
        &::after {
          top: 0.06rem;
          left: -0.22rem;
          width: 0.56rem;
          height: 0.35rem;
          .bg-normal('@/assets/icon/decor-ball3.png');
        }
      }
    }
  }
}
.send-dialog {
  .base-dialog;
  .title {
    width: 1.48rem;
    height: 0.51rem;
  }
  .base-tips {
    margin-top: 0.08rem;
    .decor {
      content: '';
      .ab-X;
      .linear-bg(#EBD8FF);
      width: fit-content;
      .flex-center;
      width: 2.7rem;
      height: 0.01rem;
    }
    &::before {
      .decor;
      top: 0;
    }
    &::after {
      .decor;
      bottom: 0;
    }
    .flex-center;
    width: 2.7rem;
    height: 0.17rem;
    .linear-bg(#5821d0, 40% 60%);
    font-size: 0.09rem;
    font-family: Source Han Serif CN;
    font-weight: 300;
    color: #ffffff;
    position: relative;
    > img {
      position: absolute;
      z-index: 1;
      width: 0.12rem;
      height: 0.17rem;
      top: 0.02rem;
      &:first-of-type {
        left: 0.2rem;
      }
      &:last-of-type {
        right: 0.2rem;
      }
    }
  }
  .gift-list {
    margin-top: 0.1rem;
    width: 2.9rem;
    .gift-list-style;
    .swiper-slide {
      padding: 0.15rem 0;
      .gift-item {
        filter: brightness(0.5);
        transition:
          filter 0.3s,
          transform 0.3s;
      }
      &.swiper-slide-active {
        .gift-item {
          filter: brightness(1);
          transform: scale(1.2);
        }
      }
    }
  }
  .input-tips {
    font-size: 0.1rem;
    font-family: Source Han Serif CN;
    font-weight: 200;
    font-style: italic;
    color: #ffffff;
  }
  :deep(.inputNum-container) {
    margin: 0.05rem 0 0.14rem;
    .btn {
      .ab2-Y;
      > img {
        width: 0.71rem;
        height: 0.76rem;
      }
      &.reduce-btn {
        left: -0.55rem;
      }
      &.add-btn {
        right: -0.55rem;
      }
    }
    .reduce-btn,
    .add-btn {
      transition: filter 0.3s;
      &.deactive {
        filter: brightness(0.5);
      }
    }
    .input-num {
      width: 1.3rem;
      height: 0.32rem;
      border: 0.01rem solid #ffec95;
      background: linear-gradient(0deg, #0e0a53 0%, #4017a9 99%);
      font-size: 0.13rem;
      font-family: Source Han Serif CN;
      font-weight: 400;
      font-style: italic;
      color: #ffffff;
    }
  }
  .btn-wrapper {
    .btn-style;
  }
}
</style>
