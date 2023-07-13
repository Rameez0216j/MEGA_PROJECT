import { toast } from "react-hot-toast";
import { setLoading, setToken } from "../../slices/authSlice";
import { resetCart } from "../../slices/cartSlice";
import { setUser } from "../../slices/profileSlice";
import { apiConnector } from "../apiconnector";
import { endpoints } from "../apis";

const {
    SENDOTP_API,
    SIGNUP_API,
    LOGIN_API,
    RESETPASSTOKEN_API,
    RESETPASSWORD_API,
    ADDTOCART_API,
} = endpoints;

export function sendOtp(email, navigate) {
    return async (dispatch) => {
        const toastId = toast.loading("Loading...");
        dispatch(setLoading(true));
        try {
            // response is not received if other than 200 status code is received so try accessing response using error
            const response = await apiConnector("POST", SENDOTP_API, {
                email,
                checkUserPresent: true,
            });

            if (!response.data.success) {
                throw new Error(response.data.message);
            }

            toast.success("OTP Sent Successfully");
            navigate("/verify-email");
        } catch (error) {
            toast.error(error?.response?.data?.message);
            dispatch(setLoading(false));
            toast.dismiss(toastId);
        }
        dispatch(setLoading(false));
        toast.dismiss(toastId);
    };
}

export function signUp(
    accountType,
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    otp,
    navigate
) {
    return async (dispatch) => {
        const toastId = toast.loading("Loading...");
        dispatch(setLoading(true));
        try {
            const response = await apiConnector("POST", SIGNUP_API, {
                accountType,
                firstName,
                lastName,
                email,
                password,
                confirmPassword,
                otp,
            });

            if (!response.data.success) {
                throw new Error(response.data.message);
            }
            toast.success("Signup Successful");
            navigate("/login");
        } catch (error) {
            toast.error("Signup Failed");
            navigate("/signup");
        }
        dispatch(setLoading(false));
        toast.dismiss(toastId);
    };
}

export function login(email, password, navigate) {
    return async (dispatch) => {
        dispatch(setLoading(true));
        try {
            const response = await apiConnector("POST", LOGIN_API, {
                email,
                password,
            });
            console.log("LOGIN API RESPONSE............", response);
            if (!response.data.success) {
                throw new Error(response.data.message);
            }
            toast.success("Login Successful");
            dispatch(setToken(response.data.token));
            const userImage = response.data?.user?.image
                ? response.data.user.image
                : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.user.firstName} ${response.data.user.lastName}`;
            dispatch(setUser({ ...response.data.user, image: userImage }));
            localStorage.setItem("token", JSON.stringify(response.data.token));
            localStorage.setItem("user", JSON.stringify(response.data.user));
            navigate("/dashboard/my-profile");
        } catch (error) {
            toast.error("Login Failed");
        }
        dispatch(setLoading(false));
    };
}

export function getPasswordResetToken(email, setEmailSent) {
    return async (dispatch) => {
        const toastId = toast.loading("Loading...");
        dispatch(setLoading(true));
        try {
            const response = await apiConnector("POST", RESETPASSTOKEN_API, {
                email,
            });

            if (!response.data.success) {
                toast.error(response.data.message);
                toast.dismiss(toastId);
                dispatch(setLoading(false));
                return;
            }
            toast.success("Reset Email Sent");
            setEmailSent(true);
        } catch (error) {
            console.log(error);
        }
        toast.dismiss(toastId);
        dispatch(setLoading(false));
    };
}

export function resetPassword(password, confirmPassword, token, navigate) {
    return async (dispatch) => {
        const toastId = toast.loading("Loading...");
        dispatch(setLoading(true));
        try {
            const response = await apiConnector("POST", RESETPASSWORD_API, {
                password,
                confirmPassword,
                token,
            });

            if (!response.data.success) {
                throw new Error(response.data.message);
            }

            toast.success("Password Reset Successfully");
            navigate("/login");
        } catch (error) {
            toast.error("Failed To Reset Password");
        }
        toast.dismiss(toastId);
        dispatch(setLoading(false));
    };
}

export function logout(navigate,user,cart,token) {
    return async (dispatch) => {
        // try {
        //     const response = await apiConnector("POST", ADDTOCART_API, {
        //         cart,
		// 		user,
        //     });
		// 	console.log(response)
        // } catch (error) {
        //     toast.error("Failed To Reset Password");
        // }
		console.log("USER :",user);
		console.log("CART :",cart)
		console.log("TOKEM :",token)
        dispatch(setToken(null));
        dispatch(setUser(null));
        dispatch(resetCart());
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        toast.success("Logged Out");
        navigate("/");
    };
}
