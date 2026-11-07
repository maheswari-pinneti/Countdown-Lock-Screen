import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { OverviewPage } from '../features/overview/OverviewPage';
import { DeveloperPage } from '../features/developer/DeveloperPage';
import { InterviewPage } from '../features/interview/InterviewPage';
import { JobHuntPage } from '../features/job-hunt/JobHuntPage';
import { CareerSwitchPage } from '../features/career-switch/CareerSwitchPage';
import { FirstJobPage } from '../features/first-job/FirstJobPage';
import { CountdownStudioPage } from '../features/countdown-studio/CountdownStudioPage';
import { MilestonesPage } from '../features/milestones/MilestonesPage';
import { SavedDesignsPage } from '../features/saved-designs/SavedDesignsPage';
import { MyLockScreensPage } from '../features/lockscreen/MyLockScreensPage';
import { NotificationsPage } from '../features/notifications/NotificationsPage';
import { SettingsPage } from '../features/settings/SettingsPage';
import { HelpAboutPage } from '../features/help/HelpAboutPage';
import { NotFoundPage } from '../features/not-found/NotFoundPage';
import { PlatformShowcase } from '../features/showcase/PlatformShowcase';
import { EmployeeDirectoryPage } from '../features/directory/EmployeeDirectoryPage';
import { LoginPage } from '../features/auth/LoginPage';
import { SignupPage } from '../features/auth/SignupPage';
import { TermsPage } from '../features/legal/TermsPage';
import { PrivacyPage } from '../features/legal/PrivacyPage';
import { useAppStore } from '../store/AppContext';
import { RouteErrorBoundary } from '../components/feedback/RouteErrorBoundary';

// Protected Route: Guarantees user must login/signup first before accessing workstations
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAppStore();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

// Guest-Only Route: Redirects to dashboard if already authenticated
const GuestRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAppStore();
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <OverviewPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'dashboard',
        element: <Navigate to="/" replace />,
      },
      {
        path: 'login',
        element: (
          <GuestRoute>
            <LoginPage />
          </GuestRoute>
        ),
      },
      {
        path: 'signup',
        element: (
          <GuestRoute>
            <SignupPage />
          </GuestRoute>
        ),
      },
      {
        path: 'terms',
        element: <TermsPage />,
      },
      {
        path: 'terms-and-conditions',
        element: <Navigate to="/terms" replace />,
      },
      {
        path: 'privacy',
        element: <PrivacyPage />,
      },
      {
        path: 'privacy-policy',
        element: <Navigate to="/privacy" replace />,
      },
      {
        path: 'countdowns',
        element: (
          <ProtectedRoute>
            <MyLockScreensPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'my-lock-screens',
        element: (
          <ProtectedRoute>
            <MyLockScreensPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'interview',
        element: (
          <ProtectedRoute>
            <InterviewPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'job-hunt',
        element: (
          <ProtectedRoute>
            <JobHuntPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'developer',
        element: (
          <ProtectedRoute>
            <DeveloperPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'first-job',
        element: (
          <ProtectedRoute>
            <FirstJobPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'career-switch',
        element: (
          <ProtectedRoute>
            <CareerSwitchPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'countdown-studio',
        element: (
          <ProtectedRoute>
            <CountdownStudioPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'milestones',
        element: (
          <ProtectedRoute>
            <MilestonesPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'saved-designs',
        element: (
          <ProtectedRoute>
            <SavedDesignsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'notifications',
        element: (
          <ProtectedRoute>
            <NotificationsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'settings',
        element: (
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'showcase',
        element: (
          <ProtectedRoute>
            <PlatformShowcase />
          </ProtectedRoute>
        ),
      },
      {
        path: 'directory',
        element: (
          <ProtectedRoute>
            <EmployeeDirectoryPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'employees',
        element: <Navigate to="/directory" replace />,
      },
      {
        path: 'personas',
        element: <Navigate to="/directory" replace />,
      },
      {
        path: 'help',
        element: (
          <ProtectedRoute>
            <HelpAboutPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'docs',
        element: (
          <ProtectedRoute>
            <HelpAboutPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'about',
        element: <Navigate to="/help" replace />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);
