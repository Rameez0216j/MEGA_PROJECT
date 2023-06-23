import { toast } from "react-hot-toast";
import { setUser } from "../../slices/profileSlice";
import { apiConnector } from "../apiconnector";
import { settingsEndpoints } from "../apis";
import { logout } from "./authAPI";

const {
    UPDATE_DISPLAY_PICTURE_API,
    UPDATE_PROFILE_API,
    CHANGE_PASSWORD_API,
    DELETE_PROFILE_API,
} = settingsEndpoints;

export function updateDisplayPicture(token, formData) {
    return async (dispatch) => {
        const toastId = toast.loading("Loading...");
        try {

            console.log("Calling API...")
            const response = await apiConnector(
                "PUT",
                UPDATE_DISPLAY_PICTURE_API,
                formData,
                {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                }
            );

            console.log("API call ended")
            
            if (!response.data.success) {
                throw new Error(response.data.message);
            }
            toast.success("Display Picture Updated Successfully");
            localStorage.setItem("user", JSON.stringify(response.data.data));
            dispatch(setUser(response.data.data));
        } catch (error) {
            toast.error("Could Not Update Display Picture");
        }
        toast.dismiss(toastId);
    };
}

export function updateProfile(token, formData) {
    return async (dispatch) => {
        const toastId = toast.loading("Loading...");
        try {
            console.log("Calling Api");
            const response = await apiConnector(
                "PUT",
                UPDATE_PROFILE_API,
                formData,
                {
                    Authorization: `Bearer ${token}`,
                }
            );
            
            console.log( "Response :",response)

            if (!response.data.success) {
                throw new Error(response.data.message);
            }
            
            // console.log(response.data.profile);
            const userImage = response?.data?.updatedUserDetails?.image
                ? response?.data?.updatedUserDetails?.image
                : `https://api.dicebear.com/5.x/initials/svg?seed=${response?.data?.updatedUserDetails?.firstName} ${response?.data?.updatedUserDetails?.lastName}`;

            const newUserDetails={
                ...response?.data?.updatedUserDetails,
                image:userImage
            }

            dispatch(
                setUser(newUserDetails)
            );

            localStorage.setItem("user",newUserDetails)

            
            toast.success("Profile Updated Successfully");
        } catch (error) {
            toast.error("Could Not Update Profile");
        }
        toast.dismiss(toastId);
    };
}

export async function changePassword(token, formData) {
    const toastId = toast.loading("Loading...");
    try {
        const response = await apiConnector(
            "POST",
            CHANGE_PASSWORD_API,
            formData,
            {
                Authorization: `Bearer ${token}`,
            }
        );

        if (!response.data.success) {
            throw new Error(response.data.message);
        }
        toast.success("Password Changed Successfully");
    } catch (error) {
        toast.error(error.response.data.message);
    }
    toast.dismiss(toastId);
}

export function deleteProfile(token, navigate) {
    return async (dispatch) => {
        const toastId = toast.loading("Loading...");
        try {
            const response = await apiConnector(
                "DELETE",
                DELETE_PROFILE_API,
                null,
                {
                    Authorization: `Bearer ${token}`,
                }
            );

            if (!response.data.success) {
                throw new Error(response.data.message);
            }
            toast.success("Profile Deleted Successfully");
            dispatch(logout(navigate));
        } catch (error) {
            toast.error("Could Not Delete Profile");
        }
        toast.dismiss(toastId);
    };
}
