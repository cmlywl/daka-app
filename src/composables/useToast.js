import { reactive } from 'vue'

const toast = reactive({ text: '', show: false, timer: null })

export function useToast() {
  function showToast(msg) {
    toast.text = msg
    toast.show = true
    clearTimeout(toast.timer)
    toast.timer = setTimeout(() => { toast.show = false }, 1800)
  }
  return { toast, showToast }
}