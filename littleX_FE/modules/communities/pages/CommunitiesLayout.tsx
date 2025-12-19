
"use client";

import React from "react";
import LeftTweetSideBar from "@/ds/molecules/left-tweet-sidebar";
import RightTweetSidebar from "@/ds/molecules/right-tweet-sidebar";
import { ProtectedRoute } from "@/ds/wrappers/prtoected-auth";
import {
    MobileNavBar,
    MobileBottomNav,
    MobileRightSidebar,
} from "@/ds/molecules/mobile-components";
import ResponsiveDashboardTemplate from "@/ds/templates/responsive-dashboard-template";
import { useDashboard } from "@/_core/hooks/useDashboard";
import { usePathname } from "next/navigation";

export const CommunitiesLayout = ({ children }: { children: React.ReactNode }) => {
    const {
        userData,
        following,
        suggestions,
        navMenu,
        currentTab, // Might be empty if not passed in URL, but logic handles it
        logout,
        handleSearch,
        handleFollow,
        handleUnfollow,
    } = useDashboard();

    const pathname = usePathname();

    return (
        <ProtectedRoute>
            <ResponsiveDashboardTemplate
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
                leftSidebar={
                    <LeftTweetSideBar
                        logout={logout}
                        userData={userData}
                        navMenu={navMenu}
                        currentRoute={pathname}
                    />
                }
                main={children}
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
