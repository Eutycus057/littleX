"use client";

import React from "react";

import LeftTweetSideBar from "@/ds/molecules/left-tweet-sidebar";
import RightTweetSidebar from "@/ds/molecules/right-tweet-sidebar";
import MainFeed from "@/ds/molecules/tweet-main";
import CheckProfile from "@/ds/molecules/check-profile-dialog";
import { ProtectedRoute } from "@/ds/wrappers/prtoected-auth";
import {
  MobileNavBar,
  MobileBottomNav,
  MobileRightSidebar,
} from "@/ds/molecules/mobile-components";

import ResponsiveDashboardTemplate from "@/ds/templates/responsive-dashboard-template";
import { useDashboard } from "@/_core/hooks/useDashboard";
import { useRouter } from "next/navigation";
import { APP_ROUTES } from "@/_core/keys";
import { AnalyticsDashboard } from "@/modules/analytics/components/AnalyticsDashboard";
import { Loader2 } from "lucide-react";

const TweetPage = () => {
  const {
    profile,
    userData,
    following,
    suggestions,
    isLoading,
    navMenu,
    currentTab,
    logout,
    handleSearch,
    handleFollow,
    handleUnfollow,
    feeds,
    searchResult,
    userTweets,
    error,
  } = useDashboard();
  const router = useRouter();

  // If profile not set up, redirect to register
  // React.useEffect(() => {
  //   if (profile?.user?.username === "") {
  //     router.push(APP_ROUTES.REGISTER);
  //   }
  // }, [profile, router]);

  if (profile?.user?.username === "") {
    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading specific profile data...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center gap-4 text-center">
            <p className="text-destructive font-medium">Error loading profile</p>
            <p className="text-sm text-muted-foreground">{error}</p>
            <button
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        </div>
      );
    }

    // If not loading and no error, but username is empty, prompt to create profile
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <CheckProfile open={true} isLoading={isLoading} />
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <ResponsiveDashboardTemplate
        // Mobile components
        mobileNavBar={
          <MobileNavBar userData={userData} onSearchSubmit={handleSearch} />
        }
        mobileBottomNav={<MobileBottomNav />}
        mobileRightSidebar={
          <MobileRightSidebar
            userData={userData}
            following={following}
            suggestions={suggestions}
            onFollow={handleFollow}
            onUnfollow={handleUnfollow}
          />
        }
        // Desktop components
        leftSidebar={
          <LeftTweetSideBar
            logout={logout}
            userData={userData}
            navMenu={navMenu}
            currentRoute={`/?tab=${currentTab}`}
          />
        }

        main={
          currentTab === "analytics" ? (
            <AnalyticsDashboard />
          ) : (
            <MainFeed
              feeds={feeds}
              userTweets={userTweets}
              searchResult={searchResult}
              profile={profile.user}
              isLoading={isLoading}
            />
          )
        }
        rightSidebar={
          <RightTweetSidebar
            userData={userData}
            following={following}
            suggetions={suggestions}
          />
        }
        sidebarWidth="w-72"
      />
    </ProtectedRoute>
  );
};

export default TweetPage;
