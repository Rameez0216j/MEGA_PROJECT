import React from "react";
import ChangeProfilePicture from "./ChangeProfilePicture"
import DeleteAccount from "./DeleteAccount"
import EditProfile from "./EditProfile"
import UpdatePassword from "./UpdatePassword"

const index = () => {
    return (
        <div>
            <h1 className="">Edit Profile</h1>
            {/* Change Profile Picture */}
            <ChangeProfilePicture />
            {/* Profile */}
            <EditProfile />
            {/* Password */}
            <UpdatePassword />
            {/* Delete Account */}
            <DeleteAccount />
        </div>
    );
};

export default index;
