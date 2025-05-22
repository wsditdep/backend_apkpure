"use client";

import { addMembership } from "@/app/actions/membership/action";
import { useState } from "react";
import { useFormStatus } from "react-dom";
import { toast } from 'react-hot-toast';

const CreateMembership = () => {

    const [showModal, setShowModal] = useState(false);
    const { pending } = useFormStatus();

    const handleForm = async (formData) => {
        try {
            const response = await addMembership(formData);

            if (response.status === 201) {
                toast.success(response.message);
                setShowModal(false);
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
            <div className="create-btn">
                <button onClick={() => setShowModal(true)} className="btn btn-tertiary"><i className="fa fa-plus"></i> New</button>
            </div>
            {
                showModal
                    ?
                    <div className="create-modal-wrapper" onClick={() => setShowModal(false)}>
                        <div className="create-modal" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h3>Add Membership</h3>
                                <i onClick={() => setShowModal(false)} className="fa fa-times"></i>
                            </div>
                            <div className="create-form">
                                <form action={handleForm} >
                                    <div className="create-form-group">
                                        <label>Membership Name <span>*</span></label>
                                        <input
                                            type="text"
                                            placeholder="Please enter membership name"
                                            name="membership_name"
                                            required
                                            onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
                                        />
                                    </div>
                                    <div className="create-form-group">
                                        <label>Order quantity <span>*</span></label>
                                        <input
                                            type="number"
                                            placeholder="Please enter order quantity"
                                            name="order_quantity"
                                            step="any"
                                            required
                                            onWheel={(e)=>e.target.blur()}
                                            onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
                                        />
                                    </div>
                                    <div className="create-form-group">
                                        <label>Commission rate <span>*</span></label>
                                        <input
                                            type="number"
                                            placeholder="Please enter commission rate"
                                            name="commission_rate"
                                            step="any"
                                            required
                                            onWheel={(e)=>e.target.blur()}
                                            onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
                                        />
                                    </div>
                                    <div className="create-form-group">
                                        <label>Commission ratio for consecutive orders <span>*</span></label>
                                        <input
                                            type="number"
                                            placeholder="Please enter commission ratio for consecutive orders"
                                            name="ticket_commission"
                                            step="any"
                                            required
                                            onWheel={(e)=>e.target.blur()}
                                            onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
                                        />
                                    </div>
                                    <div className="create-form-group">
                                        <label>Number of withdrawals  <span>*</span></label>
                                        <input
                                            type="number"
                                            placeholder="Please enter number of withdrawals"
                                            name="number_of_withdrawal"
                                            step="any"
                                            required
                                            onWheel={(e)=>e.target.blur()}
                                            onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
                                        />
                                    </div>
                                    <div className="create-form-group">
                                        <label>Minimum withdrawal amount  <span>*</span></label>
                                        <input
                                            type="number"
                                            placeholder="Please enter minimum withdrawal amount"
                                            name="min_withdrawal_amount"
                                            step="any"
                                            required
                                            onWheel={(e)=>e.target.blur()}
                                            onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
                                        />
                                    </div>
                                    <div className="create-form-group">
                                        <label>Maximum withdrawal amount  <span>*</span></label>
                                        <input
                                            type="number"
                                            placeholder="Please enter maximum withdrawal amount"
                                            name="max_withdrawal_amount"
                                            step="any"
                                            required
                                            onWheel={(e)=>e.target.blur()}
                                            onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
                                        />
                                    </div>
                                    <div className="create-form-group">
                                        <label>Account balance limit <span>*</span></label>
                                        <input
                                            type="number"
                                            placeholder="Please enter account balance limit"
                                            name="account_balance_limit"
                                            step="any"
                                            required
                                            onWheel={(e)=>e.target.blur()}
                                            onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
                                        />
                                    </div>
                                    <div className="create-form-group">
                                        <label>Withdrawal needs to complete orders <span>*</span></label>
                                        <input
                                            type="number"
                                            placeholder="Please enter the needed orders"
                                            name="withdrawal_needed_order"
                                            step="any"
                                            onWheel={(e)=>e.target.blur()}
                                            required
                                            onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
                                        />
                                    </div>
                                    <div className="create-form-action">
                                        {
                                            pending
                                                ?
                                                <></>
                                                :
                                                <button className="btn btn-outline mr-4 btn-md" onClick={() => setShowModal(false)}>Cancel</button>
                                        }
                                        <button
                                            type="submit"
                                            className="btn btn-tertiary btn-md"
                                            disabled={pending}>
                                            {pending ? "Submitting...." : "Add"}
                                        </button>
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


export default CreateMembership