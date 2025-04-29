'use client'

import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-[#1A1A1A] text-[#FFFFFF] p-6 text-center font-inter border-t border-[#3B82F6]">
      <div className="max-w-4xl mx-auto">
        <p className="mb-4 text-sm">
          Thank you for being part of CYPHER ORDI FUTURE. Your security and trust are our priority. Holders of <span className="text-purple-400 font-medium">OCM Genesis</span>, <span className="text-purple-400 font-medium">OCM Katoshi Prime</span>, <span className="text-purple-400 font-medium">OCM Katoshi Classic</span>, <span className="text-purple-400 font-medium">Multiverse Pass</span>, <span className="text-purple-400 font-medium">Seize CTRL</span>, <span className="text-purple-400 font-medium">No Ordinary Kind</span>, <span className="text-purple-400 font-medium">Bitcoin Puppets</span>, <span className="text-purple-400 font-medium">The Wizards of Lords</span>, <span className="text-purple-400 font-medium">Yield Hacker Pass</span>, and <span className="text-purple-400 font-medium">Stack Sats</span> receive unlimited premium access and future upgrades, encouraging Bitcoin network development through Ordinals and community!
        </p>

        <div className="flex justify-center space-x-6 my-4">
          <Link
            href="/legal"
            className="text-[#3B82F6] hover:text-[#10B981] transition-colors duration-200 font-medium"
          >
            LEGAL
          </Link>
          <Link
            href="/site"
            className="text-[#3B82F6] hover:text-[#10B981] transition-colors duration-200 font-medium"
          >
            SITE
          </Link>
          <Link
            href="/status"
            className="text-[#3B82F6] hover:text-[#10B981] transition-colors duration-200 font-medium"
          >
            STATUS
          </Link>
        </div>

        <div className="mt-4 p-3 bg-[#2D2D2D] rounded-md inline-block">
          <p className="font-mono text-sm">
            DONATION ADDRESS: bc1q3ghzvpp0l74q3ntu8actyt0qcvl2u273flg5rs
          </p>
        </div>

        <p className="mt-4 text-sm text-[#D1D5DB]">
          Donations are incentives that drive project evolution.
        </p>

        <p className="mt-4 text-xs text-[#9CA3AF]">
          © 2024 CYPHER ORDI FUTURE. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer