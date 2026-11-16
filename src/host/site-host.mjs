export default function (_nativeModules, callHost) {
  return {
    async getState(input, callback) {
      callback(await callHost('getState', input))
    },
    async navigate(input, callback) {
      await callHost('navigate', input)
      callback()
    },
    async openExternal(input, callback) {
      await callHost('openExternal', input)
      callback()
    },
  }
}
