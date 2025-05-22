"use client";

import { createUser } from "@/app/actions/user/action";
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
                    <button className="btn btn-outline mr-4 btn-md" onClick={() => setShowModal(false)}>Cancel</button>
            }
            <button type="submit" className={pending ? "btn-md btn-tertiary managedDisabled" : "btn-md btn-tertiary"}> {
                pending ?
                    <>Please wait<i className="fa fa-circle-notch rotating-spinner"></i></>
                    :
                    `Add`
            }
            </button>
        </>
    )
}

const CreateUser = () => {

    const router = useRouter();

    const [showModal, setShowModal] = useState(false);

    const handleForm = async (formData) => {

        try {
            const response = await createUser(formData);

            if (response.status === 201) {
                toast.success(response.message);
                setShowModal(false);
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
            <div className="create-btn">
                <button onClick={() => setShowModal(true)} className="btn btn-tertiary"><i className="fa fa-plus"></i> New</button>
            </div>
            {
                showModal
                    ?
                    <div className="create-modal-wrapper" onClick={() => setShowModal(false)}>
                        <div className="create-modal" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h3>Add Agent</h3>
                                <i onClick={() => setShowModal(false)} className="fa fa-times"></i>
                            </div>
                            <div className="create-form">
                                <form action={handleForm} >
                                    <div className="create-form-group">
                                        <label>Username <span>*</span></label>
                                        <input
                                            type="text"
                                            placeholder="Please enter user name"
                                            name="username"
                                            required
                                            onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
                                        />
                                        <input
                                            type="hidden"
                                            name="role"
                                            value="agent"
                                        />
                                        <input
                                            type="hidden"
                                            name="balance"
                                            value="0"
                                        />
                                    </div>
                                    <div className="create-form-group">
                                        <label>Password  <span>*</span></label>
                                        <input
                                            type="text"
                                            placeholder="Please enter password"
                                            name="password"
                                            required
                                            onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
                                        />
                                    </div>
                                    <div className="create-form-group">
                                        <label>Phone Number <span>*</span></label>
                                        <input
                                            type="number"
                                            placeholder="Please enter phone number"
                                            title="Please enter at least 8 digits."
                                            name="phone_number"
                                            required
                                            onWheel={(e)=>e.target.blur()}
                                            onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
                                        />
                                    </div>
                                    <div className="create-form-group">
                                        <label>Payment Password <span>*</span></label>
                                        <input
                                            type="text"
                                            placeholder="Please enter payment password"
                                            name="withdrawal_pin"
                                            required
                                            onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
                                        />
                                    </div>
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


export default CreateUser;