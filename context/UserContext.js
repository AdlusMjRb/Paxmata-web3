import React, { createContext, useState, useEffect } from "react";

export const UserContext = createContext({
  user: null,
  setUser: () => {}, // Ensure setUser is part of the context
  fetchUserData: () => {},
  authToken: null,
});

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authToken, setAuthToken] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      setAuthToken(token);
    }
  }, []);

  const fetchUserData = async () => {
    if (!authToken) {
      console.log("No authToken found. User might not be logged in.");
      return;
    }

    try {
      const response = await fetch(`/api/current_user`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Could not fetch user data");
      }

      const userData = await response.json();
      setUser(userData);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, fetchUserData, authToken }}>
      {children}
    </UserContext.Provider>
  );
};
