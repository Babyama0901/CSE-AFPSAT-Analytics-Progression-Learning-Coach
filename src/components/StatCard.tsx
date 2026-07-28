import React from 'react';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Target, AlertTriangle, Database } from 'lucide-react';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: number;
    label: string;
  };
  className?: string;
  status?: 'optimal' | 'warning' | 'critical' | 'neutral';
  icon?: 'readiness' | 'deficit' | 'inputs';
}

export function StatCard({ title, value, subtitle, trend, className, status = 'neutral', icon }: StatCardProps) {
  const statusColors = {
    optimal: 'from-emerald-400 to-teal-500 text-transparent bg-clip-text',
    warning: 'from-amber-400 to-orange-500 text-transparent bg-clip-text',
    critical: 'from-rose-400 to-red-500 text-transparent bg-clip-text',
    neutral: 'from-cyan-400 to-blue-500 text-transparent bg-clip-text'
  };

  const IconComponent = 
    icon === 'readiness' ? Target : 
    icon === 'deficit' ? AlertTriangle : 
    icon === 'inputs' ? Database : null;

  const iconColors = {
    optimal: 'text-emerald-400 bg-emerald-400/10',
    warning: 'text-amber-400 bg-amber-400/10',
    critical: 'text-rose-400 bg-rose-400/10',
    neutral: 'text-cyan-400 bg-cyan-400/10'
  };

  return (
    <div className={cn("glass-card p-6 rounded-2xl flex flex-col relative overflow-hidden group", className)}>
      {/* Subtle background glow on hover */}
      <div className={cn("absolute -inset-4 opacity-0 group-hover:opacity-20 blur-2xl transition duration-500", 
        status === 'optimal' ? 'bg-emerald-500' :
        status === 'warning' ? 'bg-amber-500' :
        status === 'critical' ? 'bg-rose-500' : 'bg-cyan-500'
      )} />

      <div className="relative flex justify-between items-start mb-4">
        <h3 className="text-slate-400 text-sm font-semibold uppercase tracking-wider">{title}</h3>
        {IconComponent && (
          <div className={cn("p-2 rounded-xl", iconColors[status])}>
            <IconComponent className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="relative flex flex-col gap-1 mt-auto">
        <span className={cn("text-4xl font-bold tracking-tight", statusColors[status])}>
          {value}
        </span>
        {subtitle && <span className="text-slate-500 text-sm font-medium">{subtitle}</span>}
      </div>
      
      {trend && (
        <div className="relative mt-4 flex items-center gap-2 text-sm font-semibold">
          <span className={trend.value >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
            {trend.value >= 0 ? '+' : ''}{trend.value}%
          </span>
          <span className="text-slate-500">{trend.label}</span>
        </div>
      )}
    </div>
  );
}
