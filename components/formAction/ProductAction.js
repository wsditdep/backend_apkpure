"use client";

import { useState } from "react";
import AlertBox from "../alertBox/AlertBox";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { deleteProduct } from "@/app/actions/product/action";
import UpdateProduct from "../product/updateProduct";

const ProductAction = ({ data }) => {

    const router = useRouter();

    const [isModal, setIsModal] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const hanldeDelete = async () => {
        setIsLoading(true);
        try {
            const response = await deleteProduct(data?._id);

            if (response.status === 201) {
                toast.success(response.message);
                setIsModal(false);
                setIsLoading(false);
                router.refresh();
                return;
            } else {
                setIsModal(false);
                setIsLoading(false);
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
                            subTitle="Are you sure you want to delete?"
                            isLoading={isLoading}
                        />
                        :
                        <></>
                }
                {
                    isUpdate
                        ?
                        <UpdateProduct data={data} setIsUpdate={setIsUpdate} />
                        :
                        <></>
                }
            </td>
            <td className="table-operations">
                <div className="table-operation-childs">
                    <button className={process.env.NEXT_PUBLIC_IS_SELF_PRODUCT === "true" ? "btn-outline mr-4 mb-4" : "btn-outline mr-4 mb-4 noActionAvailable"} onClick={() => setIsUpdate(true)}>Edit</button>
                    <button className={process.env.NEXT_PUBLIC_IS_SELF_PRODUCT === "true" ? "btn-secondary mr-4 mb-4" : "btn-secondary mr-4 mb-4 noActionAvailable"} onClick={() => setIsModal(true)} >Delete</button>
                </div>
            </td>
        </>
    )
}

export default ProductAction;