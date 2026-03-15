import { RefreshCw, Github, Moon } from 'lucide-react';

export default function TopBar() {
  return (
    <div className='flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 py-3 mb-6 sticky -mt-4 bg-black/80 backdrop-blur z-10'>
      <div className='flex items-center gap-4'>
        <h2 className='text-lg md:text-xl font-bold tracking-tight'>
          JSON Schema Ecosystem Observability
        </h2>

        <div className='flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold'>
          <span className='relative flex h-2 w-2'>
            <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75'></span>
            <span className='relative inline-flex rounded-full h-2 w-2 bg-emerald-400'></span>
          </span>
          Live Update
        </div>
      </div>

      <div className='flex items-center gap-4'>
        <span className='text-sm text-zinc-400 hidden sm:block'>
          Last 30 days
        </span>

        <button
          className='p-2 rounded-lg hover:bg-zinc-900 transition-colors'
          title='Refresh'
        >
          <RefreshCw size={18} />
        </button>

        <div className='h-5 w-px bg-zinc-700'></div>

        <button
          className='p-2 rounded-lg hover:bg-zinc-900 transition-colors'
          title='Toggle Theme'
        >
          <Moon size={18} />
        </button>

        <a
          href='https://github.com/json-schema-org/json-schema-ecosystem-observability'
          target='_blank'
          rel='noopener noreferrer'
          className='p-2 rounded-lg hover:bg-zinc-900 transition-colors'
          title='GitHub Repository'
        >
          <Github size={18} />
        </a>
      </div>
    </div>
  );
}
