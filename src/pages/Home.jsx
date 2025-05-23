import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import MainFeature from '../components/MainFeature'
import ApperIcon from '../components/ApperIcon'

const Home = () => {
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  return (
    <div className="min-h-screen">
      {/* Header Navigation */}
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="sticky top-0 z-50 glass-effect"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 md:w-10 md:h-10 invoice-gradient rounded-xl flex items-center justify-center">
                <ApperIcon name="Receipt" className="w-4 h-4 md:w-5 md:h-5 text-white" />
              </div>
              <span className="text-xl md:text-2xl font-bold text-surface-900 dark:text-white">
                InvoiceFlow
              </span>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#dashboard" className="text-surface-600 hover:text-primary transition-colors">
                Dashboard
              </a>
              <a href="#invoices" className="text-surface-600 hover:text-primary transition-colors">
                Invoices
              </a>
              <a href="#clients" className="text-surface-600 hover:text-primary transition-colors">
                Clients
              </a>
            </nav>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-xl bg-surface-100 hover:bg-surface-200 dark:bg-surface-800 dark:hover:bg-surface-700 transition-all duration-200"
            >
              <ApperIcon 
                name={darkMode ? "Sun" : "Moon"} 
                className="w-5 h-5 text-surface-600 dark:text-surface-400" 
              />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="py-12 md:py-20 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Hero Content */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center lg:text-left"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-surface-900 dark:text-white mb-6">
                Streamline Your
                <span className="text-transparent bg-clip-text invoice-gradient block">
                  Invoice Management
                </span>
              </h1>
              <p className="text-lg md:text-xl text-surface-600 dark:text-surface-300 mb-8 max-w-2xl mx-auto lg:mx-0">
                Create, track, and manage invoices effortlessly. From client onboarding to payment tracking, InvoiceFlow handles your entire invoicing workflow.
              </p>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 md:gap-8 mb-8">
                <div className="text-center lg:text-left">
                  <div className="text-2xl md:text-3xl font-bold text-primary">99%</div>
                  <div className="text-sm text-surface-500">Faster Processing</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-2xl md:text-3xl font-bold text-secondary">24/7</div>
                  <div className="text-sm text-surface-500">Payment Tracking</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-2xl md:text-3xl font-bold text-accent">∞</div>
                  <div className="text-sm text-surface-500">Invoice Templates</div>
                </div>
              </div>
            </motion.div>

            {/* Hero Visual */}
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative"
            >
              <div className="relative z-10 bg-white dark:bg-surface-800 rounded-3xl shadow-invoice p-6 md:p-8 animate-float">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 invoice-gradient rounded-lg"></div>
                    <span className="font-semibold text-surface-900 dark:text-white">Invoice #1001</span>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    Paid
                  </span>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-surface-600 dark:text-surface-400">Design Services</span>
                    <span className="font-semibold text-surface-900 dark:text-white">$2,500.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-surface-600 dark:text-surface-400">Development</span>
                    <span className="font-semibold text-surface-900 dark:text-white">$5,000.00</span>
                  </div>
                  <div className="border-t border-surface-200 dark:border-surface-600 pt-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span className="text-surface-900 dark:text-white">Total</span>
                      <span className="text-primary">$7,500.00</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <button className="flex-1 btn-primary text-sm">
                    <ApperIcon name="Download" className="w-4 h-4 mr-2" />
                    Download
                  </button>
                  <button className="flex-1 btn-secondary text-sm">
                    <ApperIcon name="Send" className="w-4 h-4 mr-2" />
                    Send
                  </button>
                </div>
              </div>
              
              {/* Background decoration */}
              <div className="absolute -top-4 -right-4 w-20 h-20 invoice-gradient rounded-2xl opacity-20 animate-pulse-soft"></div>
              <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-secondary rounded-2xl opacity-20 animate-pulse-soft"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Feature Section */}
      <section className="py-12 md:py-20 bg-surface-50 dark:bg-surface-900/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-surface-900 dark:text-white mb-6">
              Create Your First Invoice
            </h2>
            <p className="text-lg md:text-xl text-surface-600 dark:text-surface-300 max-w-3xl mx-auto">
              Experience the power of InvoiceFlow with our interactive invoice builder. 
              Create professional invoices in minutes, not hours.
            </p>
          </motion.div>

          <MainFeature />
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                icon: "Zap",
                title: "Lightning Fast",
                description: "Create invoices in seconds with our streamlined interface"
              },
              {
                icon: "Shield",
                title: "Secure & Reliable",
                description: "Your data is protected with enterprise-grade security"
              },
              {
                icon: "BarChart3",
                title: "Analytics Dashboard",
                description: "Track payments and monitor business performance"
              },
              {
                icon: "Smartphone",
                title: "Mobile Optimized",
                description: "Manage invoices on the go with our responsive design"
              },
              {
                icon: "Bell",
                title: "Smart Reminders",
                description: "Automated payment reminders keep cash flow healthy"
              },
              {
                icon: "Globe",
                title: "Multi-Currency",
                description: "Support for multiple currencies and tax systems"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card-modern p-6 md:p-8 group hover:scale-105 transition-transform duration-300"
              >
                <div className="w-12 h-12 md:w-14 md:h-14 invoice-gradient rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <ApperIcon name={feature.icon} className="w-6 h-6 md:w-7 md:h-7 text-white" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-surface-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-surface-600 dark:text-surface-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 md:py-16 bg-surface-900 dark:bg-surface-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 invoice-gradient rounded-xl flex items-center justify-center">
                <ApperIcon name="Receipt" className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold text-white">InvoiceFlow</span>
            </div>
            <p className="text-surface-400 text-center md:text-right">
              © 2024 InvoiceFlow. Streamlining invoices worldwide.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home