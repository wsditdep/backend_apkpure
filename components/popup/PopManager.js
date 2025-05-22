"use client";

import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';

import image_prev from "@/public/image_prev.png";
import toast from 'react-hot-toast';
import { updatePop } from '@/app/actions/setting/action';
import { useRouter } from 'next/navigation';

const PopManager = ({ pop }) => {

    const router = useRouter();

    const [isDemo, setIsDemo] = useState(false);

    const [visibility, setVisibility] = useState('visible');
    const [animationType, setAnimationType] = useState('fade');
    const [animationTimingFunction, setAnimationTimingFunction] = useState('linear');
    const [animationDuration, setAnimationDuration] = useState('')

    const [imagePreview, setImagePreview] = useState("");
    const fileInputRef = useRef(null);
    const animatedBoxRef = useRef(null);

    const [loading, setLoading] = useState(false);

    const handleImageChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                toast.error("File size should be less than 2 MB.");
                setImagePreview("");
            } else {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setImagePreview(reader.result);
                };
                reader.readAsDataURL(file);
            }
        }
    };

    const submitFunction = async () => {
        setLoading(true);
        if (!imagePreview || !visibility || !animationType || !animationDuration) {
            setLoading(false);
            return toast.error("Required field is missing. Please check.");
        }

        const formData = new FormData();
        formData.append("image", imagePreview);
        formData.append("visibility", visibility);
        formData.append("animationType", animationType);
        formData.append("animationDuration", animationDuration);
        formData.append("animationTimingFunction", animationTimingFunction);

        const res = await updatePop(formData);

        if (res.status === 201) {
            router.refresh();
            toast.success(res.message);
            setLoading(false);
        } else {
            router.refresh();
            toast.error(res.message);
            setLoading(false);
        }
    }

    const [values, setIsValue] = useState({
        visibility: true,
        animationType: {
            fade: true,
            fadeUp: false,
            fadeDown: false,
            fadeRight: false,
            fadeLeft: false,
            fadeScale: false,
            scale: false,
        },
        animationDuration: "0.4",
        animationTimeFunction: "linear"
    });

    const toggleAnimationClass = () => {

        const activeAnimation = Object.keys(values.animationType).find(key => values.animationType[key]);

        if (activeAnimation) {

            setIsValue(prevState => {
                const updatedAnimationType = { ...prevState.animationType };
                updatedAnimationType[activeAnimation] = false;
                return {
                    ...prevState,
                    animationType: updatedAnimationType
                };
            });


            setTimeout(() => {
                setIsValue(prevState => {
                    const updatedAnimationType = { ...prevState.animationType };
                    updatedAnimationType[activeAnimation] = true;
                    return {
                        ...prevState,
                        animationType: updatedAnimationType
                    };
                });
            }, 100);
        }
    };


    useEffect(() => {
        if (pop) {
            setImagePreview(pop?.image ?? "");
            setVisibility(pop?.visibility ?? "");
            setAnimationType(pop?.animationType ?? "");
            setAnimationDuration(pop?.animationDuration ?? "");
            setAnimationTimingFunction(pop?.animationTimingFunction ?? "");
        }

    }, [pop]);

    return (
        <>
            <div className="popup-manager-wrapper">
                <div className="popup-manager-parent">
                    <div className="popup-manager-childs">
                        <div className="pop-impage-wrapper">
                            {
                                imagePreview === ""
                                    ?
                                    <Image
                                        src={image_prev}
                                        height={100}
                                        width={100}
                                        alt="pop"
                                    />
                                    :
                                    <Image
                                        src={imagePreview}
                                        height={100}
                                        width={100}
                                        alt="pop"
                                    />
                            }
                        </div>
                        <div className="selectFile">
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                id="file-input"
                                style={{ display: 'none' }}
                            />
                            <button onClick={() => fileInputRef.current?.click()}>
                                CHOOSE FILE <i className="fa fa-upload"></i>
                            </button>
                        </div>
                    </div>
                    <div className="popup-manager-childs">
                        <div className="popup-manager-form">
                            <div className="form-parent">
                                <label>Visibility<span>*</span></label>
                                <select
                                    onChange={(e) => setVisibility(e.target.value)}
                                    value={visibility}
                                >
                                    <option value="visible">Visible</option>
                                    <option value="hide">Hide</option>
                                </select>
                            </div>
                            <div className="form-parent">
                                <label>Animation Type <span>*</span></label>
                                <select
                                    onChange={(e) => setAnimationType(e.target.value)}
                                    value={animationType}
                                >
                                    <option value="back_fade">Fade</option>
                                    <option value="back_fade_up">Fade Up</option>
                                    <option value="back_fade_down">Fade Down</option>
                                    <option value="back_fade_right">Fade Right</option>
                                    <option value="back_fade_left">Fade Left</option>
                                    <option value="back_fade_scale">Fade Scale</option>
                                    <option value="back_scale">Scale</option>
                                </select>
                            </div>
                            <div className="form-parent">
                                <label>Animation Time Function <span>*</span></label>
                                <select
                                    onChange={(e) => setAnimationTimingFunction(e.target.value)}
                                    value={animationTimingFunction}
                                >
                                    <option value="linear">linear</option>
                                    <option value="ease-in">ease-in</option>
                                    <option value="ease-out">ease-out</option>
                                    <option value="ease-in-out">ease-in-out</option>
                                </select>
                            </div>
                            <div className="form-parent">
                                <label>Animation Duration<span>*</span></label>
                                <input
                                    type="number"
                                    placeholder="Please enter animation duration (Second)"
                                    required
                                    value={animationDuration}
                                    onWheel={(e)=>e.target.blur()}
                                    onChange={(e) => setAnimationDuration(e.target.value)}
                                />
                            </div>
                            <div className="form-parent">
                                <label>Demo<span>*</span></label>
                                <button className="btn-demo" onClick={() => setIsDemo(!isDemo)}>{isDemo ? "Close Demo" : "Open Demo"}</button>
                            </div>
                            <div className="update-submit">
                                <button disabled={loading} onClick={() => submitFunction()}>
                                    {
                                        loading
                                            ?
                                            <>Please wait<i className="fa fa-circle-notch rotating-spinner"></i></>
                                            :
                                            "Update"
                                    }
                                </button>
                            </div>
                            {
                                isDemo
                                    ?
                                    <div className="pop-demo-wrapper">
                                        <div className="pop-demo-parent">
                                            <div className="pop-demo-childs">
                                                {
                                                    values?.visibility
                                                        ?
                                                        <></>
                                                        :
                                                        <div className="no-pop">
                                                            <p>NO POPUP</p>
                                                        </div>
                                                }
                                                <Image
                                                    src={imagePreview}
                                                    height={100}
                                                    width={100}
                                                    alt="pop"
                                                    style={{
                                                        animationDuration: `${values?.animationDuration}s`,
                                                        animationTimingFunction: `${values?.animationTimeFunction}`,
                                                        filter: values?.visibility ? "grayscale(0)" : "grayscale(1)"
                                                    }}
                                                    ref={animatedBoxRef}
                                                    className={`
                                                        ${values?.animationType?.fade
                                                            ?
                                                            "back_fade"
                                                            :
                                                            values?.animationType?.fadeUp
                                                                ?
                                                                "back_fade_up"
                                                                :
                                                                values?.animationType?.fadeDown
                                                                    ?
                                                                    "back_fade_down"
                                                                    :
                                                                    values?.animationType?.fadeRight
                                                                        ?
                                                                        "back_fade_right"
                                                                        :
                                                                        values?.animationType?.fadeLeft
                                                                            ?
                                                                            "back_fade_left"
                                                                            :
                                                                            values?.animationType?.fadeScale
                                                                                ?
                                                                                "back_fade_scale"
                                                                                :
                                                                                values?.animationType?.scale
                                                                                    ?
                                                                                    "back_scale"
                                                                                    :
                                                                                    ""
                                                        }
                                                        `}
                                                />
                                            </div>
                                            <div className="pop-demo-childs">
                                                <p>VISIBILITY</p>
                                                <ul>
                                                    <li
                                                        className={values?.visibility ? "demo_btn_active" : ""}
                                                        onClick={() => {
                                                            setIsValue(prevValues => ({
                                                                ...prevValues,
                                                                visibility: true
                                                            }));
                                                            setVisibility("visible");
                                                        }}
                                                    >
                                                        Visible
                                                    </li>
                                                    <li
                                                        className={values?.visibility ? "" : "demo_btn_active"}
                                                        onClick={() => {
                                                            setIsValue(prevValues => ({
                                                                ...prevValues,
                                                                visibility: false
                                                            }));
                                                            setVisibility("hide");
                                                        }}
                                                    >
                                                        Hide
                                                    </li>
                                                </ul>
                                                <p className="mt2">ANIMATION TYPE</p>
                                                <ul>
                                                    <li className={values?.animationType?.fade ? "demo_btn_active" : ""}
                                                        onClick={() => {
                                                            setIsValue(prevValues => ({
                                                                ...prevValues,
                                                                animationType: {
                                                                    fade: !prevValues?.animationType?.fade,
                                                                    fadeUp: false,
                                                                    fadeLeft: false,
                                                                    fadeRight: false,
                                                                    fadeDown: false,
                                                                    fadeScale: false,
                                                                    scale: false
                                                                }
                                                            }));
                                                            setAnimationType("back_fade");
                                                        }}>Fade</li>
                                                    <li className={values?.animationType?.fadeUp ? "demo_btn_active" : ""}
                                                        onClick={() => {
                                                            setIsValue(prevValues => ({
                                                                ...prevValues,
                                                                animationType: {
                                                                    fade: false,
                                                                    fadeUp: !prevValues?.animationType?.fade,
                                                                    fadeLeft: false,
                                                                    fadeRight: false,
                                                                    fadeDown: false,
                                                                    fadeScale: false,
                                                                    scale: false
                                                                }
                                                            }));
                                                            setAnimationType("back_fade_up");
                                                        }}>Fade Up</li>
                                                    <li className={values?.animationType?.fadeDown ? "demo_btn_active" : ""}
                                                        onClick={() => {
                                                            setIsValue(prevValues => ({
                                                                ...prevValues,
                                                                animationType: {
                                                                    fade: false,
                                                                    fadeUp: false,
                                                                    fadeLeft: false,
                                                                    fadeDown: !prevValues?.animationType?.fade,
                                                                    fadeRight: false,
                                                                    fadeScale: false,
                                                                    scale: false
                                                                }
                                                            }));
                                                            setAnimationType("back_fade_down");
                                                        }}>Fade Down</li>
                                                    <li className={values?.animationType?.fadeRight ? "demo_btn_active" : ""}
                                                        onClick={() => {
                                                            setIsValue(prevValues => ({
                                                                ...prevValues,
                                                                animationType: {
                                                                    fade: false,
                                                                    fadeUp: false,
                                                                    fadeLeft: false,
                                                                    fadeDown: false,
                                                                    fadeRight: !prevValues?.animationType?.fade,
                                                                    fadeScale: false,
                                                                    scale: false
                                                                }
                                                            }));
                                                            setAnimationType("back_fade_right");
                                                        }}>Fade Right</li>
                                                    <li className={values?.animationType?.fadeLeft ? "demo_btn_active" : ""}
                                                        onClick={() => {
                                                            setIsValue(prevValues => ({
                                                                ...prevValues,
                                                                animationType: {
                                                                    fade: false,
                                                                    fadeUp: false,
                                                                    fadeLeft: !prevValues?.animationType?.fade,
                                                                    fadeDown: false,
                                                                    fadeRight: false,
                                                                    fadeScale: false,
                                                                    scale: false
                                                                }
                                                            }));
                                                            setAnimationType("back_fade_left");
                                                        }}>Fade Left</li>
                                                    <li className={values?.animationType?.fadeScale ? "demo_btn_active" : ""}
                                                        onClick={() => {
                                                            setIsValue(prevValues => ({
                                                                ...prevValues,
                                                                animationType: {
                                                                    fade: false,
                                                                    fadeUp: false,
                                                                    fadeLeft: false,
                                                                    fadeDown: false,
                                                                    fadeRight: false,
                                                                    fadeScale: !prevValues?.animationType?.fade,
                                                                    scale: false
                                                                }
                                                            }));
                                                            setAnimationType("back_fade_scale");
                                                        }}>Fade Scal</li>
                                                    <li className={values?.animationType?.scale ? "demo_btn_active" : ""}
                                                        onClick={() => {
                                                            setIsValue(prevValues => ({
                                                                ...prevValues,
                                                                animationType: {
                                                                    fade: false,
                                                                    fadeUp: false,
                                                                    fadeLeft: false,
                                                                    fadeDown: false,
                                                                    fadeRight: false,
                                                                    fadeScale: false,
                                                                    scale: !prevValues?.animationType?.fade
                                                                }
                                                            }));
                                                            setAnimationType("back_scale");
                                                        }}>Scale</li>
                                                </ul>
                                                <p className="mt2">ANIMATION TIME FUNCTION</p>
                                                <ul>
                                                    <li
                                                        className={values?.animationTimeFunction === "linear" ? "demo_btn_active" : ""}
                                                        onClick={() => {
                                                            setIsValue(prevValues => ({
                                                                ...prevValues,
                                                                animationTimeFunction: "linear",
                                                            }));
                                                            toggleAnimationClass();
                                                            setAnimationTimingFunction("linear");
                                                        }}>
                                                        linear
                                                    </li>
                                                    <li
                                                        className={values?.animationTimeFunction === "ease-in" ? "demo_btn_active" : ""}
                                                        onClick={() => {
                                                            setIsValue(prevValues => ({
                                                                ...prevValues,
                                                                animationTimeFunction: "ease-in",
                                                            }));
                                                            toggleAnimationClass();
                                                            setAnimationTimingFunction("ease-in");
                                                        }}>
                                                        ease-in
                                                    </li>
                                                    <li
                                                        className={values?.animationTimeFunction === "ease-out" ? "demo_btn_active" : ""}
                                                        onClick={() => {
                                                            setIsValue(prevValues => ({
                                                                ...prevValues,
                                                                animationTimeFunction: "ease-out",
                                                            }));
                                                            toggleAnimationClass();
                                                            setAnimationTimingFunction("ease-out");
                                                        }}>
                                                        ease-out
                                                    </li>
                                                    <li
                                                        className={values?.animationTimeFunction === "ease-in-out" ? "demo_btn_active" : ""}
                                                        onClick={() => {
                                                            setIsValue(prevValues => ({
                                                                ...prevValues,
                                                                animationTimeFunction: "ease-in-out",
                                                            }));
                                                            toggleAnimationClass();
                                                            setAnimationTimingFunction("ease-in-out");
                                                        }}>
                                                        ease-in-out
                                                    </li>
                                                </ul>

                                                <p className="mt2">ANIMATION DURATION</p>
                                                <ul>
                                                    <li className={values?.animationDuration === "0.1" ? "demo_btn_active" : ""}
                                                        onClick={() => {
                                                            setIsValue(prevValues => ({
                                                                ...prevValues,
                                                                animationDuration: "0.1"
                                                            }));
                                                            toggleAnimationClass();
                                                            setAnimationDuration("0.1");
                                                        }}>0.1s</li>
                                                    <li className={values?.animationDuration === "0.2" ? "demo_btn_active" : ""}
                                                        onClick={() => {
                                                            setIsValue(prevValues => ({
                                                                ...prevValues,
                                                                animationDuration: "0.2"
                                                            }));
                                                            toggleAnimationClass();
                                                            setAnimationDuration("0.2");
                                                        }}>0.2s</li>
                                                    <li className={values?.animationDuration === "0.3" ? "demo_btn_active" : ""}
                                                        onClick={() => {
                                                            setIsValue(prevValues => ({
                                                                ...prevValues,
                                                                animationDuration: "0.3"
                                                            }));
                                                            toggleAnimationClass();
                                                            setAnimationDuration("0.3");
                                                        }}>0.3s</li>
                                                    <li className={values?.animationDuration === "0.4" ? "demo_btn_active" : ""}
                                                        onClick={() => {
                                                            setIsValue(prevValues => ({
                                                                ...prevValues,
                                                                animationDuration: "0.4"
                                                            }));
                                                            toggleAnimationClass();
                                                            setAnimationDuration("0.4");
                                                        }}>0.4s</li>
                                                    <li className={values?.animationDuration === "0.5" ? "demo_btn_active" : ""}
                                                        onClick={() => {
                                                            setIsValue(prevValues => ({
                                                                ...prevValues,
                                                                animationDuration: "0.5"
                                                            }));
                                                            toggleAnimationClass();
                                                            setAnimationDuration("0.5");
                                                        }}>0.5s</li>
                                                    <li className={values?.animationDuration === "0.6" ? "demo_btn_active" : ""}
                                                        onClick={() => {
                                                            setIsValue(prevValues => ({
                                                                ...prevValues,
                                                                animationDuration: "0.6"
                                                            }));
                                                            toggleAnimationClass();
                                                            setAnimationDuration("0.6");
                                                        }}>0.6s</li>
                                                    <li className={values?.animationDuration === "0.7" ? "demo_btn_active" : ""}
                                                        onClick={() => {
                                                            setIsValue(prevValues => ({
                                                                ...prevValues,
                                                                animationDuration: "0.7"
                                                            }));
                                                            toggleAnimationClass();
                                                            setAnimationDuration("0.7");
                                                        }}>0.7s</li>
                                                    <li className={values?.animationDuration === "0.8" ? "demo_btn_active" : ""}
                                                        onClick={() => {
                                                            setIsValue(prevValues => ({
                                                                ...prevValues,
                                                                animationDuration: "0.8"
                                                            }));
                                                            toggleAnimationClass();
                                                            setAnimationDuration("0.8");
                                                        }}>0.8s</li>
                                                    <li className={values?.animationDuration === "0.9" ? "demo_btn_active" : ""}
                                                        onClick={() => {
                                                            setIsValue(prevValues => ({
                                                                ...prevValues,
                                                                animationDuration: "0.9"
                                                            }));
                                                            toggleAnimationClass();
                                                            setAnimationDuration("0.9");
                                                        }}>0.9s</li>
                                                    <li className={values?.animationDuration === "1" ? "demo_btn_active" : ""}
                                                        onClick={() => {
                                                            setIsValue(prevValues => ({
                                                                ...prevValues,
                                                                animationDuration: "1"
                                                            }));
                                                            toggleAnimationClass();
                                                            setAnimationDuration("1");
                                                        }}>1s</li>
                                                    <li className={values?.animationDuration === "2" ? "demo_btn_active" : ""}
                                                        onClick={() => {
                                                            setIsValue(prevValues => ({
                                                                ...prevValues,
                                                                animationDuration: "2"
                                                            }));
                                                            toggleAnimationClass();
                                                            setAnimationDuration("2");
                                                        }}>2s</li>
                                                    <li className={values?.animationDuration === "3" ? "demo_btn_active" : ""}
                                                        onClick={() => {
                                                            setIsValue(prevValues => ({
                                                                ...prevValues,
                                                                animationDuration: "3"
                                                            }));
                                                            toggleAnimationClass();
                                                            setAnimationDuration("3");
                                                        }}>3s</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    :
                                    <></>

                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    )

}

export default PopManager