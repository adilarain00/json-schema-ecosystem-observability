'use client';
import { usePathname } from 'next/navigation';
import {
  Home,
  Download,
  Github,
  Puzzle,
  BookOpen,
  Layout,
  HelpCircle,
} from 'lucide-react';
import Link from 'next/link';

const navItems = [
  { href: '/', label: 'Overview', icon: Home },
  { href: '/npm-downloads', label: 'NPM Downloads', icon: Download },
  { href: '/github-activity', label: 'GitHub Activity', icon: Github },
  { href: '/bowtie', label: 'Bowtie Implementation', icon: Puzzle },
];

const docItems = [
  {
    href: '/documents/poc-case-study',
    label: 'PoC Case Study',
    icon: BookOpen,
  },
  {
    href: '/documents/system-architecture',
    label: 'System Architecture',
    icon: Layout,
  },
  {
    href: '/documents/qualification-questions',
    label: 'Qualification QnA',
    icon: HelpCircle,
  },
];

export default function SidebarNav() {
  const pathname = usePathname();
  return (
    <div className='flex flex-col gap-6'>
      <div className='flex flex-col gap-2'>
        <p className='text-xs uppercase font-medium text-zinc-500 tracking-wider mb-2'>
          Metrics
        </p>
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`px-3 py-2 text-sm flex items-center gap-2 rounded-md transition-colors
              ${
                pathname === href
                  ? 'bg-blue-600 text-white font-semibold shadow-md'
                  : 'text-zinc-300 hover:text-white hover:bg-zinc-900'
              }
            `}
          >
            <Icon size={18} />
            {label}
          </Link>
        ))}
      </div>

      <div className='flex flex-col gap-2'>
        <p className='text-xs uppercase font-medium text-zinc-500 tracking-wider mb-2'>
          Documents
        </p>
        {docItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`px-3 py-2 text-sm flex items-center gap-2 rounded-md transition-colors
              ${
                pathname === href
                  ? 'bg-blue-600 text-white font-semibold shadow-md'
                  : 'text-zinc-300 hover:text-white hover:bg-zinc-900'
              }
            `}
          >
            <Icon size={18} />
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}
