"use client";

import { useFormStatus } from "react-dom";
import { toast } from 'react-hot-toast';
import { useRouter } from "next/navigation";
import { updateSupportInfo } from "@/app/actions/setting/action";

function Submit({ setIsUpdate }) {
    const { pending } = useFormStatus();
    return (
        <>
            {
                pending
                    ?
                    ""
                    :
                    <button className="btn btn-outline mr-4 btn-md" onClick={() => setIsUpdate(false)}>Cancel</button>
            }
            <button type="submit" className={pending ? "btn-md btn-tertiary managedDisabled" : "btn-md btn-tertiary"}> {
                pending ?
                    <>Please wait<i className="fa fa-circle-notch rotating-spinner"></i></>
                    :
                    `Update`
            }
            </button>
        </>
    )
}

const UpdateSupport = ({ data, setIsUpdate }) => {

    const router = useRouter();

    const handleForm = async (formData) => {
        try {
            const response = await updateSupportInfo(formData);

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
                        <h3>Update System User</h3>
                        <i onClick={() => setIsUpdate(false)} className="fa fa-times"></i>
                    </div>
                    <div className="create-form">
                        <form action={handleForm} >
                            <div className="create-form-group">
                                <label>Mobile Number <span>*</span></label>
                                <input
                                    type="number"
                                    placeholder="Enter mobile number"
                                    defaultValue={data?.mobile_number ?? ""}
                                    name="mobile_number"
                                    required
                                    onWheel={(e)=>e.target.blur()}
                                    onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
                                />
                                <input
                                    type="hidden"
                                    name="id"
                                    value={data?._id}
                                />
                            </div>
                            <div className="create-form-group">
                                <label>LiveChat <span>*</span></label>
                                <input
                                    type="number"
                                    placeholder="Enter LiveChat"
                                    defaultValue={data?.live_chat ?? ""}
                                    name="live_chat"
                                    required
                                    onWheel={(e)=>e.target.blur()}
                                    onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
                                />
                            </div>
                            <div className="create-form-group">
                                <label>WeChat <span>*</span></label>
                                <input
                                    type="number"
                                    placeholder="Enter WeChat"
                                    defaultValue={data?.we_chat ?? ""}
                                    name="we_chat"
                                    required
                                    onWheel={(e)=>e.target.blur()}
                                    onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
                                />
                            </div>
                            <div className="create-form-group">
                                <label>Work Time <span>*</span></label>
                                <input
                                    type="text"
                                    placeholder="Enter WeChat"
                                    defaultValue={data?.work_time ?? ""}
                                    name="work_time"
                                    required
                                    onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
                                />
                            </div>
                            <div className="create-form-group">
                                <label>Link <span>*</span></label>
                                <input
                                    type="text"
                                    placeholder="Enter Link"
                                    defaultValue={data?.link ?? ""}
                                    name="link"
                                    required
                                    onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
                                />
                            </div>
                            <div className="create-form-action">
                                <Submit setIsUpdate={setIsUpdate} />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default UpdateSupport;