import { ORDER_STATUSES } from '../data/shop'

function OrderStatusBadge({ status, className = '' }) {
  const config = ORDER_STATUSES[status] || {
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
