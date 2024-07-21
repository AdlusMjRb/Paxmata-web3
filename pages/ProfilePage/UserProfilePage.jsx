import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { DivWrapper } from "./DivWrapper/DivWrapper";
import Overlap from "./Overlap/Overlap";
import { OverlapGroup } from "./OverlapGroup/OverlapGroup";
import { OverlapGroupWrapper } from "./OverlapGroupWrapper/OverlapGroupWrapper";
import { OverlapWrapper } from "./OverlapWrapper/OverlapWrapper";
import * as classes from "./UserProfileStyles.module.css";

const UserProfilePage = () => {
  const [user, setUser] = useState(null);
  const router = useRouter();
  const { userId } = router.query;

  useEffect(() => {
    if (userId) {
      fetch(`http://localhost:3001/api/user/${userId}`)
        .then((response) => {
          if (!response.ok) throw new Error(response.statusText);
          return response.json();
        })
        .then((data) => setUser(data))
        .catch((error) => console.error("Error fetching user data:", error));
    }
  }, [userId]);

  if (!user) {
    return <div>Loading user data...</div>;
  }

  return (
    <div className={classes["user-profile-page"]}>
      <div className={classes["div-2"]}>
        <Overlap user={user} /> {/* Pass user data as prop */}
        <OverlapGroup />
        <OverlapWrapper />
        <OverlapGroupWrapper />
        <DivWrapper />
      </div>
    </div>
  );
};

export default UserProfilePage;
