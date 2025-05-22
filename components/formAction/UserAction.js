"use client";

import Link from 'next/link';
import Recharge from '../recharge/Recharge';
import { useState } from 'react';
import AlertBox from '../alertBox/AlertBox';
import { toast } from 'react-hot-toast';
import { fetchDataWithID, resetUser } from '@/app/actions/user/action';
import UpdateUser from '../users/UpdateUser';
import UpdateWalletaddress from '../users/UpdateWalletaddress';
import { useRouter } from 'next/navigation';
import SubLoader from '../progress/SubLoader';

export const UserAction = ({ data, membership, index, permission, subPermission }) => {

    const router = useRouter();

    const [showModal, setShowModal] = useState(false);
    const [isReset, setIsReset] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);
    const [isWalletAddress, setIsWalletAddress] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [editableData, setEditableData] = useState([]);

    const sendToAccountChange = () => {
        return router.push(`/dashboard/trade/accountChange?q=${data?.username}&qphone=${data?.phone_number}`);
    }

    const sendToDealingHistory = () => {
        return router.push(`/dashboard/dealingHistory?q=${data?._id}`);
    }

    const proceedForUpdate = async (id) => {
        setIsLoading(true);
        const formData = new FormData();
        formData.append("id", id);

        const res = await fetchDataWithID(formData);

        if (res.status === 201) {
            setEditableData(res?.data);
            setIsUpdate(true);
            setIsLoading(false);
        } else {
            toast.error("Error");
            setIsLoading(false);
        }
    }

    const proceedForUpdateWallet = async (id) => {
        setIsLoading(true);
        const formData = new FormData();
        formData.append("id", id);

        const res = await fetchDataWithID(formData);

        if (res.status === 201) {
            setEditableData(res?.data);
            setIsWalletAddress(true);
            setIsLoading(false);
        } else {
            toast.error("Error");
            setIsLoading(false);
        }
    }

    const handleReset = async (id) => {
        try {
            const response = await resetUser(id);

            if (response.status === 201) {
                toast.success(response.message);
                setIsReset(false);
                router.refresh();
                return;
            } else {
                setIsReset(false);
                toast.error(response.message);
            }

        } catch (error) {
            setIsReset(false);
            console.log(error)
        }
    }

    return (
        <>
            {
                isLoading
                    ?
                    <SubLoader />
                    :
                    <></>
            }
            <td className="translate_enble">
                <Recharge
                    data={data}
                    showModal={showModal}
                    setShowModal={setShowModal}
                    permission={permission}
                />
                <UpdateUser
                    membership={membership}
                    data={editableData}
                    isUpdate={isUpdate}
                    setIsUpdate={setIsUpdate}
                />
                <UpdateWalletaddress
                    data={editableData}
                    isWalletAddress={isWalletAddress}
                    setIsWalletAddress={setIsWalletAddress}
                />
                {
                    isReset
                        ?
                        <AlertBox
                            id={data?._id}
                            showConfirm={isReset}
                            setShowConfirm={setIsReset}
                            handleDelete={handleReset}
                            title={`Reset the number of received orders`}
                            subTitle={`Confirm reset "${data?.username}" number of received orders?!`}
                        />
                        :
                        <></>
                }
            </td>
            <td className="table-operations list-table-last-child translate_enble" style={{ zIndex: index }}>
                <div className="table-operation-childs">
                    {
                        permission?.setUpOrder
                            ?
                            <Link href={`/dashboard/journey/${data?._id}`}>
                                <button className="btn-primary mr-4 mb-4">Set up orders</button>
                            </Link>
                            :
                            <></>
                    }
                    {
                        permission?.resetOrderQuantity
                            ?
                            <button className="btn-tertiary mr-4 mb-4" onClick={() => setIsReset(true)}>Reset order quantity</button>
                            :
                            <></>
                    }
                </div>
                <div className="table-operation-childs">
                    {
                        permission?.creditDebit
                            ?
                            <button className="btn-secondary mr-4 mb-4" onClick={() => setShowModal(true)}>Add Debit</button>
                            :
                            <></>
                    }
                    {
                        permission?.moreActions
                            ?
                            <button className="btn-outline mr-4 mb-4 include-sub-menu">
                                More actions
                                <div className="sub-menu show_menu_options">
                                    <ul>
                                        {
                                            subPermission?.walletInfo
                                                ?
                                                <li onClick={() => proceedForUpdateWallet(data?._id)}><i className="fa fa-angle-right"></i> Wallet Information</li>
                                                :
                                                <></>
                                        }
                                        {
                                            subPermission?.edit
                                                ?
                                                <li onClick={() => proceedForUpdate(data?._id)}><i className="fa fa-angle-right"></i> Edit</li>
                                                :
                                                <></>
                                        }
                                        {
                                            subPermission?.accountChangeMenu
                                                ?
                                                <li onClick={() => sendToAccountChange()}><i className="fa fa-angle-right"></i> Account Change</li>
                                                :
                                                <></>
                                        }
                                        {
                                            subPermission?.dealingHistory
                                                ?
                                                <li onClick={() => sendToDealingHistory()}><i className="fa fa-angle-right"></i> Dealing History</li>
                                                :
                                                <></>
                                        }
                                    </ul>
                                </div>
                            </button>
                            :
                            <></>
                    }
                </div>
            </td>
        </>
    )
}
