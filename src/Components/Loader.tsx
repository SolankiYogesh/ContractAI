export default class Loader {
  static loader: any
  static onModalHideCallback: () => void

  static setLoader(loader: any) {
    this.loader = loader
  }

  static isLoading(check: boolean, callback?: () => void) {
    try {
      this.loader?.showLoader(check, !!callback)

      if (!check && callback && typeof callback === 'function') {
        this.onModalHideCallback = callback
      }
    } catch (error) {}
  }

  static onModalHide() {
    this?.onModalHideCallback()
  }
}
