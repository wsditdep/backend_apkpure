"use client";

import { useFormStatus } from "react-dom";
import { toast } from 'react-hot-toast';
import { useRouter } from "next/navigation";
import { updateAnnouncement } from "@/app/actions/mall/action";

function Submit({ setShowModal }) {
    const { pending } = useFormStatus();

    return (
        <>
            {
                pending
                    ?
                    ""
                    :
                    <button className="btn btn-outline mr-4 btn-md" onClick={() => setShowModal(false)}>Cancle</button>
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

const UpdateAnnouncement = ({ data, setIsUpdate }) => {

    const router = useRouter();

    const handleForm = async (formData) => {

        try {
            const response = await updateAnnouncement(formData);

            if (response.status === 201) {
                toast.success(response.message);
                setIsUpdate(false);
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
            <div className="create-modal-wrapper" onClick={() => setIsUpdate(false)}>
                <div className="create-modal" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-header">
                        <h3>Edit Announcement</h3>
                        <i onClick={() => setIsUpdate(false)} className="fa fa-times"></i>
                    </div>
                    <div className="create-form">
                        <form action={handleForm} >
                            <div className="create-form-group">
                                <label>Announcement Name <span>*</span></label>
                                <input
                                    type="text"
                                    placeholder="Please enter announcement name"
                                    name="title"
                                    defaultValue={data?.notice_name}
                                    required
                                    onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
                                />
                                <input
                                    type="hidden"
                                    name="id"
                                    value={data?._id}
                                />
                            </div>
                            <div className="create-form-group">
                                <label>Announcement Description <span>*</span></label>
                                <textarea
                                    type="text"
                                    placeholder="Please enter announcement description"
                                    name="description"
                                    defaultValue={data?.notice}
                                    required
                                    onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
                                ></textarea>
                            </div>
                            <div className="create-form-action">
                                <Submit setShowModal={setIsUpdate} />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default UpdateAnnouncement;