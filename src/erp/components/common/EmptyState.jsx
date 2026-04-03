import React from 'react';
import { Inbox, HelpCircle as HelpCircleIcon, Search, User, Calendar, Bell, Mail, FolderOpen } from 'lucide-react';

const iconComponents = {
  inbox: Inbox, search: Search, user: User, calendar: Calendar,
  notification: Bell, mail: Mail, folder: FolderOpen, file: HelpCircleIcon,
};

const EmptyState = ({ icon = 'inbox', title = 'No data found', description, action }) => {
  const iconMap = {
    inbox: Inbox, search: Search, user: User, calendar: Calendar,
    notification: Bell, mail: Mail, folder: FolderOpen, file: HelpCircleIcon,
  };
  const IconComponent = iconMap[icon] || Inbox;
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
        <IconComponent className="w-8 h-8 text-slate-300" />
      </div>
      <h3 className="text-lg font-semibold text-slate-600 mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-slate-400 max-w-sm mb-4">{description}</p>
      )}
      {action}
    </div>
  );
};

export default EmptyState;
