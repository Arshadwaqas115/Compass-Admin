import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

export const navItems = [
  { key: 'user_agent_list', title: 'Guests', href: paths.dashboard.user_agent_list, icon: 'plugs-connected' },
  { key: 'chart', title: 'Chart', href: paths.dashboard.chart, icon: 'chart-pie' },
  { key: 'agents', title: 'Agents', href: paths.dashboard.agents, icon: 'users' },
  { key: 'vendors', title: 'Hotel Vendors', href:paths.dashboard.vendors,  icon:'users'} ,
  { key: 'tranportVendors', title: 'Transport Vendors', href:paths.dashboard.tranportVendors, icon:'users'},
  { key: 'employes',title:"Employees",href:paths.dashboard.employes,icon:'users'},

  //  {key: 'add-user', title:'Add User',  href: paths.dashboard.detail , icon: 'users'},
  // { key: 'overview', title: 'Overview', href: paths.dashboard.overview, icon: 'chart-pie' },

  // { key: 'customers', title: 'Customers', href: paths.dashboard.customers, icon: 'users' },
  // { key: 'integrations', title: 'Integrations', href: paths.dashboard.integrations, icon: 'plugs-connected' },
  // { key: 'settings', title: 'Settings', href: paths.dashboard.settings, icon: 'gear-six' },
  // { key: 'account', title: 'Account', href: paths.dashboard.account, icon: 'user' },
  // { key: 'error', title: 'Error', href: paths.errors.notFound, icon: 'x-square' },
] satisfies NavItemConfig[];
