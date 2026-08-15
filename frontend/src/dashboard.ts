export interface DashboardCard {
  id: number;
  title: string;
  route: string;
}

export const dashboardCards: DashboardCard[] = [
  {
    id: 1,
    title: 'Practitioners',
    route: '/practitioners'
  },
  {
    id: 2,
    title: 'Organizations',
    route: '/organizations'
  }
];