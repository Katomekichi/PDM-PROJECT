import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '@/shared/routing/ProtectedRoute';
import { LoginPage } from '@/features/auth/pages/LoginPage';
import { PractitionerListPage } from '@/features/practitioner/pages/PractitionerListPage';
import { PractitionerFormPage } from '@/features/practitioner/pages/PractitionerFormPage';
import { PractitionerReviewPage } from '@/features/practitioner/pages/PractitionerReviewPage';
import { PractitionerDetailPage } from '@/features/practitioner/pages/PractitionerDetailPage';
import { AuditTransactionPage } from '@/features/practitioner/pages/AuditTransactionPage';
import { OrganizationListPage } from '@/features/organization/pages/OrganizationListPage';
import { OrganizationFormPage } from '@/features/organization/pages/OrganizationFormPage';
import { OrganizationReviewPage } from '@/features/organization/pages/OrganizationReviewPage';
import { OrganizationDetailPage } from '@/features/organization/pages/OrganizationDetailPage';
import Dashboard from '@/features/dashboard/Dashboard';
import ProviderDataManagerPage from '@/features/managers/ProviderDataManagerPage';
import ProviderServiceManagerPage from '@/features/managers/ProviderServiceManagerPage';
import ProviderReportingManagerPage from '@/features/managers/ProviderReportingManagerPage';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/provider-data-manager" element={<ProtectedRoute><ProviderDataManagerPage /></ProtectedRoute>} />
      <Route path="/provider-service-manager" element={<ProtectedRoute><ProviderServiceManagerPage /></ProtectedRoute>} />
      <Route path="/provider-reporting-manager" element={<ProtectedRoute><ProviderReportingManagerPage /></ProtectedRoute>} />
      <Route path="/practitioners" element={<ProtectedRoute><PractitionerListPage /></ProtectedRoute>} />
      <Route path="/practitioners/new" element={<ProtectedRoute><PractitionerFormPage /></ProtectedRoute>} />
      <Route path="/practitioners/new/review" element={<ProtectedRoute><PractitionerReviewPage /></ProtectedRoute>} />
      <Route path="/practitioners/:id/edit" element={<ProtectedRoute><PractitionerFormPage /></ProtectedRoute>} />
      <Route path="/practitioners/:id" element={<ProtectedRoute><PractitionerDetailPage /></ProtectedRoute>} />
      <Route path="/practitioners/:id/audit-transactions" element={<ProtectedRoute><AuditTransactionPage /></ProtectedRoute>} />
      <Route path="/organizations" element={<ProtectedRoute><OrganizationListPage /></ProtectedRoute>} />
      <Route path="/organizations/new" element={<ProtectedRoute><OrganizationFormPage /></ProtectedRoute>} />
      <Route path="/organizations/new/review" element={<ProtectedRoute><OrganizationReviewPage /></ProtectedRoute>} />
      <Route path="/organizations/:id" element={<ProtectedRoute><OrganizationDetailPage /></ProtectedRoute>} />
    </Routes>
  );
}
