"use client";

import { toast } from 'react-hot-toast';
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { updateRemark } from '@/app/actions/remark/action';

const UpdateRemark = ({ data, setIsUpdate }) => {

    const router = useRouter();
    const [pending, setPending] = useState(false);

    const [remark, setRemark] = useState("");

    const handleForm = async () => {
        setPending(true);
        const formData = new FormData();
        formData.append("id", data?._id);
        formData.append("remark", remark);

        try {
            const response = await updateRemark(formData);

            if (response.status === 201) {
                toast.success(response.message);
                setIsUpdate(false);
                setPending(false);
                router.refresh();
                return;
            } else {
                setPending(false);
                toast.error(response.message);
            }

        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        setRemark(data?.remark ?? "");
    }, []);

    return (
        <div className="create-wrapper">
            <div className="create-modal-wrapper" onClick={() => setIsUpdate(false)}>
                <div className="create-modal" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-header">
                        <h3>Edit Remarks</h3>
                        <i onClick={() => setIsUpdate(false)} className="fa fa-times"></i>
                    </div>
                    <div className="create-form">
                        <form onSubmit={(e) => e.preventDefault()}>
                            <div className="create-form-group">
                                <label>Remark</label>
                                <input
                                    type="text"
                                    placeholder="Please enter remark"
                                    name="remark"
                                    value={remark}
                                    onChange={(e) => setRemark(e.target.value)}
                                />
                            </div>
                            <div className="create-form-action">
                                {
                                    pending
                                        ?
                                        <button className="btn-md btn-tertiary"><>Please wait <i className="fa fa-circle-notch rotating-spinner"></i></></button>
                                        :
                                        <button onClick={() => handleForm()} className="btn-md btn-tertiary">Update</button>
                                }
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default UpdateRemark;