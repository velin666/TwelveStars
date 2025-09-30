export interface IBinding {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [keyName: string]: any
  value: () => void
}
