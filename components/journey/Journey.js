"use client";

import { createJourney, resetJourney } from "@/app/actions/journey/action";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from 'react-hot-toast';
import AlertBox from "../alertBox/AlertBox";
import SubLoader from "../progress/SubLoader";
import JourneyProducts from "./JourneyProducts";

const Journey = ({ userInfo, journeyData }) => {
    const router = useRouter();

    const journey = journeyData?.journey || [];
    const [journeyProduct, setJourneyProduct] = useState(journey);
    const [stage, setState] = useState(0);
    const [loading, setIsLoading] = useState(false);

    const [showConfirm, setShowConfirm] = useState(false);

    const handleInputChange = (e) => {
        const inputVal = e.target.value;
        setState(inputVal);

        const updatedJourney = journeyProduct.map((element, index) => {
            return {
                ...element,
                stage: Number(inputVal) + 1 + index
            };
        });

        setJourneyProduct(updatedJourney);
    }

    const replaceNextOrder = async (productInfo) => {

        if (journeyProduct.length === 0) {
            return toast.error("No product selected!");
        }

        const firstProduct = journeyProduct[0];

        // Find index of firstProduct based on _id and productName
        const firstProductIndex = journeyProduct.findIndex(item => (
            item._id === firstProduct?._id && item.productName === firstProduct?.productName
        ));

        // Filter out firstProduct based on _id and productName
        const restProduct = journeyProduct.filter(item => (
            item._id !== firstProduct?._id || item.productName !== firstProduct?.productName
        ));

        const newObj = {
            ...productInfo,
            status: "pointed",
            stage: firstProduct?.stage,
            isJourneyProduct: true
        }

        const updatedJourneyProduct = [
            ...restProduct.slice(0, firstProductIndex),
            newObj,
            ...restProduct.slice(firstProductIndex)
        ];

        setJourneyProduct(updatedJourneyProduct);

        if (journeyProduct.length === 0) {
            return toast.error("No product selected");
        }

        const formData = new FormData();
        formData.append("userId", userInfo?._id);
        formData.append("ticket_point", stage);
        formData.append("journeyProduct", JSON.stringify(updatedJourneyProduct));

        try {
            const response = await createJourney(formData);

            if (response.status === 201) {
                toast.success(response.message);
                router.refresh();
                return;
            } else {
                router.refresh();
                toast.error(response.message);
            }

        } catch (error) {
            console.log(error)
        }
    }

    const addProduct = (productInfo) => {

        const maxValue = journeyProduct.reduce((maxObj, currentObj) => {
            return (currentObj.stage > maxObj.stage) ? currentObj : maxObj;
        }, journeyProduct[0]);

        let newStage
        if (journeyProduct.length === 0) {
            newStage = Number(stage) + 1;
        } else {
            newStage = (maxValue?.stage ?? 0) + 1;
        }

        const newObj = {
            ...productInfo,
            status: "pointed",
            stage: newStage,
            isJourneyProduct: true
        }

        setJourneyProduct([...journeyProduct, newObj]);

        return;
    }

    const removeFromList = (id) => {
        const newProductList = journeyProduct.filter(item => item._id !== id);
        return setJourneyProduct(newProductList);
    }

    const createUserJourney = async () => {
        setIsLoading(true);

        if (Number(stage) < 0) {
            return toast.error("Negative value can not be accepted!");
        }

        if (journeyProduct.length === 0) {
            return toast.error("No product selected");
        }

        const formData = new FormData();
        formData.append("userId", userInfo?._id);
        formData.append("journeyProduct", JSON.stringify(journeyProduct));
        formData.append("ticket_point", stage);

        try {
            const response = await createJourney(formData);

            if (response.status === 201) {
                toast.success(response.message);
                router.refresh();
                setIsLoading(false);
                return;
            } else {
                router.refresh();
                toast.error(response.message);
                setIsLoading(false);
            }

        } catch (error) {
            console.log(error)
            setIsLoading(false);
        }
    }

    const handleReset = async (id) => {
        setIsLoading(true);
        try {
            const response = await resetJourney(id);

            if (response.status === 201) {
                toast.success(response.message);
                setShowConfirm(false);
                setJourneyProduct([]);
                router.refresh();
                setIsLoading(false);
                return;
            } else {
                toast.error(response.message);
                router.refresh();
                setIsLoading(false);
                setShowConfirm(false);
            }

        } catch (error) {
            console.log(error)
            setIsLoading(false);
        }
    }

    const sendMeToList = () => {
        return router.back();
    }

    const getMaxStageObject = (array) => {
        const maxValue = array.reduce((maxObj, currentObj) => {
            return (currentObj.stage < maxObj.stage) ? currentObj : maxObj;
        }, array[0]);

        if (array?.length === 0) {
            setState(0);
        } else {
            setState((maxValue?.stage ?? 0) - 1);
        }
        router.refresh();
    };

    useEffect(() => {
        getMaxStageObject(journeyData?.journey ?? []);
        setState(userInfo?.ticket_point ?? userInfo?.today_order);
    }, []);


    return (
        <>
            <AlertBox
                id={userInfo?._id}
                showConfirm={showConfirm}
                setShowConfirm={setShowConfirm}
                handleDelete={handleReset}
                title="Confirmation"
                subTitle="Are you sure you want to reset this user journey!"
            />
            {
                loading
                    ?
                    <SubLoader />
                    :
                    <></>
            }
            <div className="content-information-wrapper">
                <div className="inner-information-wrapper">
                    <div className="journey-wrapper">
                        <div className="journey-heading">
                            <button onClick={() => sendMeToList()}><i className="fa fa-angle-left"></i>Back to list</button>
                            <h3>Current user: {userInfo?.username}</h3>
                        </div>
                        <div className="form-alt">
                            <form onSubmit={(e) => e.preventDefault()}>
                                <div className="form-alt-group">
                                    <label>Current number of orders made:</label>
                                    <input
                                        value="1"
                                        disabled
                                    />
                                </div>
                                <div className="form-alt-group">
                                    <label>Orders received today:</label>
                                    <input
                                        value={userInfo?.today_order}
                                        disabled
                                    />
                                </div>
                                <div className="form-alt-group">
                                    <label>Maximum orders received by level:</label>
                                    <input
                                        value={userInfo?.daily_available_order}
                                        disabled
                                    />
                                </div>
                                <div className="form-alt-group">
                                    <label>Start continuous orders after several orders:</label>
                                    <input
                                        type="number"
                                        value={stage}
                                        name="stage"
                                        onWheel={(e) => e.target.blur()}
                                        onChange={(e) => handleInputChange(e)}
                                    />
                                </div>
                                <div className="manage-continuous-wrapper">
                                    <div className="journey-products">
                                        <div className="journey-product-childs">
                                            <p>Products:</p>
                                        </div>
                                        <div className="journey-product-childs notranslate">
                                            {
                                                journeyProduct?.length === 0
                                                    ?
                                                    <p>Please select continuous orders in the product list</p>
                                                    :
                                                    journeyProduct?.map((data, index) => (
                                                        <div className="show-journey-products" key={index}>
                                                            <span>({data?.stage}) {data?.productPrice} {data?.productName}</span> <i onClick={() => removeFromList(data?._id)} className="fa fa-times"></i>
                                                        </div>
                                                    ))
                                            }
                                        </div>
                                    </div>
                                    <div className="journey-submit-action">
                                        <button onClick={() => createUserJourney()} className="btn-md btn-tertiary mr-4">OK</button>
                                        <button className="btn-md btn-secondary" onClick={() => setShowConfirm(true)}>Reset countinuous orders</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <JourneyProducts
                addProduct={addProduct}
                replaceNextOrder={replaceNextOrder}
                journeyProduct={journeyProduct}
            />
        </>
    )
}

export default Journey