"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import AlertBox from "@/components/alertBox/AlertBox";
import { deleteRole } from "@/app/actions/role/action";
import UpdateRole from "./UpdateRole";

const RoleAction = ({ data }) => {

    const router = useRouter();

    const [isModal, setIsModal] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const hanldeDelete = async () => {
        setIsLoading(true);
        try {
            const response = await deleteRole(data?._id);

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
                {
                    isModal
                        ?
                        <AlertBox
                            id={data?._id}
                            showConfirm={isModal}
                            setShowConfirm={setIsModal}
                            handleDelete={hanldeDelete}
                            title="Confirmation"
                            subTitle="Are you sure you want to delete this role?"
                            isLoading={isLoading}
                        />
                        :
                        <></>
                }
                {
                    isUpdate
                        ?
                        <UpdateRole
                            data={data}
                            setIsUpdate={setIsUpdate}
                        />
                        :
                        <></>
                }
            </td>
            <td className="table-operations">
                <div className="table-operation-childs">
                    <button className="btn-outline mr-4 mb-4" onClick={() => setIsUpdate(true)}>Edit</button>
                    <button className="btn-secondary mr-4 mb-4" onClick={() => setIsModal(true)} >Delete</button>
                </div>
            </td>
        </>
    )
}

export default RoleAction;