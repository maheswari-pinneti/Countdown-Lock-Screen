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
import { SettingsPage } from '../features/settings/SettingsPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <OverviewPage />,
      },
      {
        path: 'developer',
        element: <DeveloperPage />,
      },
      {
        path: 'interview',
        element: <InterviewPage />,
      },
      {
        path: 'job-hunt',
        element: <JobHuntPage />,
      },
      {
        path: 'career-switch',
        element: <CareerSwitchPage />,
      },
      {
        path: 'first-job',
        element: <FirstJobPage />,
      },
      {
        path: 'countdown-studio',
        element: <CountdownStudioPage />,
      },
      {
        path: 'milestones',
        element: <MilestonesPage />,
      },
      {
        path: 'saved-designs',
        element: <SavedDesignsPage />,
      },
      {
        path: 'my-lock-screens',
        element: <MyLockScreensPage />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
      {
        path: '*',
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);

