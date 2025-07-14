import _toast, { ToastOptions } from "react-hot-toast"
import Toast from "../components/Toast"

const useToast = () => {
  return toast
}

export { useToast }

const toast: Toast = (status, options) =>
  _toast.custom((t: any) => <Toast  t={t} {...status} />, options)

export interface Toast {
  (status: Status, options?: ToastOptions): void
}

export interface Status {
  title: string
  body?: string
  type?: "success" | "error" | "info" | "warning"
  isHtml?: boolean
}
