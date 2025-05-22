"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { toast } from 'react-hot-toast';
import { useRouter } from "next/navigation";
import { createAnnouncement } from "@/app/actions/mall/action";

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

const CreateAnnouncement = () => {

    const router = useRouter();

    const [showModal, setShowModal] = useState(false);

    const handleForm = async (formData) => {

        try {
            const response = await createAnnouncement(formData);

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
                                <h3>Add Announcement</h3>
                                <i onClick={() => setShowModal(false)} className="fa fa-times"></i>
                            </div>
                            <div className="create-form">
                                <form action={handleForm} >
                                    <div className="create-form-group">
                                        <label>Announcement Name <span>*</span></label>
                                        <input
                                            type="text"
                                            placeholder="Please enter announcement name"
                                            name="title"
                                            required
                                            onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
                                        />
                                    </div>
                                    <div className="create-form-group">
                                        <label>Announcement Description <span>*</span></label>
                                        <textarea
                                            type="text"
                                            placeholder="Please enter announcement description"
                                            name="description"
                                            required
                                            onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
                                        ></textarea>
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


export default CreateAnnouncement