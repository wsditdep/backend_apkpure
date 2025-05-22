"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from 'react-hot-toast';
import imgPrev from "@/public/image_prev.png";
import Image from "next/image";
import { createProduct } from "@/app/actions/product/action";
import QlEditor from "../editor/QlEditor";

const Submit = ({ pending, setShowModal }) => {
    return (
        <>
            {pending
                ? null
                : <button className="btn btn-outline mr-4 btn-md" onClick={() => setShowModal(false)}>Cancel</button>}
            <button type="submit" className={pending ? "btn-md btn-tertiary managedDisabled" : "btn-md btn-tertiary"}>
                {pending ? <>Please wait<i className="fa fa-circle-notch rotating-spinner"></i></> : `Add`}
            </button>
        </>
    );
};

const CreateProduct = () => {
    const router = useRouter();

    const [showModal, setShowModal] = useState(false);
    const [pending, setPending] = useState(false);

    const [file, setFile] = useState(null);
    const [productName, setProductName] = useState("");
    const [productPrice, setProductPrice] = useState("");
    const [storeName, setStoreName] = useState("");
    const [content, setContent] = useState("");

    const handleForm = async (e) => {
        e.preventDefault();

        if (file === null) {
            return toast.error("Please choose image!");
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', process.env.NEXT_PUBLIC_IMAGE_UPLOAD_PRESET);

        // upload image to cloudinary::begin
        try {
            setPending(true);
            const cloud_res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_NAME}/image/upload`, {
                method: "POST",
                body: formData
            });

            const cloud_data = await cloud_res.json();

            if (cloud_res.ok) {
                //   save in database::begin
                try {

                    const formData = new FormData();
                    formData.append("productName", productName);
                    formData.append("productPrice", productPrice);
                    formData.append('storeName', storeName);
                    formData.append('productContent', content);
                    formData.append("public_id", cloud_data.public_id);
                    formData.append("url", cloud_data.url);

                    const response = await createProduct(formData);

                    if (response.status === 201) {
                        setShowModal(false);
                        setPending(false);
                        router.refresh();
                        setFile(null);
                        return toast.success(response.message);
                    } else {
                        setPending(false);
                        setShowModal(false);
                        throw new Error("Faild to create product!");
                    }
                } catch (error) {
                    setPending(false);
                    setShowModal(false);
                    console.log(error);
                }
                //   save in database::end
            } else {
                setPending(false);
                throw new Error("Faild to create product!");
            }

        } catch (error) {
            setPending(false);
            setShowModal(false);
            console.log(error);
        }
        // upload image to cloudinary::end
    };

    return (
        <div className="create-wrapper">
            <div className="create-btn">
                <button onClick={() => setShowModal(true)} className={process.env.NEXT_PUBLIC_IS_SELF_PRODUCT === "true" ? "btn btn-tertiary" : "btn btn-tertiary noActionAvailable"}>
                    <i className="fa fa-plus"></i> New
                </button>
            </div>
            {showModal && (
                <div className="create-modal-wrapper" onClick={() => setShowModal(false)}>
                    <div className="create-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Add Product</h3>
                            <i onClick={() => setShowModal(false)} className="fa fa-times"></i>
                        </div>
                        <div className="create-form">
                            <form onSubmit={handleForm}>
                                <div className="create-form-group">
                                    <label>Product Name <span>*</span></label>
                                    <input
                                        type="text"
                                        placeholder="Please enter product name"
                                        name="productName"
                                        onChange={(e) => setProductName(e.target.value)}
                                        required
                                        onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
                                    />
                                </div>
                                <div className="create-form-group">
                                    <label>Store Name <span>*</span></label>
                                    <input
                                        type="text"
                                        placeholder="Please enter store name"
                                        name="storeName"
                                        onChange={(e) => setStoreName(e.target.value)}
                                        required
                                        onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
                                    />
                                </div>
                                <div className="create-form-group">
                                    <label>Product Price <span>*</span></label>
                                    <input
                                        type="number"
                                        placeholder="Please enter product name"
                                        name="productPrice"
                                        onChange={(e) => setProductPrice(e.target.value)}
                                        required
                                        step="any"
                                        onWheel={(e)=>e.target.blur()}
                                        onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
                                    />
                                </div>
                                <div className="create-form-group">
                                    <label>Chooses Image <span>*</span></label>
                                    <input
                                        type="file"
                                        accept=".png, .jpg, .jpeg, .gif"
                                        onChange={(e) => setFile(e.target.files[0])}
                                        required
                                        onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
                                    />
                                </div>
                                <div className="create-form-group">
                                    {
                                        file === null
                                            ?
                                            <Image
                                                src={imgPrev}
                                                width={100}
                                                height={100}
                                                alt="choosen file"
                                            />
                                            :
                                            <Image
                                                src={URL.createObjectURL(file)}
                                                width={100}
                                                height={100}
                                                alt="file"
                                            />

                                    }
                                </div>
                                <div className="create-form-group create-form-with-ql-editor">
                                    <label>Product Content</label>
                                    <QlEditor setContent={setContent} />
                                </div>
                                <div className="create-form-action">
                                    <Submit pending={pending} setShowModal={setShowModal} />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreateProduct;
