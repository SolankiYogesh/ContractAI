export default class Toast {
  static toast: any

  static setLoader = (loader: any) => {
    this.toast = loader
  }

  static show = (text: string) => {
    this.toast?.show(text)
  }
}
