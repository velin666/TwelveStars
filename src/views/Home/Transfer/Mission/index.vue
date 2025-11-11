<template>
  <CommonFrame class="Mission" title="daily-mission">
    <div class="task-list">
      <div class="task-item" v-for="(item, index) in taskInfo" :key="index">
        <div class="base-info">
          <div class="task-name">
            <p class="name">
              {{ item.taskName }} (
              <span>
                {{
                  item.totalStep === -1 ? '无上限' : `${item.finishStep}/${item.totalStep}`
                }} </span
              >)
            </p>
          </div>
          <div class="task-process" v-if="item.rateValue > 1">
            进度条:
            <div class="process-bar">
              <div class="bar-line">
                <p
                  :style="{
                    maskPosition: `-${(1 - item.valueCnt / item.rateValue) * 0.85}rem center`,
                  }"
                ></p>
              </div>
            </div>
            {{ item.valueCnt }}/{{ item.rateValue }}
          </div>
        </div>
        <img
          v-if="item.taskId === 1 && item.totalStep !== item.finishStep"
          src="@/assets/icon/sign-icon.png"
          alt=""
          class="state-icon"
          @click="signInTask"
        />
        <img
          v-else-if="item.totalStep === item.finishStep"
          src="@/assets/icon/finish-icon.png"
          alt=""
          class="state-icon"
        />
        <img
          v-else-if="item.totalStep !== -1"
          src="@/assets/icon/unfinish-icon.png"
          alt=""
          class="state-icon"
        />
      </div>
    </div>
  </CommonFrame>
</template>

<script setup lang="ts">
import CommonFrame from '@/views/components/CommonFrame.vue'
import { taskInfoData } from '@/views/mock'
// type
interface ITaskInfo {
  /**  */
  taskId: number
  /** 任务名 */
  taskName: string
  /**
   * 每日可完成次数
   * -1代表可无限完成
   * 该值为1代表只可完成一次
   */
  totalStep: number
  /** 已完成次数 */
  finishStep: number
  /**
   * 完成多少次视为完成一次任务
   * 该值为1代表1次就完成(甚至不需要进度条)
   */
  rateValue: number
  /** 本轮任务进度 */
  valueCnt: number
}

/**
 * 初始化
 */
const { showToast } = useTools()

/**
 * 任务信息
 */
const taskInfo = ref<ITaskInfo[]>([])

const getTaskInfo = () =>
  setTimeout(() => {
    taskInfo.value = taskInfoData
  }, 50)
getTaskInfo()

/** 任务签到 */
const signInTask = () =>
  setTimeout(() => {
    showToast('签到成功~')
    taskInfoData[0].finishStep = 1
    getTaskInfo()
  }, 50)
</script>

<style scoped lang="less">
.Mission {
  margin-top: 0.15rem;
  position: relative;

  .title {
    width: 1.28rem;
    height: 0.55rem;
  }

  .task-list {
    margin: 0.45rem 0 0.65rem;

    .task-item {
      width: 3.13rem;
      height: 0.72rem;
      .bg-normal('@/assets/bg/mission-bg.png');
      .flex-center;
      box-sizing: border-box;

      .base-info {
        flex-grow: 1;
        margin-left: 0.25rem;

        .task-name {
          .flex-start;

          .name {
            text-align: left;
            font-size: 0.13rem;
            font-family: Source Han Serif CN;
            font-weight: 800;
            font-style: italic;
            color: #ffffff;
            .word-stroke(#4200cb);
            flex-grow: 1;
            > span {
              color: #fdff30;
            }
          }
        }

        .task-process {
          margin-top: 0.04rem;
          .flex-start;
          font-size: 0.09rem;
          font-family: Source Han Serif CN;
          font-weight: 400;
          font-style: italic;
          color: #ffffff;

          .process-bar {
            flex-shrink: 0;
            margin: 0 0.02rem;
            width: 0.89rem;
            height: 0.06rem;
            .flex-center;
            .bg-normal('@/assets/bg/process-bg.png');

            .bar-line {
              .size() {
                width: 0.85rem;
                height: 0.04rem;
                mask-image: url('@/assets/bg/process-mask.png');
                mask-size: 0.85rem 0.04rem;
                mask-repeat: no-repeat;
              }

              mask-position: center;
              .size;

              > p {
                .size;
                background: linear-gradient(-90deg, #dbe3ff 1%, #6db5ff 99%);
              }
            }
          }
        }
      }

      .state-icon {
        .rect(0.34rem);
        margin-right: 0.24rem;
      }
    }
  }
}
</style>
