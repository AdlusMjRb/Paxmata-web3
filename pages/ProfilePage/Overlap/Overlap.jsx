import React, { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import * as classes from "./Overlapstyle.module.css";
import { UserContext } from "../../../context/UserContext"; // Adjust the path as needed

export const Overlap = () => {
  const { user: contextUser } = useContext(UserContext);
  const [user, setUser] = useState(null);
  const router = useRouter();
  const { userId } = router.query;

  useEffect(() => {
    const fetchUserDetails = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found. Redirecting to login.");
        router.push("/login");
        return;
      }

      try {
        const response = await fetch("http://localhost:3001/api/user/profile", {
          // adjust endpoint as needed
          headers: { Authorization: token },
        });
        const data = await response.json();
        if (!response.ok)
          throw new Error(data.message || "Could not fetch user data");
        setUser(data);
      } catch (error) {
        console.error(error);
        // Optionally redirect to login if fetch fails
      }
    };

    // Use contextUser if it's available and matches the userId in the query
    if (contextUser && contextUser._id === userId) {
      setUser(contextUser);
    } else if (userId) {
      fetchUserData();
    }
  }, [userId, contextUser]);

  if (!user) return <div>Loading user data...</div>;

  return (
    <div className={classes.overlap}>
      <div className={classes.div}>
        {/* Display the username inside a named tag div */}
        <div className={classes["profile-name-tag"]}>
          <div className={classes["text-wrapper"]}>{user?.username}</div>
        </div>

        {/* Conditional rendering based on the user's role */}
        {user?.role === "customer" && (
          <div className={classes["Customer-profile-tag"]}>
            <div className={classes["text-wrapper"]}>Customer</div>
          </div>
        )}
        {user?.role === "investor" && (
          <div className={classes["Investor-profile-tag"]}>
            <img
              alt="Investor profile tag"
              src="https://c.animaapp.com/EcQCwOOK/img/investorprofiletag.svg"
            />
            <div className={classes["text-wrapper-2"]}>Investor</div>
          </div>
        )}
        {user?.role === "developer" && (
          <div className={classes["Devloper-profile-tag"]}>
            <div className={classes["text-wrapper"]}>Developer</div>
          </div>
        )}

        {/* Group label */}
        <div className={classes["text-wrapper-3"]}>Paxmata Groups</div>
      </div>

      {/* SCORS section */}
      <div className={classes["SCORS-circle"]} />
      <div className={classes["overlap-5"]}>
        <div className={classes["text-wrapper-4"]}>Learn more about SCORS</div>
        <div className={classes["SCORS-info-button"]}>
          <div className={classes["text-wrapper-5"]}>here</div>
        </div>
      </div>
    </div>
  );
};

export default Overlap;
