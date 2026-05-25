import { HiInformationCircle, HiCheckCircle, HiExclamationCircle, HiXCircle } from 'react-icons/hi'

const Alert = ({ type = 'info', message, onClose }) => {
  const icons = {
    success: HiCheckCircle,
    error: HiXCircle,
    warning: HiExclamationCircle,
    info: HiInformationCircle,
  }
  
  const colors = {
    success: 'bg-green-50 dark:bg-green-900/20 border-green-500 text-green-800 dark:text-green-200',
    error: 'bg-red-50 dark:bg-red-900/20 border-red-500 text-red-800 dark:text-red-200',
    warning: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500 text-yellow-800 dark:text-yellow-200',
    info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 text-blue-800 dark:text-blue-200',
  }
  
  const Icon = icons[type]
  
  return (
    <div className={`${colors[type]} border-l-4 rounded-lg p-4 mb-4 transition-all duration-300`}>
      <div className="flex items-center">
        <Icon className="h-5 w-5 mr-3" />
        <p className="text-sm flex-1">{message}</p>
        {onClose && (
          <button onClick={onClose} className="ml-3">
            <XCircle className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  )
}

export default Alert