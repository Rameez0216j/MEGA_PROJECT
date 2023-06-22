import React from "react";
import { useEffect, useRef, useState } from "react";
import { FiUpload } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";

import { updateDisplayPicture } from "../../../../services/operations/SettingsAPI";
import IconBtn from "../../../common/IconBtn";

const ChangeProfilePicture = () => {
    const { token } = useSelector((state) => state.auth);
    const { user } = useSelector((state) => state.profile);
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    // Below state varible is used to set preview of profile picture (It actuallly refers to a Image being uploaded by the user)
    const [previewSource, setPreviewSource] = useState(null);

    // useRef hook is a built-in hook that provides a way to create a mutable reference to an element or value. It allows you to persist a value across component renders without triggering a re-render.
    const fileInputRef = useRef(null);

    const handleClick = () => {
        // below line triggers click event for referred element fileInpurRef.current by
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            previewFile(file);
        }
    };

    const previewFile = (file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setPreviewSource(reader.result);
        };
    };

    const handleFileUpload = () => {
        try {
            console.log("Uploading...");
            setLoading(true);
            const formData = new FormData();
            formData.append("displayPicture", imageFile);
            dispatch(updateDisplayPicture(token, formData)).then(() => {
                setLoading(false);
            });
            console.log("called api")
        } catch (error) {
            console.log(error.message);
        }
    };

    useEffect(() => {
        if (imageFile) {
            previewFile(imageFile);
        }
    }, [imageFile]);

    return (
        <div className="flex items-center bg-richblack-800 rounded-md border-[1px] border-richblack-700 p-8 text-richblack-5">
            <div className="flex items-center gap-x-4">
                <img
                    src={previewSource || user?.image}
                    alt={`profile-${user?.firstName}`}
                    className="aspect-square w-[78px] rounded-full object-cover"
                />
                <div className="space-y-2">
                    <p>Change Profile Picture</p>
                    <div className="flex gap-3">
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                            accept="image/png, image/gif, image/jpeg"
                        />
                        <button
                            onClick={handleClick}
                            disabled={loading}
                            className="cursor-ponter rounded-md bg-richblack-700 py-2 px-5 font-semibold text-richblack-50"
                        >
                            Select
                        </button>
                        <IconBtn
                            text={loading ? "Uploading..." : "Upload"}
                            onclick={handleFileUpload}
                        >
                            {!loading && (
                                <FiUpload className="text-lg text-richblack-900" />
                            )}
                        </IconBtn>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChangeProfilePicture;
