"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { createSystemUser } from "@/app/actions/user/action";
import { toast } from 'react-hot-toast';
import { useRouter } from "next/navigation";

function Submit({ setShowModal, authenticatedUser }) {
    const { pending } = useFormStatus();

    return (
        <>
            {
                pending
                    ?
                    ""
                    :
                    <button className="btn btn-outline mr-4 btn-md" onClick={() => setShowModal(false)}>
                        {authenticatedUser?.language === "en" ? "Cancel" : "取消"}
                    </button>
            }
            <button type="submit" className={pending ? "btn-md btn-tertiary managedDisabled" : "btn-md btn-tertiary"}>
                {
                    pending
                        ?
                        authenticatedUser?.language === "en" 
                            ?
                            <>Please wait<i className="fa fa-circle-notch rotating-spinner"></i></> 
                            : 
                            "请稍等"
                        
                        :
                            authenticatedUser?.language === "en" 
                            ? 
                            "Add" 
                            : 
                            "添加"
                }
            </button>
        </>
    )
}

const CreateSystemUser = ({ agents, roles, authenticatedUser }) => {

    const router = useRouter();

    const [showModal, setShowModal] = useState(false);
    const [manageUsername, setManageUsername] = useState("");

    const handleUsername = (e) => {
        setManageUsername(e.target.value);
    }

    const handleForm = async (formData) => {

        try {
            const response = await createSystemUser(formData);

            if (response.status === 201) {
                toast.success(response.message);
                setShowModal(false);
                setManageUsername("");
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
                <button onClick={() => setShowModal(true)} className="btn btn-tertiary"><i className="fa fa-plus"></i> {authenticatedUser?.language === "en" ? "New" : "新的"}</button>
            </div>
            {
                showModal
                    ?
                    <div className="create-modal-wrapper" onClick={() => setShowModal(false)}>
                        <div className="create-modal" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h3>{authenticatedUser?.language === "en" ? "Add System User" : "添加系统用户"}</h3>
                                <i onClick={() => setShowModal(false)} className="fa fa-times"></i>
                            </div>
                            <div className="create-form">
                                <form action={handleForm} >
                                    <div className="create-form-group">
                                        <label>{authenticatedUser?.language === "en" ? "Username" : "用户名"} <span>*</span></label>
                                        <input
                                            type="text"
                                            placeholder={authenticatedUser?.language === "en" ? "Please enter username" : "请输入用户名"}
                                            name="username"
                                            required
                                            onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
                                        />
                                        <input
                                            type="hidden"
                                            name="connected_agent_username"
                                            value={manageUsername}
                                        />
                                    </div>
                                    <div className="create-form-group">
                                        <label>{authenticatedUser?.language === "en" ? "Password" : "密码"} <span>*</span></label>
                                        <input
                                            type="text"
                                            placeholder={authenticatedUser?.language === "en" ? "Please enter password" : "请输入密码"}
                                            name="password"
                                            required
                                            onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
                                        />
                                    </div>
                                    <div className="create-form-group">
                                        <label>{authenticatedUser?.language === "en" ? "Role" : "角色"} <span>*</span></label>
                                        <select name="role">
                                            <option>{authenticatedUser?.language === "en" ? "-- Select Role --" : "-- 选择角色 --"}</option>
                                            {
                                                roles?.map((data, index) => (
                                                    <option key={index} value={data?.role_name}>{data?.role_name}</option>
                                                ))
                                            }
                                        </select>
                                    </div>
                                    <div className="create-form-group">
                                        <label>{authenticatedUser?.language === "en" ? "Agent" : "代理人"}  <span>*</span></label>
                                        <select onChange={(e) => handleUsername(e)}>
                                            <option>{authenticatedUser?.language === "en" ? "-- Select Agent --" : "-- 选择代理 --"}</option>
                                            {
                                                agents?.map((data, index) => (
                                                    <option key={index} value={data?.username}>{data?.username}</option>
                                                ))
                                            }
                                        </select>
                                    </div>
                                    <div className="create-form-action">
                                        <Submit
                                            setShowModal={setShowModal}
                                            authenticatedUser={authenticatedUser}
                                        />
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


export default CreateSystemUser;