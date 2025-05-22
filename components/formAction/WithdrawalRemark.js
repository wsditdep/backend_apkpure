"use client";

import { useState } from "react";
import UpdateWithdrawalRemark from "../remarks/UpdateWithdrawalRemark";

const WithdrawalRemarkAction = ({ data }) => {

    const [isUpdate, setIsUpdate] = useState(false);

    return (
        <>
            <td>
                {
                    isUpdate
                        ?
                        <UpdateWithdrawalRemark
                            data={data}
                            setIsUpdate={setIsUpdate}
                        />
                        :
                        <></>
                }
            </td>
            <td className="table-operations overrideflex">
                <div className="table-operation-childs">
                    <button className="btn-outline mr-4 mb-4" onClick={() => setIsUpdate(true)}>Edit</button>
                </div>
            </td>
        </>
    )
}

export default WithdrawalRemarkAction;