const DEFAULT_SESSIONID: string = (() => {
  switch (location.hostname) {
    case '192.168.11.xx':
      return ''
    default:
      return 'fc2cc092cb51a76645a4400831fd208038423c3ba39aaf0efa4d396b5263d4a49dd8a4efe80ad6ed52d58521a55dc329368e6a01fb32f74385b10eb38e045840'
  }
})()

// 获取cookie
export function getCookie(name: string): string | null {
  const reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
  const arr = document.cookie.match(reg)
  if (arr) {
    return arr[2]
  } else {
    return null
  }
}

// rem自适应
export function resizeRem(): void {
  // let gScale: number = 1;
  let winWidth = 0
  if (window.innerWidth) {
    winWidth = window.innerWidth
  } else if (document.body && document.body.clientWidth) {
    winWidth = document.body.clientWidth
  }

  // if (winWidth > 750) {
  //   winWidth = 750;
  // }
  // gScale = winWidth / 375;
  const fontSize = winWidth / 3.75
  const myHtml = document.querySelector('html')!
  myHtml.style.fontSize = fontSize + 'px'
}

/**
 * @description: 十位数转换
 * @param {number} val 输入数字
 * @return {*}
 */
export const tenDigit = (val: number): string | number =>
  val < 10 ? '0' + val : val + ''

/**
 * @description: 处理数值展示
 */
export function fixNumber(num: number, custom?: string): string | number {
  return num.toString().length > 8
    ? (num / 100000000).toFixed(1) + '亿'
    : num.toString().length > 4
      ? (num / 10000).toFixed(1) + `${custom ? custom : '万'}`
      : num
}
/**
 * @description: 省略过长名称
 */
export function omitValue(val = '', len = 8): string {
  return val.length > len ? val.slice(0, len) + '…' : val
}
// 获取SessionId
export const getSessionId = (): string | null =>
  import.meta.env.DEV
    ? GetQueryString('devToken') || DEFAULT_SESSIONID
    : getCookie('sessionActId')
/**
 * @description: 大于一万加单位
 * @param {number} num
 * @return {*}
 */
export const unitExchange = (num: number): number | string =>
  num > 10000 ? Math.floor(num / 100) / 100 + 'w' : num

// 设置cookie
type cookie = (cName: string, value?: string, exdate?: Date) => void

export const setCookie: cookie = function (cName, value, exdate) {
  document.cookie =
    cName +
    '=' +
    escape(value || '') +
    (exdate == null ? '' : ';expires=' + (exdate ? exdate.toUTCString() : '0'))
}

export function setSessionId(sessionId: string): void {
  setCookie('sessionActId', sessionId)
}
export function setUid(uid: string): void {
  setCookie('setUid', uid)
}
export function getUid(): string {
  const uid: string | null = getCookie('setUid')
  return uid === null ? '' : uid
}

/*
  获取url参数 使用时str带引号
  ex: GetQueryString('user_id')
*/
export function GetQueryString(str: string): string {
  const href = String(window.document.location.href)
  const rs: RegExpExecArray | null = new RegExp(
    '([?&])(' + str + ')=([^&]*)(&|$)',
    'gi'
  ).exec(href)
  if (rs) {
    return decodeURI(rs[3]).split('#/')[0]
  } else {
    return ''
  }
}
/**
 * 加载动画
 */
export class AppLoading {
  public loadDom: HTMLElement | undefined
  constructor() {
    const node1 = document.createElement('div')
    node1.setAttribute('class', 'loading-component')
    node1.style.display = 'none'
    const node2 = document.createElement('div')
    node2.setAttribute('class', 'loading-box')
    const nodeSpan = []
    for (let i = 1; i <= 3; i++) {
      nodeSpan[i] = document.createElement('span')
      nodeSpan[i].setAttribute('class', 'loading-item loading-item' + i)
      node2.appendChild(nodeSpan[i])
    }
    node1.appendChild(node2)
    document.body.appendChild(node1)
    this.loadDom = node1
  }
  public show() {
    this.loadDom!.style.display = 'block'
  }
  public hide() {
    this.loadDom!.style.display = 'none'
  }
}

/**
 * @description: 获取图片资源
 * @param {string} url 图片地址
 * @return {*}
 */
export const getImageFile = (url: string) =>
  new URL(`../assets/${url}`, import.meta.url).href

/**
 * @desc 三阶贝塞尔
 * @param {number} t 当前百分比
 * @param {Array} p1 起点坐标
 * @param {Array} p2 终点坐标
 * @param {Array} cp1 控制点1
 * @param {Array} cp2 控制点2
 */
export function threeBezier(
  t: number,
  p1: [number, number],
  cp1: [number, number],
  cp2: [number, number],
  p2: [number, number]
) {
  const [x1, y1] = p1
  const [x2, y2] = p2
  const [cx1, cy1] = cp1
  const [cx2, cy2] = cp2
  const x =
    x1 * (1 - t) * (1 - t) * (1 - t) +
    3 * cx1 * t * (1 - t) * (1 - t) +
    3 * cx2 * t * t * (1 - t) +
    x2 * t * t * t
  const y =
    y1 * (1 - t) * (1 - t) * (1 - t) +
    3 * cy1 * t * (1 - t) * (1 - t) +
    3 * cy2 * t * t * (1 - t) +
    y2 * t * t * t
  return [x, y]
}

/** 纯数字input输入框的@input事件 */
export const checkPureDigit = (value: string | number) => {
  const targetVal = String(value)
  const numberReg = new RegExp(/^[0-9]+$/g)
  const inputValue = numberReg.test(targetVal)
  if (!inputValue) {
    return ''
  }
  return Number(targetVal)
}

/**
 *
 * @param birthDateString
 * @description 计算年龄
 * @example calculateAge('1999-01-01')
 * @returns
 */
export const calculateAge = (birthDateString: string) => {
  const birthDate = new Date(birthDateString)
  const currentDate = new Date()
  let age = currentDate.getFullYear() - birthDate.getFullYear()
  const currentMonth = currentDate.getMonth()
  const birthMonth = birthDate.getMonth()
  if (
    currentMonth < birthMonth ||
    (currentMonth === birthMonth && currentDate.getDate() < birthDate.getDate())
  ) {
    age--
  }
  return age
}

// 唯一id生成
export const createUniqId = (): string =>
  (Math.random() + new Date().getTime()).toString(32)
