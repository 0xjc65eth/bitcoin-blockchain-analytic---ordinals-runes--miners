'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const Navbar = () => {
  const pathname = usePathname()

  const navItems = [
    { name: 'Dashboard', path: '/' },
    { name: 'Miners', path: '/miners' },
    { name: 'Ordinals', path: '/collections' },
    { name: 'Market', path: '/market' },
    { name: 'Inscriptions', path: '/inscriptions' },
    { name: 'Signals', path: '/signals' },
  ]

  return (
    <nav className="bg-gradient-to-r from-dark-200 via-dark-300 to-dark-200 border-b border-primary-600/20 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center space-x-2">
                <span className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-accent-purple bg-clip-text text-transparent">
                  CYPHER ORDI FUTURE
                </span>
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      pathname === item.path
                        ? 'bg-primary-600/20 text-primary-400 border border-primary-600/20'
                        : 'text-gray-300 hover:bg-primary-600/10 hover:text-primary-400'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <button className="px-4 py-2 rounded-lg text-sm font-medium bg-primary-600 hover:bg-primary-700 text-white transition-all duration-200">
              Connect Wallet
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar 