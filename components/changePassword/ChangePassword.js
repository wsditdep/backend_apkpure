"use client";

import { changePassword } from "@/app/actions/user/action";
import { useFormStatus } from "react-dom";
import { toast } from 'react-hot-toast';
import { useRouter } from "next/navigation";
import { useState } from "react";

function Submit() {
    const { pending } = useFormStatus();

    return (
        <>
            {
                pending
                    ?
                    ""
                    :
                    ""
            }
            <button type="submit" className={pending ? "btn-md btn-tertiary managedDisabled" : "btn-md btn-tertiary"}> {
                pending ?
                    <>Please wait<i className="fa fa-circle-notch rotating-spinner"></i></>
                    :
                    `Change Password`
            }
            </button>
        </>
    )
}

const ChangePassword = ({ id }) => {

    const [password, setPassword] = useState("");

    const handleForm = async (formData) => {

        if (!password) {
            return toast.error("Enter your new password");
        }

        try {
            const response = await changePassword(formData);

            if (response.status === 201) {
                toast.success(response.message);
                return;
            } else {
                toast.error(response.message);
            }

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="create-wrapper">
            <div className="create-form">
                <form action={handleForm} >
                    <div className="create-form-group flex-start">
                        <label>Enter your password <span>*</span></label>
                        <input
                            type="text"
                            placeholder="Enter your new password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <input
                            type="hidden"
                            name="id"
                            value={id}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="create-form-action flex-start">
                        <Submit />
                    </div>
                </form>
            </div>
        </div>
    )
}


export default ChangePassword;