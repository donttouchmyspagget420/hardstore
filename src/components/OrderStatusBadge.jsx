import { useStore } from '../context/store-context'

function OrderStatusBadge({ status, className = '' }) {
  const { settings } = useStore()
  const config = settings?.orderStatuses?.[status] || {
    tone: 'secondary',
    icon: 'bi-circle',
  }

  return (
    <span className={`order-status order-status-${config.tone} ${className}`.trim()}>
      <i className={`bi ${config.icon}`} aria-hidden="true" />
      {status}
    </span>
  )
}

export default OrderStatusBadge
