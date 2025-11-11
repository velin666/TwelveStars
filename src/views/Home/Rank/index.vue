<template>
  <div class="Rank">
    <!-- 礼物展示 -->
    <div class="gift-show"></div>
    <CommonFrame class="rank-zone" :title="tabIndex === 1 ? 'person-rank' : 'room-rank'">
      <div v-if="tabIndex === 2 && roomBaseInfo.dataId" class="self-room-info">
        <div class="base-tips">
          <p>每满足{{ roomBaseInfo.earnBarrageValue }}宇宙值可由房主发首屏弹幕</p>
        </div>
        <div class="self-info">
          <div class="avatar">
            <img :src="roomBaseInfo.imgUrl" alt="" />
            <div class="id">ID:{{ roomBaseInfo.dataId }}</div>
          </div>
          <div class="detail">
            <p class="name">
              房间名:<span>{{ roomBaseInfo.name }}</span>
            </p>
            <div class="btn" @click="roomBaseInfo.barrageNum && openBulletDialog()">
              发送弹幕 <span>{{ roomBaseInfo.barrageNum }}次</span>
            </div>
          </div>
          <div class="send">
            <p class="label">宇宙值:</p>
            <div class="score">
              <p>
                {{ roomBaseInfo.score }}
              </p>
            </div>
          </div>
        </div>
      </div>
      <!-- 个人tab栏 -->
      <div class="tab-bar" v-if="tabIndex === 1">
        <div class="tab-personal" v-for="item in 2" :key="item + 'tab'">
          <div
            class="tab-detail"
            v-for="val in Array(2)
              .fill('')
              .map((_, i) => (item - 1) * 2 + i)"
            :key="val + 'detail'"
            :class="{ active: val === rankIndex }"
            @click="tabSwitch(val)"
          >
            <div class="tab-text" :class="'rank' + (val + 1)">
              <p></p>
            </div>
            <div class="tab-text act" :class="'rank' + (val + 1)">
              <p></p>
            </div>
            <div class="guild">
              <img src="@/assets/tab/guild-icon.png" alt="" />
            </div>
          </div>
        </div>
      </div>
      <!-- 房间tab栏 -->
      <div class="tab-zone" v-else>
        <div
          class="tab-bar"
          v-for="(item, index) in ['房间日榜', '房间总榜']"
          :key="index"
          @click="tabSwitch(index)"
        >
          <div class="tab-item" :class="{ active: index === rankIndex }">
            <p>{{ item }}</p>
          </div>
        </div>
      </div>
      <!-- 主信息展示 -->
      <div class="data-zone">
        <transition :name="tabAnimate">
          <RankList :rank-index="rankIndex" :key="rankIndex" />
        </transition>
      </div>
    </CommonFrame>
    <!-- 奖励展示 -->
    <Reward :rank-index="rankIndex" />

    <!-- 发弹幕弹框 -->
    <Model v-model="dialog.bulletDialog">
      <div class="bullet-dialog">
        <img src="@/assets/text/send-bullet.png" alt="" class="title" />
        <div class="room-info">
          <img class="avatar" :src="roomBaseInfo.imgUrl" alt="" />
          <div class="detail">
            <p class="label">房间昵称:</p>
            <p class="name">{{ roomBaseInfo.name }}</p>
          </div>
          <img class="star-icon" src="@/assets/icon/white-star.png" alt="" />
        </div>
        <div class="input-zone">
          <textarea
            type="text"
            v-model="dialog.content"
            maxlength="15"
            placeholder="输入你的房间弹幕吧，最多15个字"
          />
        </div>
        <div class="btn-zone">
          <div class="btn-wrapper" @click="dialog.bulletDialog = false">
            <p>取消</p>
          </div>
          <div class="btn-wrapper" @click="bulletSending">
            <p>发送</p>
          </div>
        </div>
        <img
          src="@/assets/icon/close-icon.png"
          alt=""
          class="close-icon"
          @click="dialog.bulletDialog = false"
        />
      </div>
    </Model>
  </div>
</template>

<script setup lang="ts">
import CommonFrame from '@/views/components/CommonFrame.vue'
import RankList from './RankList/index.vue'
import Reward from './Reward/index.vue'
//
import { baseKey } from '@/views/data'
import { useBullet } from '@/stores/bullet'
import { roomBarrageInfo } from '@/views/mock'

interface IRoomBaseInfo {
  /** 弹幕可发送次数 */
  barrageNum: number
  /** 获取一次弹幕所需的宇宙值 */
  earnBarrageValue: number
  /** 房间Id */
  dataId: number
  /** 房间名 */
  name: string
  /** 房间头像 */
  imgUrl: string
  /** 房间分数 */
  score: number
}

const rankIndex = ref(0)
const tabAnimate = ref('tab-l')
const { tabIndex } = inject(baseKey)!
const { showToast } = useTools()
const { setBullet } = useBullet()

/**
 * @description: 切换tab
 * @param {*} tabIndex 下标idx
 * @return {*}
 */
const tabSwitch = (idx: number): void => {
  if (rankIndex.value === idx) {
    return
  }
  tabAnimate.value = rankIndex.value > idx ? 'tab-r' : 'tab-l'
  rankIndex.value = idx
}

/** 房间基本信息 */
const roomBaseInfo = ref<IRoomBaseInfo>({
  barrageNum: 0,
  earnBarrageValue: 0,
  dataId: 0,
  name: '',
  imgUrl: '',
  score: 0,
})

const getRoomBaseInfo = () => {
  setTimeout(() => {
    roomBaseInfo.value = roomBarrageInfo
  }, 50)
}

if (tabIndex.value === 2) getRoomBaseInfo()

/**
 * 弹框
 */
/** 弹框信息 */
const dialog = reactive({
  /** 送礼 */
  bulletDialog: false,
  /** 弹幕信息 */
  content: '',
})

const openBulletDialog = () => {
  dialog.content = ''
  dialog.bulletDialog = true
}

const bulletSending = () => {
  if (!dialog.content) return showToast('请输入有效内容~')

  setTimeout(() => {
    showToast('弹幕发送成功~')
    dialog.bulletDialog = false
    setBullet({
      barrage: dialog.content,
      roomId: roomBaseInfo.value.dataId,
      roomImg: roomBaseInfo.value.imgUrl,
    })
    getRoomBaseInfo()
  }, 50)
}
</script>

<style scoped lang="less">
.Rank {
  position: relative;
  .gift-show {
    width: 4.03rem;
    height: 3.88rem;
    position: relative;
    .bg-normal('@/assets/bg/gift-main.png');
    &::before {
      content: '';
      .ab-X;
      top: 0;
      width: 1.69rem;
      height: 0.56rem;
      .bg-normal('@/assets/text/gift-title.png');
    }
  }
  .rank-zone {
    margin-top: 0.2rem;
    .self-room-info {
      .flex-column;
      .base-tips {
        margin-top: 0.7rem;
        width: 2.17rem;
        height: 0.14rem;
        .flex-center;
        position: relative;
        &::before {
          width: 2.17rem;
          height: 0.14rem;
          background: #411a8f;
          border: 0.01rem solid #ffffff;
          mask-image: linear-gradient(
            90deg,
            rgba(0, 0, 0, 0) 0%,
            rgba(255, 255, 255, 0.8) 35% 65%,
            rgba(0, 0, 0, 0) 100%
          );
          mask-size: 100%;
          .ab2-center;
          content: '';
        }
        > p {
          position: relative;
          z-index: 2;
          font-size: 0.08rem;
          font-family: Source Han Serif CN;
          font-weight: 500;
          font-style: italic;
          color: #f6f4da;
        }
      }
      .self-info {
        margin-top: 0.15rem;
        position: relative;
        width: 2.65rem;
        height: 0.79rem;
        margin-left: 0.46rem;
        padding-bottom: 0.15rem;
        box-sizing: border-box;
        .bg-normal('@/assets/bg/self-room-bg.png');
        .flex-center;
        .avatar {
          position: absolute;
          z-index: 1;
          top: 0.05rem;
          left: -0.24rem;
          > img {
            .round(0.5rem);
          }
          &::before {
            content: '';
            position: absolute;
            z-index: 1;
            left: -0.34rem;
            width: 1.07rem;
            height: 0.94rem;
            top: -0.17rem;
            .bg-normal('@/assets/bg/self-room-avatar.png');
          }
          .id {
            .bg-normal('@/assets/bg/self-room-id.png');
            .ab2-X(2);
            bottom: -0.12rem;
            width: 0.65rem;
            height: 0.16rem;
            .flex-center;
            font-size: 0.07rem;
            font-family: Source Han Serif CN;
            font-weight: bold;
            font-style: italic;
            color: #ffffff;
            .word-stroke(#E9581E);
          }
        }
        .detail {
          margin-left: 0.5rem;
          flex-grow: 1;
          text-align: left;
          .name {
            margin-left: 0.05rem;
            font-size: 0.09rem;
            font-family: Source Han Serif CN;
            font-weight: 400;
            font-style: italic;
            color: #f6f4da;
            .word-stroke(#9034b2);
            > span {
              font-size: 0.1rem;
              font-weight: 600;
            }
          }
          .btn {
            margin-top: 0.04rem;
            width: 0.81rem;
            height: 0.33rem;
            .bg-normal('@/assets/btn/bullet-btn.png');
            .flex-center;
            font-size: 0.09rem;
            font-family: Source Han Serif CN;
            font-weight: 800;
            font-style: italic;
            color: #b03202;
            > span {
              font-size: 0.08rem;
            }
          }
        }
        .send {
          .flex-column;
          margin-right: 0.17rem;
          .label {
            font-size: 0.08rem;
            font-family: Source Han Serif CN;
            font-weight: 500;
            font-style: italic;
            color: #f6f4da;
          }
          .score {
            margin-top: 0.04rem;
            .flex-center;
            position: relative;
            box-sizing: border-box;
            width: 0.74rem;
            &::before {
              width: 0.74rem;
              height: 0.14rem;
              background: #300878;
              border: 0.01rem solid #ffffff;
              mask-image: linear-gradient(
                90deg,
                rgba(0, 0, 0, 0) 0%,
                rgba(255, 255, 255, 0.8) 40% 60%,
                rgba(0, 0, 0, 0) 100%
              );
              mask-size: 100%;
              .ab2-Y;
              left: 0;
              content: '';
            }
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
        }
      }
    }
    .flex-column;
    .tab-bar {
      .flex-center;
      margin-top: 0.5rem;
      .tab-personal {
        .bg-normal('@/assets/tab/rank-tab-bg.png');
        position: relative;
        width: 1.6rem;
        height: 0.6rem;
        margin: 0 0.01rem;
        .flex-center;
        box-sizing: border-box;
        padding-top: 0.03rem;
        &::before {
          content: '';
          .ab-X(2);
          top: 0.03rem;
          width: 0.24rem;
          height: 0.23rem;
          .bg-normal('@/assets/tab/tab-decor.png');
        }
        .tab-detail {
          width: 0.7rem;
          height: 0.35rem;
          position: relative;
          .flex-center;
          .guild {
            .ab-X;
            width: 0.17rem;
            height: 0.15rem;
            bottom: -0.2rem;
            // transform-style: preserve-3d;
            // transform-origin: center bottom;
            > img {
              opacity: 0;
              width: 0.17rem;
              height: 0.15rem;
              // animation: pointer-end 0.5s ease-out 1;
              // @keyframes pointer-end {
              //   0% {
              //     opacity: 1;
              //   }
              //   100% {
              //     transform: rotateY(1.25turn);
              //   }
              // }
              transition:
                transform 0.3s,
                opacity 0.3s;
              transform: translateY(0.1rem) scale(0.3, 1.2);
              opacity: 0;
            }
          }
          each(range(4), {
          .rank@{value} {
            >p {
              .bg-normal('@/assets/tab/rank@{value}.png');
            }
            &.act {
              > p {
                background-image: url('@/assets/tab/rank@{value}-active.png');
              }
            }
          }
        });
          .tab-text {
            width: 0.65rem;
            height: 0.35rem;
            position: relative;
            transition: mask 0.4s;
            .flex-center;
            > p {
              width: 0.54rem;
              height: 0.17rem;
            }
            &.act {
              .ab-Y;
              width: 0.78rem;
              box-sizing: border-box;
            }
          }
          .mask-style(@i) {
            mask-image: url('@/assets/tab/tab-mask@{i}.png');
            mask-size: 0.78rem 0.35rem;
            mask-position: if((@i = 1), -0.78rem, 0.78rem) 0;
            mask-repeat: no-repeat;
            .bg-normal('@/assets/tab/rank-active-bg.png', 1.4rem 0.35rem);
            background-position: if((@i = 1), left, right) center;
          }
          &:first-child {
            .tab-text.act {
              .mask-style(1);
              left: 0;
              padding-right: 0.08rem;
            }
          }
          &:last-child {
            .tab-text.act {
              .mask-style(2);
              right: 0;
              padding-left: 0.08rem;
            }
          }
          &.active {
            .tab-text.act {
              mask-position: 0rem 0;
            }
            .guild > img {
              // animation: pointer-start 0.5s ease-out 1,
              //   pointer-rotate 2s linear 0.5s infinite;
              // opacity: 1;
              // @keyframes pointer-start {
              //   0% {
              //     opacity: 0;
              //     transform: rotateY(-0.25turn);
              //   }
              //   100% {
              //     transform: rotateY(1turn);
              //   }
              // }
              // @keyframes pointer-rotate {
              //   100% {
              //     transform: rotateY(1turn);
              //   }
              // }
              transform: translateY(0);
              opacity: 1;
            }
          }
        }
      }
    }
    .tab-zone {
      .flex-center;
      margin-top: 0.2rem;
      width: 3.2rem;
      height: 0.61rem;
      .bg-normal('@/assets/bg/tab-dark-bg.png', 100% 100%);
      .tab-bar {
        margin: 0 0.03rem;
        width: 1.39rem;
        height: 0.52rem;
        .bg-normal('@/assets/tab/handbook-tab-bg.png');
        .flex-center;
        .tab-item {
          .flex-center;
          width: 1.07rem;
          height: 0.3rem;
          margin-top: 0.03rem;
          position: relative;
          &::before {
            content: '';
            .ab-center;
            width: 1.07rem;
            height: 0.3rem;
            .bg-normal('@/assets/tab/handbook-tab-active.png');
            transform: scale(0);
            transition: transform 0.3s;
          }
          > p {
            position: relative;
            z-index: 2;
            font-size: 0.13rem;
            font-family: Source Han Serif CN;
            font-weight: 600;
            font-style: italic;
            color: #ffffff;
            .word-stroke(#6b31dd);
            transition:
              color 0.3s,
              text-shadow 0.3s;
          }
          &.active {
            &::before {
              transform: scale(1);
            }
            > p {
              color: #b53c0c;
              .word-stroke(#FFFFFF);
            }
          }
        }
      }
    }
  }
  .data-zone {
    position: relative;
    width: 100vw;
    > div {
      width: 100vw;
    }
  }
}

.bullet-dialog {
  .base-dialog;
  .title {
    width: 1.43rem;
    height: 0.54rem;
  }
  .room-info {
    margin-left: 0.45rem;
    .decor {
      content: '';
      .ab-X;
      .linear-bg(#EBD8FF, 20%);
      width: fit-content;
      .flex-center;
      width: 2.24rem;
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
    margin-top: 0.2rem;
    width: 2.24rem;
    height: 0.41rem;
    .linear-bg(#5821d0, 20% 50%);
    position: relative;
    .avatar {
      .ab2-Y;
      left: -0.3rem;
      .round(0.59rem);
      background: #2b0f76;
      border: 0.01rem solid #ffffff;
    }
    .detail {
      margin-left: 0.45rem;
      text-align: left;
      .label {
        margin-top: 0.04rem;
        font-size: 0.1rem;
        font-family: Source Han Serif CN;
        font-weight: 300;
        font-style: italic;
        color: #ffffff;
      }
      .name {
        font-size: 0.12rem;
        font-family: Source Han Serif CN;
        font-weight: 600;
        font-style: italic;
        color: #ffffff;
      }
    }
    .star-icon {
      .ab-Y;
      width: 0.12rem;
      height: 0.17rem;
      right: 0.2rem;
    }
  }
  .input-zone {
    margin: 0.17rem 0 0.28rem;
    box-sizing: border-box;
    padding: 0.2rem 0.1rem;
    width: 2.49rem;
    height: 1.15rem;
    border: 0.01rem solid #ffffff;
    background: rgba(23, 11, 77, 0.75);
    border-radius: 0.05rem;
    .flex-center;
    > textarea {
      width: 100%;
      height: 100%;
      text-align: left;
    }
  }
  .btn-zone {
    .flex-center;
    .btn-wrapper {
      .btn-style;
    }
  }
}
</style>
