"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from 'react-hot-toast';
import { createContent, updateContent } from "@/app/actions/mall/action";
import JoditEditorComponent from '@/components/editor/JoditEditorComponent';
import QlEditor from "@/components/editor/QlEditor";

const Submit = ({ pending, setShowModal }) => {
    return (
        <>
            {pending
                ? null
                : <button className="btn btn-outline mr-4 btn-md" onClick={() => setShowModal(false)}>Cancel</button>}
            <button type="submit" className={pending ? "btn-md btn-tertiary managedDisabled" : "btn-md btn-tertiary"}>
                {
                    pending
                        ?
                        <>Please wait <i className="fa fa-circle-notch rotating-spinner"></i></>
                        : 
                        `Update`
                }
            </button>
        </>
    );
};

const UpdateContent = ({ data, setIsUpdate }) => {
    const router = useRouter();
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
            const response = await updateContent(formData);
            if (response.status === 201) {
                toast.success(response.message);
                setIsUpdate(false);
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

    useEffect(() => {
        setContent(data?.description)
    }, []);

    return (
        <div className="create-wrapper">
            <div className="create-modal-wrapper" onClick={() => setIsUpdate(false)}>
                <div className="create-modal" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-header">
                        <h3>Edit Content</h3>
                        <i onClick={() => setIsUpdate(false)} className="fa fa-times"></i>
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
                                    defaultValue={data?.title}
                                    onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
                                />
                                <input
                                    type="hidden"
                                    name="id"
                                    value={data?._id}
                                />
                            </div>
                            <div className="create-form-group create-form-with-ql-editor">
                                <label>Description <span>*</span></label>
                                <QlEditor
                                    valueContent={content}
                                    setContent={setContent}
                                />
                            </div>
                            <div className="create-form-action">
                                <Submit pending={pending} setShowModal={setIsUpdate} />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdateContent;
