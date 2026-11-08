import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { useAppStore } from '../store/AppContext';
import { RouteErrorBoundary } from '../components/feedback/RouteErrorBoundary';

// Lazy-loaded feature routes for sub-second initial load and efficient chunking
const OverviewPage = React.lazy(() => import('../features/overview/OverviewPage').then((m) => ({ default: m.OverviewPage })));
const DeveloperPage = React.lazy(() => import('../features/developer/DeveloperPage').then((m) => ({ default: m.DeveloperPage })));
const InterviewPage = React.lazy(() => import('../features/interview/InterviewPage').then((m) => ({ default: m.InterviewPage })));
const JobHuntPage = React.lazy(() => import('../features/job-hunt/JobHuntPage').then((m) => ({ default: m.JobHuntPage })));
const CareerSwitchPage = React.lazy(() => import('../features/career-switch/CareerSwitchPage').then((m) => ({ default: m.CareerSwitchPage })));
const FirstJobPage = React.lazy(() => import('../features/first-job/FirstJobPage').then((m) => ({ default: m.FirstJobPage })));
const CountdownStudioPage = React.lazy(() => import('../features/countdown-studio/CountdownStudioPage').then((m) => ({ default: m.CountdownStudioPage })));
const MilestonesPage = React.lazy(() => import('../features/milestones/MilestonesPage').then((m) => ({ default: m.MilestonesPage })));
const SavedDesignsPage = React.lazy(() => import('../features/saved-designs/SavedDesignsPage').then((m) => ({ default: m.SavedDesignsPage })));
const MyLockScreensPage = React.lazy(() => import('../features/lockscreen/MyLockScreensPage').then((m) => ({ default: m.MyLockScreensPage })));
const NotificationsPage = React.lazy(() => import('../features/notifications/NotificationsPage').then((m) => ({ default: m.NotificationsPage })));
const SettingsPage = React.lazy(() => import('../features/settings/SettingsPage').then((m) => ({ default: m.SettingsPage })));
const HelpAboutPage = React.lazy(() => import('../features/help/HelpAboutPage').then((m) => ({ default: m.HelpAboutPage })));
const NotFoundPage = React.lazy(() => import('../features/not-found/NotFoundPage').then((m) => ({ default: m.NotFoundPage })));
const PlatformShowcase = React.lazy(() => import('../features/showcase/PlatformShowcase').then((m) => ({ default: m.PlatformShowcase })));
const EmployeeDirectoryPage = React.lazy(() => import('../features/directory/EmployeeDirectoryPage').then((m) => ({ default: m.EmployeeDirectoryPage })));
const LoginPage = React.lazy(() => import('../features/auth/LoginPage').then((m) => ({ default: m.LoginPage })));
const SignupPage = React.lazy(() => import('../features/auth/SignupPage').then((m) => ({ default: m.SignupPage })));
const TermsPage = React.lazy(() => import('../features/legal/TermsPage').then((m) => ({ default: m.TermsPage })));
const PrivacyPage = React.lazy(() => import('../features/legal/PrivacyPage').then((m) => ({ default: m.PrivacyPage })));

// New Life, Mindset & Productivity Command Center Routes
const RoutinesPage = React.lazy(() => import('../features/life/RoutinesPage').then((m) => ({ default: m.RoutinesPage })));
const JournalPage = React.lazy(() => import('../features/journal/JournalPage').then((m) => ({ default: m.JournalPage })));
const PlannerPage = React.lazy(() => import('../features/planner/PlannerPage').then((m) => ({ default: m.PlannerPage })));
const FocusModePage = React.lazy(() => import('../features/focus/FocusModePage').then((m) => ({ default: m.FocusModePage })));
const LearningCenterPage = React.lazy(() => import('../features/learning/LearningCenterPage').then((m) => ({ default: m.LearningCenterPage })));
const FinancePage = React.lazy(() => import('../features/finance/FinancePage').then((m) => ({ default: m.FinancePage })));
const DreamsPage = React.lazy(() => import('../features/dreams/DreamsPage').then((m) => ({ default: m.DreamsPage })));
const SecondBrainPage = React.lazy(() => import('../features/second-brain/SecondBrainPage').then((m) => ({ default: m.SecondBrainPage })));

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
        path: 'life',
        element: (
          <ProtectedRoute>
            <RoutinesPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'routines',
        element: <Navigate to="/life" replace />,
      },
      {
        path: 'habits',
        element: <Navigate to="/life" replace />,
      },
      {
        path: 'journal',
        element: (
          <ProtectedRoute>
            <JournalPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'mindset',
        element: <Navigate to="/journal" replace />,
      },
      {
        path: 'planner',
        element: (
          <ProtectedRoute>
            <PlannerPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'schedule',
        element: <Navigate to="/planner" replace />,
      },
      {
        path: 'focus',
        element: (
          <ProtectedRoute>
            <FocusModePage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'deep-work',
        element: <Navigate to="/focus" replace />,
      },
      {
        path: 'learning',
        element: (
          <ProtectedRoute>
            <LearningCenterPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'skills',
        element: <Navigate to="/learning" replace />,
      },
      {
        path: 'roadmaps',
        element: <Navigate to="/learning" replace />,
      },
      {
        path: 'finance',
        element: (
          <ProtectedRoute>
            <FinancePage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'runway',
        element: <Navigate to="/finance" replace />,
      },
      {
        path: 'budget',
        element: <Navigate to="/finance" replace />,
      },
      {
        path: 'dreams',
        element: (
          <ProtectedRoute>
            <DreamsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'bucket-list',
        element: <Navigate to="/dreams" replace />,
      },
      {
        path: 'second-brain',
        element: (
          <ProtectedRoute>
            <SecondBrainPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'notes',
        element: <Navigate to="/second-brain" replace />,
      },
      {
        path: 'vault',
        element: <Navigate to="/second-brain" replace />,
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
