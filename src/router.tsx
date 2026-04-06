import { createBrowserRouter, RouterProvider } from "react-router-dom";
import type { User } from "@supabase/supabase-js";
import type { Profile } from "./types/profile";

import ProtectedRoute from "./components/auth/ProtectedRoute";
import RoleProtectedRoute from "./components/auth/RoleProtectedRoute";

// layouts
import MainLayout from "./layouts/MainLayout";

// pages
import ErrorPage from "./pages/ErrorPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage"
import SignupPage from "./pages/SignupPage"
import AboutUsPage from "./pages/AboutUsPage"
import EventsPage from "./pages/EventsPage"
import EventDetailsPage from "./pages/EventDetailsPage"
import SavedEventsPage from "./pages/SavedEventsPage";
import SingleRegistrationPage from "./pages/SingleRegistrationPage";
import ProfilePage from "./pages/ProfilePage";
import OrganizerDashboardPage from "./pages/OrganizerDashboardPage";
import VolunteerDashboardPage from "./pages/VolunteerDashboardPage";
import CreateEventPage from "./pages/CreateEventPage";
import EditEventPage from "./pages/EditEventPage";
import ManageFeedbackPage from "./pages/ManageFeedbackPage";
import MyFeedbacksPage from "./pages/MyFeedbacksPage";
import EditFeedbackPage from "./pages/EditFeedbackPage";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import NotFoundPage from "./pages/NotFoundPage";
import MyRegistrationsPage from "./pages/MyRegistrationsPage";

type AppRouterProps = {
  authUser: User | null;
  profile: Profile | null;
};

export default function AppRouter({ authUser, profile }: AppRouterProps) {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout />,
      errorElement: <ErrorPage />,
      children: [
        { index: true, element: <HomePage /> },
        { path: "login", element: <LoginPage /> },
        { path: "signup", element: <SignupPage /> },
        { path: "aboutus", element: <AboutUsPage /> },

        // public event routes
        { path: "events", element: <EventsPage profile={profile} /> },
        { path: "events/:id", element: <EventDetailsPage profile={profile} /> },

        // volunteer routes
        {
          path: "saved-events",
          element: (
            <RoleProtectedRoute user={profile} allowedRole="volunteer">
              <SavedEventsPage />
            </RoleProtectedRoute>
          ),
        },
        {
          path: "user-registrations",
          element: (
            <RoleProtectedRoute user={profile} allowedRole="volunteer">
              <MyRegistrationsPage />
            </RoleProtectedRoute>
          ),
        },
        {
          path: "user-registrations/:id",
          element: (
            <RoleProtectedRoute user={profile} allowedRole="volunteer">
              <SingleRegistrationPage />
            </RoleProtectedRoute>
          ),
        },
        {
          path: "volunteer-dashboard",
          element: (
            <RoleProtectedRoute user={profile} allowedRole="volunteer">
              <VolunteerDashboardPage />
            </RoleProtectedRoute>
          ),
        },

        // volunteer feedback routes
        {
          path: "my-feedbacks",
          element: (
            <RoleProtectedRoute user={profile} allowedRole="volunteer">
              <MyFeedbacksPage />
            </RoleProtectedRoute>
          ),
        },
        {
          path: "my-feedbacks/:id/edit",
          element: (
            <RoleProtectedRoute user={profile} allowedRole="volunteer">
              <EditFeedbackPage />
            </RoleProtectedRoute>
          ),
        },

        // organizer routes
        {
          path: "organizer-dashboard",
          element: (
            <RoleProtectedRoute user={profile} allowedRole="organizer">
              <OrganizerDashboardPage />
            </RoleProtectedRoute>
          ),
        },
        {
          path: "organizer-dashboard/create-event",
          element: (
            <RoleProtectedRoute user={profile} allowedRole="organizer">
              <CreateEventPage userId={profile?.id  }/>
            </RoleProtectedRoute>
          ),
        },
        {
          path: "organizer-dashboard/edit-event/:id",
          element: (
            <RoleProtectedRoute user={profile} allowedRole="organizer">
              <EditEventPage  />
            </RoleProtectedRoute>
          ),
        },
        {
          path: "organizer-dashboard/feedback/:id",
          element: (
            <RoleProtectedRoute user={profile} allowedRole="organizer">
              <ManageFeedbackPage />
            </RoleProtectedRoute>
          ),
        },

        // any logged-in user
        {
          path: "profile",
          element: (
            <ProtectedRoute user={authUser}>
              <ProfilePage />
            </ProtectedRoute>
          ),
        },

        { path: "unauthorized", element: <UnauthorizedPage /> },
        { path: "*", element: <NotFoundPage /> },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}