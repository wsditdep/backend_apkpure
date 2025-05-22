"use client";

import { createUser } from "@/app/actions/user/action";
import { useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { toast } from 'react-hot-toast';
import MultiRangeSlider from "multi-range-slider-react";
import { useRouter } from "next/navigation";

function Submit({ setShowModal }) {
    const { pending } = useFormStatus();

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
                    `Add`
            }
            </button>
        </>
    )
}

const CreateUser = ({ membership, settings }) => {

    const router = useRouter();

    const [showModal, setShowModal] = useState(false);

    const [minValue, set_minValue] = useState(30);
    const [maxValue, set_maxValue] = useState(70);
    const [isAllow, setIsAllow] = useState(true);
    const [isAllowRobOrder, setIsAllowRobOrder] = useState(true);
    const [isShowTags, setIsShowTags] = useState(false);

    const [tags, setTags] = useState([]);

    const defaultTags = [5, 10, 50, 200, 500, 1000];
    const dropdownRef = useRef(null);

    const addTags = (value) => {
        if (!tags.includes(value)) {
            setTags([...tags, value]);
        } else {
            setTags(tags.filter(tag => tag !== value));
        }
    }

    const removeTags = (value) => {
        setTags(tags.filter(tag => tag !== value));
    }

    const handleInput = (e) => {
        set_minValue(e.minValue);
        set_maxValue(e.maxValue);
    };

    const handleForm = async (formData) => {

        formData.append("match_min", minValue);
        formData.append("match_max", maxValue);
        formData.append("allow_withdrawal", isAllow);
        formData.append("allow_rob_order", isAllowRobOrder);
        formData.append("winning_amount", JSON.stringify(tags));

        try {
            const response = await createUser(formData);

            if (response.status === 201) {
                toast.success(response.message);
                setShowModal(false);
                setTags([])
                setIsShowTags(false);
                router.refresh();
                return;
            } else {
                toast.error(response.message);
            }

        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsShowTags(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownRef]);

    useEffect(() => {
        set_minValue(settings?.matching_range_min ?? 30);
        set_maxValue(settings?.matching_range_max ?? 70);
    }, []);

    return (
        <div className="create-wrapper">
            <div className="create-btn">
                <button onClick={() => setShowModal(true)} className="btn btn-tertiary"><i className="fa fa-plus"></i> New</button>
            </div>
            {
                showModal
                    ?
                    <div className="create-modal-wrapper" onClick={() => setShowModal(false)}>
                        <div className="create-modal" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h3>Add User | Add practice account</h3>
                                <i onClick={() => setShowModal(false)} className="fa fa-times"></i>
                            </div>
                            <div className="create-form">
                                <form action={handleForm} >
                                    <div className="create-form-group">
                                        <label>Username <span>*</span></label>
                                        <input
                                            type="text"
                                            placeholder="Please enter user name"
                                            name="username"
                                            required
                                            onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
                                        />
                                        <input
                                            type="hidden"
                                            name="role"
                                            value="practice"
                                        />
                                    </div>
                                    <div className="create-form-group">
                                        <label>Level <span>*</span></label>
                                        <select name="membership_level">
                                            {
                                                membership?.map((data, index) => (
                                                    <option key={index} value={data.membership_name}>{data.membership_name}</option>
                                                ))
                                            }
                                        </select>
                                    </div>
                                    <div className="create-form-group">
                                        <label>Parent ID <span>*</span></label>
                                        <input
                                            type="number"
                                            placeholder="Please enter parent id"
                                            name="parent_id"
                                            required
                                            onWheel={(e) => e.target.blur()}
                                            onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
                                        />
                                    </div>
                                    <div className="create-form-group">
                                        <label>Phone Number <span>*</span></label>
                                        <input
                                            type="text"
                                            placeholder="Please enter phone number"
                                            title="Please enter at least 8 digits."
                                            name="phone_number"
                                            required
                                            onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
                                        />
                                    </div>
                                    <div className="create-form-group">
                                        <label>Balance</label>
                                        <input
                                            type="number"
                                            placeholder="Please enter balance"
                                            name="balance"
                                            step="any"
                                            onWheel={(e) => e.target.blur()}
                                            onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
                                        />
                                    </div>
                                    <div className="create-form-group">
                                        <label>Withdrawal minimum amount</label>
                                        <input
                                            type="number"
                                            placeholder="Please enter withdrawal minimum amount"
                                            name="min_withdrawal_amount"
                                            step="any"
                                            onWheel={(e) => e.target.blur()}
                                            onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
                                        />
                                    </div>
                                    <div className="create-form-group">
                                        <label>Withdrawal maximum amount</label>
                                        <input
                                            type="number"
                                            placeholder="Please enter withdrawal maximum amount"
                                            name="max_withdrawal_amount"
                                            step="any"
                                            onWheel={(e) => e.target.blur()}
                                            onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
                                        />
                                    </div>
                                    <div className="create-form-group">
                                        <label>Withdrawal needed to complete order</label>
                                        <input
                                            type="number"
                                            placeholder="Please enter withdrawal needed to complete order"
                                            name="withdrawal_needed_order"
                                            step="any"
                                            onWheel={(e) => e.target.blur()}
                                            onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
                                        />
                                    </div>
                                    <div className="create-form-group">
                                        <label>Matching range</label>
                                        <div className="range-slider-wrapper">
                                            <MultiRangeSlider
                                                min={0}
                                                max={100}
                                                step={5}
                                                minValue={minValue}
                                                maxValue={maxValue}
                                                onInput={(e) => {
                                                    handleInput(e);
                                                }}
                                            />
                                            <p className="range_value">{minValue}% - {maxValue}%</p>
                                        </div>
                                    </div>
                                    <div className="create-form-group">
                                        <label>Password <span>*</span></label>
                                        <input
                                            type="text"
                                            placeholder="Please enter password"
                                            name="password"
                                            required
                                            onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
                                        />
                                    </div>
                                    <div className="create-form-group">
                                        <label>Payment password  <span>*</span></label>
                                        <input
                                            type="text"
                                            placeholder="Please enter payment password"
                                            name="withdrawal_pin"
                                            required
                                            onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
                                        />
                                    </div>
                                    <div className="create-form-group">
                                        <label>Whether to allow rob order</label>
                                        <div className="toggle-btn-app">
                                            <label className="switch">
                                                <input
                                                    type="checkbox"
                                                    defaultChecked
                                                    onChange={() => setIsAllowRobOrder(!isAllowRobOrder)}
                                                />
                                                <span className="slider round"></span>
                                            </label>
                                        </div>``
                                    </div>
                                    <div className="create-form-group">
                                        <label>Whether to allow withdrawal</label>
                                        <div className="toggle-btn-app">
                                            <label className="switch">
                                                <input
                                                    type="checkbox"
                                                    defaultChecked
                                                    onChange={() => setIsAllow(!isAllow)}
                                                />
                                                <span className="slider round"></span>
                                            </label>
                                        </div>
                                    </div>
                                    <div className="create-form-group">
                                        <label>Number of draws</label>
                                        <input
                                            type="number"
                                            placeholder="Number of draws"
                                            name="number_of_draws"
                                            defaultValue="0"
                                            onWheel={(e) => e.target.blur()}
                                            onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
                                        />
                                    </div>
                                    <div className="create-form-group">
                                        <label>Winning amount</label>
                                        <div className="multi-array-input-box" onClick={() => setIsShowTags(true)} ref={dropdownRef}>
                                            {
                                                isShowTags
                                                    ?
                                                    <div className="multi-array-input-box-data" onClick={(e) => e.stopPropagation()}>
                                                        <ul>
                                                            {
                                                                defaultTags?.map((data, index) => (
                                                                    <li
                                                                        onClick={() => addTags(data)}
                                                                        key={index}
                                                                        className={tags.includes(data) ? "active" : ""}
                                                                    >
                                                                        {data}
                                                                        {
                                                                            tags.includes(data)
                                                                                ?
                                                                                <i className="fa fa-check"></i>
                                                                                :
                                                                                <></>
                                                                        }
                                                                    </li>
                                                                ))
                                                            }
                                                        </ul>
                                                    </div>
                                                    :
                                                    <></>
                                            }
                                            <div className="multi-array-input-box-data-selecte">
                                                {
                                                    tags?.map((data, index) => (
                                                        <div key={index} className="multi-array-input-box-data-selected">
                                                            <p>{data} <i onClick={() => removeTags(data)} className="fa fa-times"></i></p>
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    <div className="create-form-action">
                                        <Submit setShowModal={setShowModal} />
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    :
                    <></>
            }
        </div>
    )
}


export default CreateUser