"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from 'react-hot-toast';
import { createContent } from "@/app/actions/mall/action";
import QlEditor from "@/components/editor/QlEditor";

const Submit = ({ pending, setShowModal }) => {
    return (
        <>
            {pending
                ? null
                : <button className="btn btn-outline mr-4 btn-md" onClick={() => setShowModal(false)}>Cancel</button>}
            <button type="submit" className={pending ? "btn-md btn-tertiary managedDisabled" : "btn-md btn-tertiary"}>
                {pending ? `Please wait` : `Add`}
            </button>
        </>
    );
};

const CreateContent = () => {
    const router = useRouter();
    const [showModal, setShowModal] = useState(false);
    const [content, setContent] = useState("");
    const [pending, setPending] = useState(false);

    const handleForm = async (e) => {
        e.preventDefault();
        setPending(true);
        if (content === "") {
            setPending(false);
            return toast.error("Description is required!");
        }

        const formData = new FormData(e.target);
        formData.append('description', content);

        try {
            const response = await createContent(formData);
            if (response.status === 201) {
                toast.success(response.message);
                setShowModal(false);
                setContent("");
                router.refresh();
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred");
        } finally {
            setPending(false);
        }
    };

    return (
        <div className="create-wrapper">
            <div className="create-btn">
                <button onClick={() => setShowModal(true)} className="btn btn-tertiary">
                    <i className="fa fa-plus"></i> New
                </button>
            </div>
            {showModal && (
                <div className="create-modal-wrapper" onClick={() => setShowModal(false)}>
                    <div className="create-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Add Content</h3>
                            <i onClick={() => setShowModal(false)} className="fa fa-times"></i>
                        </div>
                        <div className="create-form">
                            <form onSubmit={handleForm}>
                                <div className="create-form-group">
                                    <label>Title <span>*</span></label>
                                    <input
                                        type="text"
                                        placeholder="Please enter announcement name"
                                        name="title"
                                        required
                                        onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
                                    />
                                </div>
                                <div className="create-form-group create-form-with-ql-editor">
                                    <label>Description <span>*</span></label>
                                    <QlEditor setContent={setContent} />
                                </div>
                                <div className="create-form-action">
                                    <Submit pending={pending} setShowModal={setShowModal} />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreateContent;
