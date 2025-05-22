"use client";

import { useState } from "react";
import UpdateSupport from "./UpdateAction";

const SupportAction = ({ data }) => {

    const [isUpdate, setIsUpdate] = useState(false);

    return (
        <>
            <td>
                {
                    isUpdate
                        ?
                        <UpdateSupport
                            data={data}
                            setIsUpdate={setIsUpdate}
                        />
                        :
                        <></>
                }
            </td>
            <td className="table-operations">
                <div className="table-operation-childs">
                    <button className="btn-outline mr-4 mb-4" onClick={() => setIsUpdate(true)}>Edit</button>
                </div>
            </td>
        </>
    )
}

export default SupportAction;