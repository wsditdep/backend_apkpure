"use client";

import { useState } from "react";
import AlertBox from "../alertBox/AlertBox";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { deleteUser } from "@/app/actions/user/action";
import UpdateSystemUser from "../systemManagement/systemUser/UpdateSystemUser";

const SystemUserAction = ({ data, membership, agents, roles, authenticatedUser }) => {

    const router = useRouter();

    const [isModal, setIsModal] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const hanldeDelete = async () => {
        setIsLoading(true);
        try {
            const response = await deleteUser(data?._id);

            if (response.status === 201) {
                toast.success(response.message);
                setIsModal(false);
                setIsLoading(false);
                router.refresh();
                return;
            } else {
                setIsLoading(false);
                setIsModal(false);
                toast.error(response.message);
            }

        } catch (error) {
            setIsLoading(false);
            setIsModal(false);
            console.log(error)
        }
    }

    return (
        <>
            <td>
                <UpdateSystemUser
                    membership={membership}
                    data={data}
                    isUpdate={isUpdate}
                    setIsUpdate={setIsUpdate}
                    roles={roles}
                    agents={agents}
                    authenticatedUser={authenticatedUser}
                />
                {
                    isModal
                        ?
                        <AlertBox
                            id={data?._id}
                            showConfirm={isModal}
                            setShowConfirm={setIsModal}
                            handleDelete={hanldeDelete}
                            title={authenticatedUser?.language === "en" ? "Confirmation" : "确认"}
                            subTitle={authenticatedUser?.language === "en" ? "Are you sure you want to delete?" : "您确定要删除吗！"}
                            authenticatedUser={authenticatedUser}
                            isLoading={isLoading}
                        />
                        :
                        <></>
                }
            </td>
            <td className="table-operations">
                <div className="table-operation-childs">
                    <button className="btn-outline mr-4 mb-4" onClick={() => setIsUpdate(true)}>{authenticatedUser?.language === "en" ? "Edit" : "编辑"}</button>
                    <button className="btn-secondary mr-4 mb-4" onClick={() => setIsModal(true)} >{authenticatedUser?.language === "en" ? "Delete" : "删除"}</button>
                </div>
            </td>
        </>
    )
}

export default SystemUserAction