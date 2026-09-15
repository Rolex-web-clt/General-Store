import React, { useState } from 'react';
import {
  Clock,
  Package,
  Truck,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  RotateCcw,
} from 'lucide-react';
import { motion } from 'motion/react';

export interface OrderStatusTrackerProps {
  status: 'Pending' | 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled' | string;
  orderNumber?: string;
  createdAt?: string;
  updatedAt?: string;
  statusHistory?: {
    status: string;
    timestamp: string;
    note?: string;
  }[];
  variant?: 'full' | 'compact';
  showTimeline?: boolean;
  className?: string;
}

interface StepItem {
  id: string;
  label: string;
  sublabel: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const STEPS: StepItem[] = [
  {
    id: 'pending',
    label: 'Pending',
    sublabel: 'Order Placed',
    icon: Clock,
    description: 'We have received your order and queued it for verification.',
  },
  {
    id: 'packing',
    label: 'Packing',
    sublabel: 'Preparing Items',
    icon: Package,
    description: 'Store associates are gathering fresh items and safely packaging your order.',
  },
  {
    id: 'out_for_delivery',
    label: 'Out for Delivery',
    sublabel: 'Rider En Route',
    icon: Truck,
    description: 'Your package is on its way with our local delivery rider.',
  },
  {
    id: 'delivered',
    label: 'Delivered',
    sublabel: 'Order Handed Over',
    icon: CheckCircle2,
    description: 'Package has been successfully handed over to your address.',
  },
];

const getStepIndex = (status: string): number => {
  const s = (status || '').toLowerCase();
  if (s === 'cancelled') return -1;
  if (s === 'delivered') return 3;
  if (s === 'shipped' || s.includes('out') || s.includes('delivery')) return 2;
  if (s === 'processing' || s === 'confirmed' || s.includes('pack')) return 1;
  return 0; // 'pending'
};

const getProgressPercentage = (status: string): number => {
  const s = (status || '').toLowerCase();
  if (s === 'cancelled') return 0;
  if (s === 'delivered') return 100;
  if (s === 'shipped' || s.includes('out') || s.includes('delivery')) return 78;
  if (s === 'processing') return 52;
  if (s === 'confirmed') return 40;
  return 12; // pending
};

export const OrderStatusTracker: React.FC<OrderStatusTrackerProps> = ({
  status,
  orderNumber,
  createdAt,
  updatedAt,
  statusHistory = [],
  variant = 'full',
  showTimeline = true,
  className = '',
}) => {
  const [timelineExpanded, setTimelineExpanded] = useState(false);

  const isCancelled = status.toLowerCase() === 'cancelled';
  const activeStepIndex = getStepIndex(status);
  const progressPercent = getProgressPercentage(status);

  // Friendly status name
  const displayStatusLabel = (() => {
    if (isCancelled) return 'Cancelled';
    if (status.toLowerCase() === 'shipped') return 'Out for Delivery';
    if (status.toLowerCase() === 'processing' || status.toLowerCase() === 'confirmed') return 'Packing';
    return status;
  })();

  // ----------------------------------------------------
  // COMPACT VARIANT (Used inside order cards & lists)
  // ----------------------------------------------------
  if (variant === 'compact') {
    if (isCancelled) {
      return (
        <div id={`tracker-compact-${orderNumber || 'order'}`} className={`w-full ${className}`}>
          <div className="flex items-center justify-between gap-2 text-xs mb-1.5">
            <span className="font-bold text-rose-700 flex items-center gap-1.5">
              <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
              Order Cancelled
            </span>
            <span className="text-[11px] text-slate-400">Not fulfilled</span>
          </div>
          <div className="w-full h-1.5 bg-rose-100 rounded-full overflow-hidden">
            <div className="h-full bg-rose-400 w-full rounded-full" />
          </div>
        </div>
      );
    }

    return (
      <div id={`tracker-compact-${orderNumber || 'order'}`} className={`w-full ${className}`}>
        {/* Header row with current active stage */}
        <div className="flex items-center justify-between gap-2 text-xs mb-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="relative flex h-2 w-2">
              {activeStepIndex < 3 ? (
                <>
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600" />
                </>
              ) : (
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-700" />
              )}
            </span>
            <span className="font-bold text-slate-900 truncate">
              {displayStatusLabel}
            </span>
            <span className="text-[11px] text-slate-400 hidden sm:inline">
              ({activeStepIndex + 1} of 4 steps)
            </span>
          </div>

          <span className="font-extrabold text-[11px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60 shrink-0">
            {progressPercent}%
          </span>
        </div>

        {/* Progress Bar with Steps */}
        <div className="relative">
          {/* Background Bar */}
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-emerald-600 to-teal-500 rounded-full"
            />
          </div>

          {/* 4 Step Node Indicators */}
          <div className="flex justify-between items-center px-1 mt-1.5">
            {STEPS.map((step, idx) => {
              const isDone = idx <= activeStepIndex;
              const isCurrent = idx === activeStepIndex;

              return (
                <div
                  key={step.id}
                  className="flex flex-col items-center"
                  style={{ width: '25%' }}
                >
                  <span
                    className={`text-[10px] font-bold truncate max-w-full text-center ${
                      isCurrent
                        ? 'text-emerald-800 font-extrabold'
                        : isDone
                        ? 'text-slate-700'
                        : 'text-slate-300'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // FULL VARIANT (Used on OrderSuccessPage & Order Details)
  // ----------------------------------------------------
  if (isCancelled) {
    return (
      <div
        id={`tracker-full-${orderNumber || 'order'}`}
        className={`bg-rose-50/70 border border-rose-200 rounded-2xl p-6 sm:p-8 ${className}`}
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
            <XCircle className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-extrabold text-rose-950 text-base">Order Cancelled</h3>
              <span className="text-xs font-bold text-rose-700 bg-rose-100 px-2.5 py-1 rounded-lg">
                Status: Cancelled
              </span>
            </div>
            <p className="text-xs text-rose-800 mt-1.5 leading-relaxed">
              This order was cancelled and will not be dispatched. If you need any assistance or
              wish to re-order your groceries, please contact our support team.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const currentStep = STEPS[activeStepIndex] || STEPS[0];
  const CurrentIcon = currentStep.icon;

  return (
    <div
      id={`tracker-full-${orderNumber || 'order'}`}
      className={`bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs ${className}`}
    >
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-slate-100">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-700 block">
            Live Order Progress
          </span>
          <div className="flex items-center gap-2 mt-1">
            <h3 className="text-lg sm:text-xl font-black text-slate-900">
              {displayStatusLabel}
            </h3>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full">
              <span className="relative flex h-2 w-2">
                {activeStepIndex < 3 && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                )}
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600" />
              </span>
              Step {activeStepIndex + 1} of 4
            </span>
          </div>
        </div>

        <div className="text-left sm:text-right">
          <span className="text-xs text-slate-400 block font-medium">Progress</span>
          <span className="text-base font-black text-emerald-700">
            {progressPercent}% Complete
          </span>
        </div>
      </div>

      {/* Progress Bar & Stepper */}
      <div className="py-8">
        <div className="relative">
          {/* Background Connecting Line */}
          <div
            className="absolute left-[12%] right-[12%] top-5 sm:top-6 -translate-y-1/2 h-1.5 bg-slate-100 rounded-full z-0"
            aria-hidden="true"
          />

          {/* Active Animated Progress Bar */}
          <motion.div
            initial={{ width: 0 }}
            animate={{
              width: `${Math.max(0, Math.min(100, (activeStepIndex / (STEPS.length - 1)) * 76))}%`,
            }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="absolute left-[12%] top-5 sm:top-6 -translate-y-1/2 h-1.5 bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 rounded-full z-0"
            aria-hidden="true"
          />

          {/* Stepper Nodes */}
          <div className="flex items-start justify-between relative z-10">
            {STEPS.map((step, idx) => {
              const StepIcon = step.icon;
              const isCompleted = idx < activeStepIndex;
              const isCurrent = idx === activeStepIndex;
              const isFuture = idx > activeStepIndex;

              return (
                <div
                  key={step.id}
                  className="flex flex-col items-center text-center group"
                  style={{ width: '25%' }}
                >
                  {/* Circle Icon Container */}
                  <div className="relative">
                    <div
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                        isCompleted
                          ? 'bg-emerald-700 text-white shadow-xs'
                          : isCurrent
                          ? 'bg-emerald-600 text-white ring-4 ring-emerald-100 shadow-md scale-105'
                          : 'bg-white text-slate-300 border-2 border-slate-200'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />
                      ) : (
                        <StepIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                      )}
                    </div>

                    {/* Ping indicator for current step */}
                    {isCurrent && (
                      <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
                      </span>
                    )}
                  </div>

                  {/* Step Title & Subtitle */}
                  <div className="mt-3 px-1 w-full">
                    <p
                      className={`text-xs sm:text-sm font-bold truncate ${
                        isCurrent
                          ? 'text-emerald-800'
                          : isCompleted
                          ? 'text-slate-800'
                          : 'text-slate-400'
                      }`}
                      title={step.label}
                    >
                      {step.label}
                    </p>
                    <p
                      className={`text-[10px] sm:text-xs font-medium hidden xs:block sm:block truncate mt-0.5 ${
                        isCurrent
                          ? 'text-emerald-600'
                          : isCompleted
                          ? 'text-slate-500'
                          : 'text-slate-300'
                      }`}
                    >
                      {step.sublabel}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Current Step Informational Card */}
      <div className="bg-slate-50 rounded-2xl border border-slate-100 p-4 sm:p-5 flex items-start gap-3.5">
        <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
          <CurrentIcon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h4 className="font-extrabold text-xs sm:text-sm text-slate-900">
              Current Stage: {currentStep.label}
            </h4>
            {updatedAt && (
              <span className="text-[11px] text-slate-400">
                Last updated {new Date(updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
            {currentStep.description}
          </p>
        </div>
      </div>

      {/* Detailed Status History (Collapsible) */}
      {showTimeline && statusHistory.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-100">
          <button
            onClick={() => setTimelineExpanded(!timelineExpanded)}
            className="w-full flex items-center justify-between text-xs font-bold text-slate-600 hover:text-emerald-700 transition-colors py-1"
          >
            <span>Order Activity Log ({statusHistory.length} updates)</span>
            {timelineExpanded ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {timelineExpanded && (
            <div className="mt-3 space-y-2.5 pt-2 border-t border-slate-100">
              {statusHistory.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs">
                  <div className="w-2 h-2 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-slate-800">{item.status}</span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(item.timestamp).toLocaleString()}
                      </span>
                    </div>
                    {item.note && (
                      <p className="text-slate-500 text-[11px] mt-0.5">{item.note}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
