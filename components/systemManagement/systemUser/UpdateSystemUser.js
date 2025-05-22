"use client";

import { updateSystemUser } from "@/app/actions/user/action";
import { useFormStatus } from "react-dom";
import { toast } from 'react-hot-toast';
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function Submit({ setIsUpdate, authenticatedUser }) {
    const { pending } = useFormStatus();
    return (
        <>
            {
                pending
                    ?
                    ""
                    :
                    <button className="btn btn-outline mr-4 btn-md" onClick={() => setIsUpdate(false)}>{authenticatedUser?.language === "en" ? "Add" : "添加"}</button>
            }
            <button type="submit" className={pending ? "btn-md btn-tertiary managedDisabled" : "btn-md btn-tertiary"}>
                {
                    pending ?
                            authenticatedUser?.language === "en"
                            ?
                            <>Please wait<i className="fa fa-circle-notch rotating-spinner"></i></>
                            : "请稍等"
                        :
                            authenticatedUser?.language === "en"
                            ?
                            "Update"
                            :
                            "更新"
                }
            </button>
        </>
    )
}

const UpdateSystemUser = ({ data, isUpdate, setIsUpdate, roles, agents, authenticatedUser }) => {

    const router = useRouter();

    const [manageRole, setManageRole] = useState("");
    const [manageAgent, setManageAgent] = useState("");

    const handleForm = async (formData) => {
        try {
            const response = await updateSystemUser(formData);

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


    useEffect(() => {
        setManageRole(data?.role);
        setManageAgent(data?.connected_agent_username);
    }, [data]);

    return (
        <div className="create-wrapper">
            {
                isUpdate
                    ?
                    <div className="create-modal-wrapper" onClick={() => setIsUpdate(false)}>
                        <div className="create-modal" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h3>{authenticatedUser?.language === "en" ? "Update System User" : "更新系统用户"}</h3>
                                <i onClick={() => setIsUpdate(false)} className="fa fa-times"></i>
                            </div>
                            <div className="create-form">
                                <form action={handleForm} >
                                    <div className="create-form-group">
                                        <label>{authenticatedUser?.language === "en" ? "Username" : "用户名"} <span>*</span></label>
                                        <input
                                            type="text"
                                            name="username"
                                            placeholder={authenticatedUser?.language === "en" ? "Please enter user name" : "请输入用户名"}
                                            defaultValue={data?.agent_username ?? ""}
                                            required
                                            onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
                                        />
                                        <input
                                            type="hidden"
                                            name="role"
                                            value={data?.role}
                                        />
                                        <input
                                            type="hidden"
                                            name="id"
                                            value={data?._id}
                                        />
                                    </div>
                                    <div className="create-form-group">
                                        <label>{authenticatedUser?.language === "en" ? "Password" : "密码"}</label>
                                        <input
                                            type="text"
                                            placeholder={authenticatedUser?.language === "en" ? "Please enter password" : "请输入密码"}
                                            name="password"
                                            onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
                                        />
                                    </div>
                                    <div className="create-form-group">
                                        <label>{authenticatedUser?.language === "en" ? "Role" : "角色"} <span>*</span></label>
                                        <select
                                            name="role"
                                            value={manageRole}
                                            onChange={(e) => setManageRole(e.target.value)}
                                        >
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
                                        <select
                                            name="connected_agent_username"
                                            value={manageAgent}
                                            onChange={(e) => setManageAgent(e.target.value)}
                                        >
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
                                            setIsUpdate={setIsUpdate}
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


export default UpdateSystemUser;