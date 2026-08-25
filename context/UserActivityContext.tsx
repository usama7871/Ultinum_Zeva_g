"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { UserActivity } from "@/types/soup";

interface UserActivityContextType {
  activity: UserActivity;
  logProductVisit: (productId: string) => void;
  clearHistory: () => void;
}

const UserActivityContext = createContext<UserActivityContextType | undefined>(undefined);

export const UserActivityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activity, setActivity] = useState<UserActivity>({
    recentlyViewedProductIds: [],
    lastVisitedAt: new Date().toISOString(),
  });

  // Load from localStorage on mount
  useEffect(() => {
    const savedActivity = localStorage.getItem("ZEVA_Jee_activity");
    if (!savedActivity) return;

    const timer = window.setTimeout(() => {
      try {
        setActivity(JSON.parse(savedActivity));
      } catch (e) {
        console.error("Failed to parse user activity", e);
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem("ZEVA_Jee_activity", JSON.stringify(activity));
  }, [activity]);

  const logProductVisit = (productId: string) => {
    setActivity((prev) => {
      // Remove product if already in list to move it to the front
      const filtered = prev.recentlyViewedProductIds.filter((id) => id !== productId);
      const updatedList = [productId, ...filtered].slice(0, 10); // Keep last 10 visits

      return {
        ...prev,
        recentlyViewedProductIds: updatedList,
        lastVisitedAt: new Date().toISOString(),
      };
    });
  };

  const clearHistory = () => {
    setActivity({
      recentlyViewedProductIds: [],
      lastVisitedAt: new Date().toISOString(),
    });
  };

  return (
    <UserActivityContext.Provider value={{ activity, logProductVisit, clearHistory }}>
      {children}
    </UserActivityContext.Provider>
  );
};

export const useUserActivity = () => {
  const context = useContext(UserActivityContext);
  if (context === undefined) {
    throw new Error("useUserActivity must be used within a UserActivityProvider");
  }
  return context;
};
