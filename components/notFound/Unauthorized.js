import React from 'react'

const Unauthorized = ({ authenticatedUser }) => {
    return (
        <div className="unauthorized">
            <h4>{authenticatedUser?.language === "en" ? "Access Denied" : "拒绝访问"} <i className="fa fa-lock"></i></h4>
        </div>
    )
}

export default Unauthorized