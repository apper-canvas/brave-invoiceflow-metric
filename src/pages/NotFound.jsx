import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '../components/ApperIcon'

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="w-24 h-24 md:w-32 md:h-32 mx-auto mb-6 invoice-gradient rounded-3xl flex items-center justify-center">
            <ApperIcon name="FileX" className="w-12 h-12 md:w-16 md:h-16 text-white" />
          </div>
          <h1 className="text-6xl md:text-8xl font-bold text-surface-900 dark:text-white mb-4">
            404
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-surface-700 dark:text-surface-300 mb-4">
            Invoice Not Found
          </h2>
          <p className="text-lg text-surface-600 dark:text-surface-400 mb-8 max-w-md mx-auto">
            The page you're looking for seems to have been archived or moved. 
            Let's get you back to managing your invoices.
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link to="/" className="btn-primary inline-flex items-center">
            <ApperIcon name="Home" className="w-5 h-5 mr-2" />
            Back to Dashboard
          </Link>
          <button 
            onClick={() => window.history.back()} 
            className="btn-secondary inline-flex items-center"
          >
            <ApperIcon name="ArrowLeft" className="w-5 h-5 mr-2" />
            Go Back
          </button>
        </motion.div>

        {/* Decorative elements */}
        <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-primary rounded-full opacity-20 animate-pulse-soft"></div>
        <div className="absolute top-3/4 right-1/4 w-6 h-6 bg-secondary rounded-full opacity-20 animate-pulse-soft"></div>
        <div className="absolute top-1/2 left-1/6 w-3 h-3 bg-accent rounded-full opacity-20 animate-float"></div>
        <div className="absolute bottom-1/4 right-1/6 w-5 h-5 bg-primary rounded-full opacity-20 animate-float"></div>
      </div>
    </div>
  )
}

export default NotFound