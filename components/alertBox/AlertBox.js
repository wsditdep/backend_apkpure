"use client";

const AlertBox = ({
    id,
    showConfirm,
    setShowConfirm,
    handleDelete,
    title,
    subTitle,
    isLoading
}) => {
    return (
        <>
            {
                showConfirm
                    ?
                    <div className="confirmation-alert-wrapper" onClick={() => setShowConfirm(false)}>
                        <div className="confirmation-alert" onClick={(e) => e.stopPropagation()}>
                            <h3><i className="fa-solid fa-triangle-exclamation"></i> {title}</h3>
                            <p>{subTitle}</p>
                            <div className="conformation-action">
                                <button className="btn btn-outline mr-4" onClick={() => setShowConfirm(false)}>Cancel</button>
                                <button className="btn btn-primary" onClick={() => handleDelete(id)}>{isLoading ? <>Please wait <i className="fa fa-circle-notch rotating-spinner"></i></> : "Confirm"}</button>
                            </div>
                        </div>
                    </div>
                    :
                    <></>
            }
        </>
    )
}

export default AlertBox