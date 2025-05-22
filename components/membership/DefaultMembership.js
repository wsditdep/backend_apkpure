"use client";

import { useEffect, useState } from "react";
import { toast } from 'react-hot-toast';
import { useRouter } from "next/navigation";
import { handleDefaultMambership } from "@/app/actions/membership/action";

const DefaultMembership = ({ data }) => {
    const router = useRouter();
    const [isChecked, setIsChecked] = useState(data?.is_default);

    const handleForm = async () => {
        try {
            const response = await handleDefaultMambership(data?._id);

            if (response.status === 201) {
                toast.success(response.message);
                router.refresh();
                return;
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleCheckboxChange = () => {
        handleForm();
    };

    useEffect(() => {
        setIsChecked(data?.is_default);
    }, [data?.is_default]);

    return (
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
    );
};

export default DefaultMembership;
