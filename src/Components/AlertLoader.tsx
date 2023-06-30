import {AlertModalRef, ButtonType} from './AlertModal'

export default class AlertLoader {
  static alertLoader: AlertModalRef
  static onModalHideCallback: () => void

  static setLoader(loader: any) {
    this.alertLoader = loader
  }

  static show(message: string, buttons?: ButtonType[]) {
    try {
      this.alertLoader?.showLoader(message, buttons || [])
    } catch (error) {}
  }

  static onModalHide() {
    this?.onModalHideCallback()
  }
}
