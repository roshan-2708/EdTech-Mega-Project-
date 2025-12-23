import React from "react";
import IconButton from "./IconButton";

const ConfirmationModal = ({ modalData }) => {
    return (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black bg-opacity-50">
            <div className="w-11/12 max-w-sm rounded-lg bg-richblack-800 p-6">
                <p className="text-lg font-semibold text-white">
                    {modalData.text1}
                </p>
                <p className="mt-2 text-sm text-richblack-300">
                    {modalData.text2}
                </p>

                <div className="mt-6 flex justify-end gap-x-4">
                    <IconButton
                        text={modalData.btn1Text}
                        onClick={modalData.btn1Handler}
                    />
                    <button
                        onClick={modalData.btn2Handler}
                        className="rounded-md bg-richblack-700 px-4 py-2 text-white"
                    >
                        {modalData.btn2Text}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
