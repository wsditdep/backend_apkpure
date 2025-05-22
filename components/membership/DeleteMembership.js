"use client";

import { deleteMembership } from '@/app/actions/membership/action';
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import AlertBox from '../alertBox/AlertBox';

const DeleteMembership = ({ id }) => {

    const [showConfirm, setShowConfirm] = useState(false);

    const handleDelete = async (id) => {

        try {
            const response = await deleteMembership(id);

            if (response.status === 201) {
                toast.success(response.message);
                setShowConfirm(false);
                return;
            } else {
                setShowConfirm(false);
                toast.error(response.message);
            }

        } catch (error) {
            setShowConfirm(false);
            console.log(error)
        }
    }

    return (
        <>
            <button onClick={() => setShowConfirm(true)} className="btn-secondary mr-4 mb-4">Delete</button>
            <AlertBox
                id={id}
                showConfirm={showConfirm}
                setShowConfirm={setShowConfirm}
                handleDelete={handleDelete}
                title="Confirmation"
                subTitle="Are you sure you want to delete!"
            />
        </>
    )
}

export default DeleteMembership