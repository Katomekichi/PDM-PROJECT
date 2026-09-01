export interface DashboardCard {
  id: number;
  title: string;
  route: string;
}

export const dashboardCards: DashboardCard[] = [
  {
    id: 1,
    title: 'Provider Data Manager',
    route: '/provider-data-manager'
  },
  {
    id: 2,
    title: 'Provider Service Manager',
    route: '/provider-service-manager'
  },
  {
    id: 3,
    title: 'Provider Reporting Manager',
    route: '/provider-reporting-manager'
  }
];
