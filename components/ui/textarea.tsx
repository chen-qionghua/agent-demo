'use client';

import * as React from 'react';

type TextareaProps = React.ComponentProps<'textarea'>;

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export function Textarea({ className, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn(
        'flex min-h-24 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-xs outline-none transition-[color,box-shadow,border-color]',
        'placeholder:text-slate-400 disabled:cursor-not-allowed disabled:opacity-50',
        'focus-visible:border-slate-400 focus-visible:ring-4 focus-visible:ring-slate-950/10',
        className
      )}
      {...props}
    />
  );
}
