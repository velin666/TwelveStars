/**
 *  常用的数据类型判断
 */

const isArray = Array.isArray
const isFunction = (val: unknown) => typeof val === 'function'
const isObject = (val: unknown) => val !== null && typeof val === 'object'
const isString = (val: unknown) => typeof val === 'string'

export { isString, isObject, isFunction, isArray }
