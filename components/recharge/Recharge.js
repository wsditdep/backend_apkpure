"use client";

import { rechargeAccount } from "@/app/actions/user/action";
import { useState } from "react";
import { useFormStatus } from "react-dom";
import { toast } from 'react-hot-toast';
import { useRouter } from "next/navigation";

function Submit({ setShowModal }) {
    const { pending } = useFormStatus();

    return (
        <>
            {
                pending
                    ?
                    ""
                    :
                    <div className="btn btn-outline mr-4 btn-md" onClick={() => setShowModal(false)}>Cancel</div>
            }
            <button type="submit" className={pending ? "btn-md btn-tertiary managedDisabled" : "btn-md btn-tertiary"}> {
                pending ?
                    <>Please wait<i className="fa fa-circle-notch rotating-spinner"></i></>
                    :
                    `Submit`
            }
            </button>
        </>
    )
}

const Recharge = ({ data, setShowModal, showModal, permission }) => {
    const router = useRouter();

    const [selectedType, setSelectedType] = useState('credit');

    const [remark, setRemark] = useState("");

    const handleTypeChange = (e) => {
        setSelectedType(e.target.value);

    };

    const handleForm = async (formData) => {

        if (remark !== "") {
            const formData = new FormData();
            formData.append("remark", remark);
            setRemark("");
        }

        try {
            const response = await rechargeAccount(formData);

            if (response.status === 201) {
                toast.success(response.message);
                setShowModal(false);
                setSelectedType("credit")
                router.refresh();
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
            {
                showModal
                    ?
                    <div className="create-modal-wrapper" onClick={() => {
                        setShowModal(false);
                        setSelectedType("credit");
                    }}>
                        <div className="create-modal" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h3>Add Debit</h3>
                                <i onClick={() => setShowModal(false)} className="fa fa-times"></i>
                            </div>
                            <div className="create-form">
                                <form action={handleForm} >
                                    <div className="create-form-group">
                                        <label>Member Account <span>*</span></label>
                                        <input
                                            type="text"
                                            placeholder="Please enter user name"
                                            name="username"
                                            value={data?.username}
                                            readOnly
                                        />
                                        <input
                                            type="hidden"
                                            placeholder="Please enter user name"
                                            name="_id"
                                            value={data?._id}
                                        />
                                    </div>
                                    <div className="create-form-group">
                                        <label>Type <span>*</span></label>
                                        <div className="radio-btn-type">
                                            <div className="radio-btn-type-child">
                                                <label>Credit(+)</label>
                                                <input
                                                    type="radio"
                                                    name="type"
                                                    value="credit"
                                                    checked={selectedType === 'credit'}
                                                    onChange={handleTypeChange}
                                                />
                                            </div>
                                            <div className="radio-btn-type-child">
                                                <label>Debit(-)</label>
                                                <input
                                                    type="radio"
                                                    name="type"
                                                    value="debit"
                                                    checked={selectedType === 'debit'}
                                                    onChange={handleTypeChange}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="create-form-group">
                                        <label>Amount <span>*</span></label>
                                        <input
                                            type="number"
                                            placeholder="Please enter amount"
                                            name="amount"
                                            step="any"
                                            onWheel={(e) => e.target.blur()}
                                            required
                                        />
                                    </div>
                                    {
                                        permission?.remarks
                                            ?
                                            <>
                                                <div className="create-form-group">
                                                    <label>Remark</label>
                                                    <input
                                                        type="text"
                                                        placeholder="Please enter remarks"
                                                        name="remark"
                                                        value={remark}
                                                        onChange={(e) => setRemark(e.target.value)}
                                                    />
                                                </div>
                                                <div className="create-form-group">
                                                    <div className="remark-tags">
                                                        <li onClick={() => setRemark("Deposit")}>Deposit</li>
                                                        <li onClick={() => setRemark("Rewards")}>Rewards</li>
                                                        <li onClick={() => setRemark("Rebate")}>Rebate</li>
                                                        <li onClick={() => setRemark("Activation Fees")}>Activation Fees</li>
                                                        <li onClick={() => setRemark("Basic Salary")}>Basic Salary</li>
                                                    </div>
                                                </div>
                                            </>
                                            :
                                            <></>
                                    }
                                    <div className="create-form-action">
                                        <Submit setShowModal={setShowModal} />
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    :
                    <></>
            }
        </div>
    )
}


export default Recharge;