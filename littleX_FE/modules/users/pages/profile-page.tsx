"use client";

import React from "react";
import { ProtectedRoute } from "@/ds/wrappers/prtoected-auth";
import ResponsiveDashboardTemplate from "@/ds/templates/responsive-dashboard-template";
import LeftTweetSideBar from "@/ds/molecules/left-tweet-sidebar";
import RightTweetSidebar from "@/ds/molecules/right-tweet-sidebar";
import CheckProfile from "@/ds/molecules/check-profile-dialog";
import { TweetCard } from "@/ds/organisms/tweet-card";
import { useDashboard } from "@/_core/hooks/useDashboard";
import {
  MobileNavBar,
  MobileBottomNav,
  MobileRightSidebar,
} from "@/ds/molecules/mobile-components";
import { Loader2 } from "lucide-react";

export default function ProfilePage() {
  const {
    profile,
    userData,
    following,
    suggestions,
    isLoading,
    navMenu,
    logout,
    handleSearch,
    handleFollow,
    handleUnfollow,
    userTweets,
  } = useDashboard();

  // Loading Skeleton
  if (isLoading) {
    return (
      <ProtectedRoute>
        <ResponsiveDashboardTemplate
          leftSidebar={<div className="h-screen w-full bg-muted/20 animate-pulse" />}
          rightSidebar={<div className="h-screen w-full bg-muted/20 animate-pulse" />}
          main={
            <div className="space-y-4 p-4">
              <div className="h-8 w-1/3 bg-muted rounded animate-pulse" />
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-40 w-full bg-muted rounded-xl animate-pulse" />
              ))}
            </div>
          }
          sidebarWidth="w-72"
        />
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      {userData.username === "" ? (
        <CheckProfile open={true} isLoading={isLoading} />
      ) : (
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
              currentRoute="/profile"
            />
          }
          rightSidebar={
            <RightTweetSidebar
              userData={userData}
              following={following}
              suggetions={suggestions}
            />
          }
          main={
            <div className="space-y-4 p-4 md:p-0">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-bold">My Tweets</h1>
                  <p className="text-muted-foreground">{userData.email}</p>
                </div>
              </div>

              {userTweets.length > 0 ? (
                userTweets.map((tweet) => (
                  <TweetCard
                    key={tweet.id}
                    {...tweet}
                    profile={profile.user}
                  />
                ))
              ) : (
                <div className="text-center py-10 text-muted-foreground bg-card border rounded-xl p-8">
                  <p>You haven't posted any tweets yet.</p>
                </div>
              )}
            </div>
          }
          sidebarWidth="w-72"
        />
      )}
    </ProtectedRoute>
  );
}