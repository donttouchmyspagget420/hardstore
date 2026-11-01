import { useCallback, useMemo, useState } from 'react'
import { ToastContext } from './toast-context'
import ToastItem from '../components/ToastItem'

let toastSequence = 0

function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const removeToast = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const showToast = useCallback((message, variant = 'success', title = '') => {
    const id = ++toastSequence
    setToasts((current) => [...current, { id, message, variant, title }])
    return id
  }, [])

  const value = useMemo(() => ({ showToast, removeToast }), [showToast, removeToast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="toast-container position-fixed top-0 end-0 p-3"
        aria-live="polite"
        aria-atomic="true"
      >
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onClose={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export default ToastProvider
