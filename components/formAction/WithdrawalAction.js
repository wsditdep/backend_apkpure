"use client";

import { useState } from "react";
import AlertBox from "../alertBox/AlertBox";
import { withdrawalResponse } from "@/app/actions/withdrawal/action";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const WithdrawalAction = ({ data }) => {

    const router = useRouter();

    const [isApprove, setIsApprove] = useState(false);
    const [isReject, setIsReject] = useState(false);
    const [isLoading, setIsLoading] = useState(false)

    const hanldeApprove = async () => {
        setIsLoading(true);
        try {
            const response = await withdrawalResponse(data?.id, "approved", data?.withdrawal_amount, data?.iid);

            if (response.status === 201) {
                toast.success(response.message);
                setIsLoading(false);
                setIsApprove(false);
                router.refresh();
                return;
            } else {
                setIsApprove(false);
                setIsLoading(false);
                toast.error(response.message);
            }

        } catch (error) {
            setIsApprove(false);
            console.log(error)
        }
    }

    const handleRejection = async () => {
        setIsLoading(true);
        try {
            const response = await withdrawalResponse(data?.id, "rejected", data?.withdrawal_amount, data?.iid);

            if (response.status === 201) {
                toast.success(response.message);
                setIsReject(false);
                setIsLoading(false);
                router.refresh();
                return;
            } else {
                setIsApprove(false);
                toast.error(response.message);
                setIsLoading(false);
            }
 
        } catch (error) {
            setIsLoading(false);
            setIsApprove(false);
            console.log(error)
        }
    }

    return (
        <>
            <td>
                {
                    isReject
                        ?
                        <AlertBox
                            id={data?._id}
                            showConfirm={isReject}
                            setShowConfirm={setIsReject}
                            handleDelete={handleRejection}
                            title={`Alert - Rejection?`}
                            subTitle={`Confirm the withdrawal of "${data?.username}"`}
                            isLoading={isLoading}
                        />
                        :
                        <></>
                }
                {
                    isApprove
                        ?
                        <AlertBox
                            id={data?._id}
                            showConfirm={isApprove}
                            setShowConfirm={setIsApprove}
                            handleDelete={hanldeApprove}
                            title={`Alert - Approval?`}
                            subTitle={`Confirm the withdrawal of "${data?.username}"`}
                            isLoading={isLoading}
                        />
                        :
                        <></>
                }
            </td>
            <td className="table-operations overrideflex">
                <div className="table-operation-childs" style={{width: "9rem"}}>
                    {
                        data?.status === "pending"
                            ?
                            <>
                                <button className="btn-tertiary mr-4 mb-4" onClick={() => setIsApprove(true)}>Approve</button>
                                <button className="btn-secondary mr-4 mb-4" onClick={() => setIsReject(true)} >Reject</button>
                            </>
                            :
                            data?.status === "rejected"
                                ?
                                <>
                                    <p className="responded-rejected">Rejected</p>
                                </>
                                :
                                <>
                                    <p className="responded">OK'd</p>
                                </>

                    }
                </div>
            </td>
        </>
    )
}

export default WithdrawalAction