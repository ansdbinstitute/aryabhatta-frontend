import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import useUIStore from '../../stores/uiStore';
import usePermission from '../../hooks/usePermission';
import useRolePermissionStore from '../../stores/rolePermissionStore';
import { getNavItemsForRole } from '../../utils/permissions';
import { classNames } from '../../utils/helpers';

const Sidebar = () => {
  const collapsed = useUIStore((s) => s.sidebarCollapsed);
  const mobileOpen = useUIStore((s) => s.sidebarMobileOpen);
  const closeMobileSidebar = useUIStore((s) => s.closeMobileSidebar);
  const { role } = usePermission();
  const isPermissionsReady = useRolePermissionStore((s) => s.isInitialized);
  const location = useLocation();

  const navItems = isPermissionsReady ? getNavItemsForRole(role) : [];

  const isActive = (path) => {
    if (path === '/erp/dashboard') return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  return (
    <aside
      className={classNames(
        'fixed top-0 left-0 h-full bg-erp-sidebar z-50 flex flex-col transition-all duration-300',
        'lg:translate-x-0',
        mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        collapsed ? 'w-[72px]' : 'w-[260px]'
      )}
    >
      {/* Logo */}
      <div className={classNames(
        'flex items-center gap-3 px-4 h-16 border-b border-white/10 shrink-0',
        collapsed ? 'justify-center' : ''
      )}>
        <img
          src="/logo.png"
          alt="ANSDB Logo"
          className="h-10 w-10 rounded-lg bg-white object-contain p-1 shadow-sm shrink-0"
        />
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="text-white font-bold text-lg leading-tight tracking-tight">ANSDB</h1>
            <p className="text-white/40 text-[10px] uppercase tracking-wider leading-tight">ERP System</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
        {navItems.map((item, idx) => {
          if (item.divider) {
            return (
              <div key={`div-${idx}`} className="my-3 mx-3 border-t border-white/10" />
            );
          }

          // Parent with children (expandable)
          if (item.children) {
            const isAnyChildActive = item.children.some((c) => isActive(c.path));
            return (
              <div key={item.label}>
                <div
                  className={classNames(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm cursor-default',
                    isAnyChildActive
                      ? 'text-accent bg-erp-sidebar-active'
                      : 'text-white/60'
                  )}
                >
                  <item.icon className="w-5 h-5 shrink-0" />
                  {!collapsed && <span className="font-medium">{item.label}</span>}
                </div>
                {!collapsed && (
                  <div className="ml-9 mt-1 space-y-0.5">
                    {item.children.map((child) => (
                      <NavLink
                        key={child.path}
                        to={child.path}
                        onClick={closeMobileSidebar}
                        className={classNames(
                          'block px-3 py-2 rounded-lg text-sm transition-colors',
                          isActive(child.path)
                            ? 'text-accent bg-erp-sidebar-active font-semibold'
                            : 'text-white/50 hover:text-white hover:bg-erp-sidebar-hover'
                        )}
                      >
                        {child.label}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          // Regular nav item
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={closeMobileSidebar}
              className={classNames(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all group',
                isActive(item.path)
                  ? 'bg-erp-sidebar-active text-accent font-semibold shadow-lg shadow-accent/5'
                  : 'text-white/60 hover:text-white hover:bg-erp-sidebar-hover'
              )}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Collapse indicator */}
      <div className="px-4 py-3 border-t border-white/10 shrink-0">
        {!collapsed && (
          <p className="text-white/20 text-[10px] text-center">
            v1.0.0 — ANSDB ERP
          </p>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
