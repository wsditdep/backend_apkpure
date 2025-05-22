"use client"

import React from 'react'

const ActionShowJourney = ({ data }) => {
    return (
        <>
            <td>
                {data?.beforeOperation === "" ? "NULL" : (() => {
                    const parsedData = JSON.parse(data?.beforeOperation);

                    if (Array.isArray(parsedData)) {
                        return parsedData.map((item, index) => (
                            <p key={index}>{item?.stage}. ({item?.productPrice}) - {item?.productName}</p>
                        ));
                    }
                })()}
            </td>
            <td>
                {data?.afterOperation === "" ? "NULL" : (() => {
                    const parsedData = JSON.parse(data?.afterOperation);
                    const allData = JSON.parse(parsedData)

                    if (Array.isArray(allData)) {
                        return allData.map((item, index) => (
                            <p key={index}>{item?.stage}. ({item?.productPrice}) - {item?.productName}</p>
                        ));
                    }
                })()}
            </td>
        </>
    );
}

export default ActionShowJourney;
