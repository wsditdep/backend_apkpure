"use client";

import { toast } from 'react-hot-toast';
import { useRouter } from "next/navigation";
import { updateProduct } from "@/app/actions/product/action";
import Image from "next/image";
import QlEditor from "../editor/QlEditor";
import { useState, useEffect } from "react";

function Submit({ pending, setShowModal }) {

    return (
        <>
            {
                pending
                    ?
                    ""
                    :
                    <button className="btn btn-outline mr-4 btn-md" onClick={() => setShowModal(false)}>Cancel</button>
            }
            <button type="submit" className={pending ? "btn-md btn-tertiary managedDisabled" : "btn-md btn-tertiary"}> {
                pending ?
                    <>Please wait <i className="fa fa-circle-notch rotating-spinner"></i></>
                    :
                    `Update`
            }
            </button>
        </>
    )
}

const UpdateProduct = ({ data, setIsUpdate }) => {

    const router = useRouter();
    const [pending, setPending] = useState(false);

    const [file, setFile] = useState(null);
    const [oldFile, setOldFile] = useState(null);
    const [productName, setProductName] = useState("");
    const [productPrice, setProductPrice] = useState("");
    const [storeName, setStoreName] = useState("");
    const [content, setContent] = useState("");

    const handleForm = async () => {

        if (file === null) {
            setPending(true);
            const formData = new FormData();
            formData.append("id", data?._id);
            formData.append("productName", productName);
            formData.append("productPrice", productPrice);
            formData.append('storeName', storeName);
            formData.append('productContent', content);

            try {
                const response = await updateProduct(formData);

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

        } else {

            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', process.env.NEXT_PUBLIC_IMAGE_UPLOAD_PRESET);
            const cloud_res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_NAME}/image/upload`, {
                method: "POST",
                body: formData
            });

            const cloud_data = await cloud_res.json();

            if (cloud_res.ok) {
                //   save in database::begin
                try {
                    setPending(true);
                    const formData = new FormData();
                    formData.append("id", data?._id);
                    formData.append("productName", productName);
                    formData.append("productPrice", productPrice);
                    formData.append('storeName', storeName);
                    formData.append('productContent', content);
                    formData.append("public_id", cloud_data.public_id);
                    formData.append("url", cloud_data.url);

                    try {
                        const response = await updateProduct(formData);

                        if (response.status === 201) {
                            toast.success(response.message);
                            setIsUpdate(false);
                            setPending(false);
                            router.refresh();
                            return;
                        } else {
                            toast.error(response.message);
                        }

                    } catch (error) {
                        console.log(error)
                    }
                } catch (error) {
                    setPending(false);
                    setIsUpdate(false);
                    console.log(error);
                }
                //   save in database::end


            } else {
                setPending(false);
                throw new Error("Faild to update product!");
            }
        }
    }

    useEffect(() => {
        setProductName(data?.productName ?? "");
        setStoreName(data?.storeName ?? "");
        setProductPrice(data?.productPrice ?? "");
        setContent(data?.productContent ?? "");
        setOldFile(data?.url ?? "");
    }, []);

    return (
        <div className="create-wrapper">
            <div className="create-modal-wrapper" onClick={() => setIsUpdate(false)}>
                <div className="create-modal" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-header">
                        <h3>Edit Product</h3>
                        <i onClick={() => setIsUpdate(false)} className="fa fa-times"></i>
                    </div>
                    <div className="create-form">
                        <form action={handleForm} >
                            <div className="create-form-group">
                                <label>Product Name <span>*</span></label>
                                <input
                                    type="text"
                                    placeholder="Please enter product name"
                                    name="productName"
                                    value={productName}
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
                                    value={storeName}
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
                                    value={productPrice}
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
                                    onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
                                />
                            </div>
                            <div className="create-form-group">
                                {
                                    file === null
                                        ?
                                        <Image
                                            src={oldFile || ""}
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
                                <QlEditor
                                    setContent={setContent}
                                    valueContent={content}
                                />
                            </div>
                            <div className="create-form-action">
                                <Submit pending={pending} setShowModal={setIsUpdate} />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default UpdateProduct;