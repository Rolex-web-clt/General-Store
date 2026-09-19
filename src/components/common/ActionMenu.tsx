import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { MoreVertical } from 'lucide-react';

export interface ActionMenuItem {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  onClick: () => void;
  variant?: 'default' | 'danger' | 'success';
  disabled?: boolean;
  badge?: string;
}

interface ActionMenuProps {
  items: ActionMenuItem[];
  triggerClassName?: string;
  menuWidth?: string;
  align?: 'left' | 'right';
  title?: string;
  renderTrigger?: (isOpen: boolean) => React.ReactNode;
}

export const ActionMenu: React.FC<ActionMenuProps> = ({
  items,
  triggerClassName,
  menuWidth = 'w-48',
  align = 'right',
  title = 'Options',
  renderTrigger,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const [coords, setCoords] = useState<{ top: number; left?: number; right?: number; placement: 'bottom' | 'top' }>({
    top: 0,
    placement: 'bottom',
  });

  const updatePosition = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const menuHeightEstimate = items.length * 36 + 16;
    const placeTop = spaceBelow < menuHeightEstimate && spaceAbove > spaceBelow;

    const top = placeTop ? Math.max(8, rect.top - menuHeightEstimate) : Math.min(window.innerHeight - 10, rect.bottom + 6);

    if (align === 'left') {
      setCoords({
        top,
        left: Math.max(8, Math.min(window.innerWidth - 200, rect.left)),
        placement: placeTop ? 'top' : 'bottom',
      });
    } else {
      setCoords({
        top,
        right: Math.max(8, window.innerWidth - rect.right),
        placement: placeTop ? 'top' : 'bottom',
      });
    }
  };

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isOpen) {
      updatePosition();
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleScrollOrResize = () => {
      // Update coordinates dynamically on scroll/resize
      updatePosition();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    window.addEventListener('scroll', handleScrollOrResize, true);
    window.addEventListener('resize', handleScrollOrResize);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('scroll', handleScrollOrResize, true);
      window.removeEventListener('resize', handleScrollOrResize);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const menuDropdown = isOpen ? (
    createPortal(
      <div className="fixed inset-0 z-[9998]" aria-hidden="true">
        {/* Transparent backdrop capturing clicks outside */}
        <div
          className="fixed inset-0 bg-transparent"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(false);
          }}
        />

        {/* Floating Dialogue / Dropdown Box overlapping viewport */}
        <div
          style={{
            position: 'fixed',
            top: `${coords.top}px`,
            ...(coords.left !== undefined ? { left: `${coords.left}px` } : {}),
            ...(coords.right !== undefined ? { right: `${coords.right}px` } : {}),
          }}
          className={`${menuWidth} bg-white rounded-2xl shadow-xl border border-slate-200/90 py-1.5 z-10 text-xs overflow-hidden animate-in fade-in zoom-in-95 duration-150 select-none`}
          onClick={(e) => e.stopPropagation()}
        >
          {items.map((item) => {
            const Icon = item.icon;
            const isDanger = item.variant === 'danger';
            const isSuccess = item.variant === 'success';

            return (
              <button
                key={item.id}
                type="button"
                disabled={item.disabled}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsOpen(false);
                  item.onClick();
                }}
                className={`w-full text-left px-3.5 py-2 flex items-center justify-between gap-2.5 transition-colors ${
                  item.disabled
                    ? 'opacity-40 cursor-not-allowed text-slate-400'
                    : isDanger
                    ? 'text-rose-600 hover:bg-rose-50'
                    : isSuccess
                    ? 'text-emerald-700 hover:bg-emerald-50'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {Icon && (
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isDanger ? 'text-rose-500' : isSuccess ? 'text-emerald-600' : 'text-slate-400'
                      }`}
                    />
                  )}
                  <span className="font-semibold truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold bg-slate-100 text-slate-600">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>,
      document.body
    )
  ) : null;

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={handleToggle}
        title={title}
        aria-label={title}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        className={
          triggerClassName ||
          'p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors inline-flex items-center justify-center'
        }
      >
        {renderTrigger ? (
          renderTrigger(isOpen)
        ) : (
          <MoreVertical className="w-4 h-4" />
        )}
      </button>
      {menuDropdown}
    </>
  );
};
