<template>
  <div class="Demo">
    <div class="infinite-container">
      <div class="userList-container" v-infinite-scroll="getUserList">
        <div
          class="user-items"
          v-for="(item, index) in userListData.list"
          :key="index"
        >
          <p>{{ index }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const allList = [
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
]
const userListData: any = reactive({
  page: 1,
  totalPage: 4,
  list: [],
})

const getUserList = () => {
  console.log('更新列表')
  if (userListData.page >= userListData.totalPage) return
  const page = userListData.page + 1
  const spliceList = [...allList].splice(0, page * 5)
  userListData.page = page
  userListData.list = spliceList
  console.log(userListData.list)
}

onMounted(() => {
  userListData.list = [...allList].splice(0, 5)
})
</script>

<script lang="ts">
export default {
  name: 'infinite-scroll',
}
</script>

<style scoped lang="less">
li {
  list-style: none;
}

.infinite-container {
  ul {
    margin: 0 auto;
    width: 2.45rem;
    height: 2rem;
    overflow: hidden scroll;
  }

  li {
    width: 100%;
    height: 0.7rem;
    line-height: 0.7rem;
    text-align: center;
    &:nth-child(odd) {
      background-color: antiquewhite;
    }

    &:nth-child(even) {
      background-color: burlywood;
    }
  }
}

.userList-container {
  margin: 0 auto;
  width: 3.5rem;
  height: 2.4rem;
  background: #fff;

  .user-items {
    margin-bottom: 0.05rem;
    width: 100%;
    height: 0.54rem;
    background-color: lightgray;
  }
}
</style>
