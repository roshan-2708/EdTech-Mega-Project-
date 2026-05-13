import React, { useState, useEffect } from "react";
import CTAButton from "./Button";

const CodeBlocks = ({
    position = "lg:flex-row",
    heading,
    subheading,
    ctabtn1 = {},
    ctabtn2 = {},
    codeBlock = "",
    backgroundGradient = "",
    codeColor = "text-yellow-300",
}) => {

    const [typedCode, setTypedCode] = useState("");
    const typingSpeed = 20;

    useEffect(() => {
        let index = 0;
        let interval;

        const startTyping = () => {
            interval = setInterval(() => {
                // Hum next character add kar rahe hain
                setTypedCode(codeBlock.slice(0, index));
                index++;

                // Agar pura code type ho gaya
                if (index > codeBlock.length) {
                    clearInterval(interval);

                    // 2 second ka pause de kar firse restart karenge
                    setTimeout(() => {
                        index = 0;
                        startTyping();
                    }, 5000);
                }
            }, typingSpeed);
        };

        startTyping();

        // Cleanup function
        return () => {
            clearInterval(interval);
        };
    }, [codeBlock]);
    return (
        <div className={`flex flex-col ${position} my-20 justify-between items-center gap-8`}>

            {/* LEFT */}
            <div className="w-full lg:w-1/2 flex flex-col gap-6">
                <h1 className="text-3xl font-bold leading-snug">{heading}</h1>
                <p className="text-richblack-300 text-lg">{subheading}</p>

                <div className="flex gap-4">
                    <CTAButton active={ctabtn1.active} linkto={ctabtn1.linkto}>
                        {ctabtn1.btnText}
                    </CTAButton>

                    <CTAButton active={ctabtn2.active} linkto={ctabtn2.linkto}>
                        {ctabtn2.btnText}
                    </CTAButton>
                </div>
            </div>

            {/* RIGHT — CODE BOX */}
            <div className="relative w-full lg:w-1/2 flex justify-center">

                {/* FIXED WIDTH WRAPPER (important) */}
                <div className="w-full max-w-[480px] relative">

                    {/* Glow */}
                    <div
                        className={`absolute inset-0 ${backgroundGradient} blur-2xl opacity-60`}
                    />

                    {/* Code */}
                    <pre
                        className={`relative w-full p-6 bg-richblack-800
                        border border-richblack-700 shadow-[0_0_25px_rgba(0,0,0,0.5)]
                        font-mono text-[15px] leading-7 whitespace-pre-wrap ${codeColor}`}
                    >
                        {typedCode}
                    </pre>
                </div>
            </div>
        </div>
    );
};

export default CodeBlocks;
