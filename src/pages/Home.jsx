import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import MainFeature from '../components/MainFeature'
import ApperIcon from '../components/ApperIcon'

const Home = () => {
  const [darkMode, setDarkMode] = useState(false)
  const [dashboardData] = useState({
    totalInvoices: 147,
    totalRevenue: 89750,
    pendingPayments: 12,
    paidInvoices: 135,
    recentActivities: [
      { id: 1, type: 'invoice_created', client: 'Acme Corp', amount: 2500, time: '2 hours ago' },
      { id: 2, type: 'payment_received', client: 'Tech Solutions', amount: 1800, time: '4 hours ago' },
      { id: 3, type: 'invoice_sent', client: 'Creative Agency', amount: 3200, time: '6 hours ago' },
      { id: 4, type: 'invoice_overdue', client: 'Startup Inc', amount: 950, time: '1 day ago' }
    ],
    monthlyData: [
      { month: 'Jan', revenue: 12000, invoices: 24 },
      { month: 'Feb', revenue: 15000, invoices: 28 },
      { month: 'Mar', revenue: 18000, invoices: 32 },
      { month: 'Apr', revenue: 22000, invoices: 38 },
      { month: 'May', revenue: 25000, invoices: 42 },
      { month: 'Jun', revenue: 28000, invoices: 45 }
    ]
  })

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
              <Link to="/" className="text-primary font-medium">
                Dashboard
              </Link>
              <Link to="/invoices" className="text-surface-600 hover:text-primary transition-colors">
                Invoices
              </Link>
              <Link to="/settings" className="text-surface-600 hover:text-primary transition-colors">
                Settings
              </Link>
              <Link to="/clients" className="text-surface-600 hover:text-primary transition-colors">
                Clients
              </Link>
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
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-surface-900 dark:text-white mb-2">
              Welcome back to InvoiceFlow
            </h1>
            <p className="text-surface-600 dark:text-surface-400">
              Here's what's happening with your invoices today
            </p>
          </motion.div>
        </div>
      </section>

      {/* Dashboard Stats */}
      <section className="py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              {
                title: 'Total Invoices',
                value: dashboardData.totalInvoices,
                icon: 'FileText',
                color: 'primary',
                change: '+12%',
                trend: 'up'
              },
              {
                title: 'Total Revenue',
                value: `$${dashboardData.totalRevenue.toLocaleString()}`,
                icon: 'DollarSign',
                color: 'green',
                change: '+8%',
                trend: 'up'
              },
              {
                title: 'Pending Payments',
                value: dashboardData.pendingPayments,
                icon: 'Clock',
                color: 'amber',
                change: '-3%',
                trend: 'down'
              },
              {
                title: 'Paid Invoices',
                value: dashboardData.paidInvoices,
                icon: 'CheckCircle',
                color: 'emerald',
                change: '+15%',
                trend: 'up'
              }
            ].map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="card-modern p-6 hover:shadow-invoice transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    stat.color === 'primary' ? 'bg-primary/10 text-primary' :
                    stat.color === 'green' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' :
                    stat.color === 'amber' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' :
                    'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
                  }`}>
                    <ApperIcon name={stat.icon} className="w-6 h-6" />
                  </div>
                  <div className={`flex items-center text-sm font-medium ${
                    stat.trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  }`}>
                    <ApperIcon 
                      name={stat.trend === 'up' ? 'TrendingUp' : 'TrendingDown'} 
                      className="w-4 h-4 mr-1" 
                    />
                    {stat.change}
                  </div>
                </div>
                <div className="text-2xl font-bold text-surface-900 dark:text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-surface-600 dark:text-surface-400">
                  {stat.title}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="card-modern p-6 mb-8"
          >
            <h3 className="text-xl font-bold text-surface-900 dark:text-white mb-4">
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link 
                to="/#create-invoice"
                className="flex flex-col items-center p-4 rounded-xl bg-primary/5 hover:bg-primary/10 transition-colors group"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <ApperIcon name="Plus" className="w-6 h-6 text-primary" />
                </div>
                <span className="text-sm font-medium text-surface-900 dark:text-white">Create Invoice</span>
              </Link>
              
              <Link 
                to="/invoices"
                className="flex flex-col items-center p-4 rounded-xl bg-secondary/5 hover:bg-secondary/10 transition-colors group"
              >
                <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <ApperIcon name="FileText" className="w-6 h-6 text-secondary" />
                </div>
                <span className="text-sm font-medium text-surface-900 dark:text-white">View Invoices</span>
              </Link>
              
              <Link 
                to="/settings"
                className="flex flex-col items-center p-4 rounded-xl bg-accent/5 hover:bg-accent/10 transition-colors group"
              >
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <ApperIcon name="Repeat" className="w-6 h-6 text-accent" />
                </div>
                <span className="text-sm font-medium text-surface-900 dark:text-white">Recurring Setup</span>
              </Link>
              
              <button className="flex flex-col items-center p-4 rounded-xl bg-surface-100 hover:bg-surface-200 dark:bg-surface-700 dark:hover:bg-surface-600 transition-colors group">
                <div className="w-12 h-12 bg-surface-200 dark:bg-surface-600 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <ApperIcon name="Users" className="w-6 h-6 text-surface-600 dark:text-surface-400" />
                </div>
                <span className="text-sm font-medium text-surface-900 dark:text-white">Manage Clients</span>
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Dashboard Content Grid */}
      <section className="py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Recent Activities */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="card-modern p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-surface-900 dark:text-white">
                    Recent Activities
                  </h3>
                  <Link 
                    to="/invoices" 
                    className="text-primary hover:text-primary-dark text-sm font-medium"
                  >
                    View All
                  </Link>
                </div>
                
                <div className="space-y-4">
                  {dashboardData.recentActivities.map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="flex items-center space-x-4 p-4 rounded-xl bg-surface-50 dark:bg-surface-700 hover:bg-surface-100 dark:hover:bg-surface-600 transition-colors"
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        activity.type === 'invoice_created' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' :
                        activity.type === 'payment_received' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' :
                        activity.type === 'invoice_sent' ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' :
                        'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        <ApperIcon 
                          name={
                            activity.type === 'invoice_created' ? 'FileText' :
                            activity.type === 'payment_received' ? 'DollarSign' :
                            activity.type === 'invoice_sent' ? 'Send' :
                            'AlertTriangle'
                          }
                          className="w-5 h-5"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-surface-900 dark:text-white">
                            {activity.type === 'invoice_created' ? 'Invoice Created' :
                             activity.type === 'payment_received' ? 'Payment Received' :
                             activity.type === 'invoice_sent' ? 'Invoice Sent' :
                             'Invoice Overdue'}
                          </p>
                          <span className="text-sm text-surface-500 dark:text-surface-400">
                            {activity.time}
                          </span>
                        </div>
                        <p className="text-sm text-surface-600 dark:text-surface-400">
                          {activity.client} • ${activity.amount.toLocaleString()}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Invoice Status Chart */}
            <div className="space-y-8">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="card-modern p-6"
              >
                <h3 className="text-xl font-bold text-surface-900 dark:text-white mb-6">
                  Invoice Status
                </h3>
                
                <div className="space-y-4">
                  {[
                    { status: 'Paid', count: 135, color: 'emerald', percentage: 92 },
                    { status: 'Pending', count: 12, color: 'amber', percentage: 8 },
                    { status: 'Overdue', count: 0, color: 'red', percentage: 0 }
                  ].map((item) => (
                    <div key={item.status} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-surface-900 dark:text-white">
                          {item.status}
                        </span>
                        <span className="text-sm text-surface-600 dark:text-surface-400">
                          {item.count}
                        </span>
                      </div>
                      <div className="w-full bg-surface-200 dark:bg-surface-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            item.color === 'emerald' ? 'bg-emerald-500' :
                            item.color === 'amber' ? 'bg-amber-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
              
              {/* Monthly Revenue Chart */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
                className="card-modern p-6"
              >
                <h3 className="text-xl font-bold text-surface-900 dark:text-white mb-6">
                  Monthly Revenue
                </h3>
                
                <div className="space-y-4">
                  {dashboardData.monthlyData.slice(-3).map((month, index) => (
                    <div key={month.month} className="flex items-center justify-between">
                      <span className="text-sm text-surface-600 dark:text-surface-400">
                        {month.month}
                      </span>
                      <div className="flex-1 mx-4">
                        <div className="w-full bg-surface-200 dark:bg-surface-700 rounded-full h-2">
                          <div 
                            className="h-2 bg-primary rounded-full"
                            style={{ width: `${(month.revenue / 30000) * 100}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-sm font-medium text-surface-900 dark:text-white">
                        ${(month.revenue / 1000).toFixed(0)}k
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Invoice Builder Section */}
      <section id="create-invoice" className="py-12 bg-surface-50 dark:bg-surface-900/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-surface-900 dark:text-white mb-6">
              Create Your Invoice
            </h2>
            <p className="text-lg text-surface-600 dark:text-surface-300 max-w-2xl mx-auto">
              Use our intuitive invoice builder to create professional invoices in minutes.
            </p>
          </motion.div>

          <MainFeature />
        </div>
      </section>

      {/* Features Preview */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-surface-900 dark:text-white mb-4">
              Why Choose InvoiceFlow?
            </h2>
            <p className="text-lg text-surface-600 dark:text-surface-300 max-w-2xl mx-auto">
              Powerful features designed to streamline your invoicing workflow
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: "Zap",
                title: "Lightning Fast",
                description: "Create professional invoices in seconds with our streamlined interface"
              },
              {
                icon: "Shield",
                title: "Secure & Reliable",
                description: "Your data is protected with enterprise-grade security"
              },
              {
                icon: "BarChart3",
                title: "Analytics Dashboard",
                description: "Track payments and monitor business performance in real-time"
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
                icon: "Repeat",
                title: "Recurring Invoices",
                description: "Set up automated recurring invoices for regular clients"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card-modern p-6 group hover:scale-105 transition-all duration-300"
              >
                <div className="w-12 h-12 invoice-gradient rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <ApperIcon name={feature.icon} className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-surface-900 dark:text-white mb-3">
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

      {/* Call to Action */}
      <section className="py-12 bg-gradient-to-r from-primary to-primary-dark">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to streamline your invoicing?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of businesses that trust InvoiceFlow for their invoice management
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/#create-invoice"
                className="bg-white text-primary px-8 py-4 rounded-xl font-semibold hover:bg-surface-50 transition-colors inline-flex items-center justify-center"
              >
                <ApperIcon name="FileText" className="w-5 h-5 mr-2" />
                Create Your First Invoice
              </Link>
              <Link 
                to="/invoices"
                className="bg-white/10 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/20 transition-colors inline-flex items-center justify-center border border-white/20"
              >
                <ApperIcon name="BarChart3" className="w-5 h-5 mr-2" />
                View Dashboard
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-surface-900 dark:bg-surface-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 invoice-gradient rounded-xl flex items-center justify-center">
                  <ApperIcon name="Receipt" className="w-4 h-4 text-white" />
                </div>
                <span className="text-xl font-bold text-white">InvoiceFlow</span>
              </div>
              <p className="text-surface-400 max-w-md">
                The most intuitive invoice management platform for modern businesses. 
                Create, track, and manage all your invoices in one place.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-surface-400">
                <li><Link to="/#create-invoice" className="hover:text-white transition-colors">Invoice Builder</Link></li>
                <li><Link to="/invoices" className="hover:text-white transition-colors">Invoice Management</Link></li>
                <li><Link to="/settings" className="hover:text-white transition-colors">Recurring Invoices</Link></li>
                <li><a href="#analytics" className="hover:text-white transition-colors">Analytics</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-surface-400">
                <li><a href="#help" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#contact" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#docs" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#api" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-surface-800 pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <p className="text-surface-400 text-center md:text-left mb-4 md:mb-0">
                © 2024 InvoiceFlow. All rights reserved. Streamlining invoices worldwide.
              </p>
              <div className="flex space-x-6">
                <a href="#privacy" className="text-surface-400 hover:text-white transition-colors text-sm">
                  Privacy Policy
                </a>
                <a href="#terms" className="text-surface-400 hover:text-white transition-colors text-sm">
                  Terms of Service
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home