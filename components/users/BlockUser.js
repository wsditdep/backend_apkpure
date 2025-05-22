"use client";

import { blockUser } from "@/app/actions/user/action";
import { useEffect, useState } from "react";
import { toast } from 'react-hot-toast';
import { useRouter } from "next/navigation";

const BlockUser = ({ data }) => {

    const router = useRouter();

    const [isChecked, setIsChecked] = useState(true);

    const handleForm = async () => {

        const statusValue = !isChecked;

        const formData = new FormData();
        formData.append("id", data?._id);
        formData.append("status", statusValue);

        try {
            const response = await blockUser(formData);

            if (response.status === 201) {
                toast.success(response.message);
                router.refresh();
                return;
            } else {
                toast.error(response.message);
            }

        } catch (error) {
            console.log(error)
        }
    }

    const handleCheckboxChange = () => {
        handleForm();
    };

    useEffect(() => {
        setIsChecked(data?.status)
    }, [data?.status]);

    return (
        <>
            <div className="toggle-btn-app-block">
                <form>
                    <label className="switch">
                        <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={handleCheckboxChange}
                        />
                        <span className="slider round"></span>
                    </label>
                </form>
            </div>
        </>
    )
}


export default BlockUser