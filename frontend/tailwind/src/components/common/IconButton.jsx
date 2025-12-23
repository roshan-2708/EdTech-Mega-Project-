const IconButton = ({
    text,
    onClick,
    children,
    disabled,
    type = "button",
    customClasses = "",
}) => {
    return (
        <button
            disabled={disabled}
            onClick={onClick}
            type={type}
            className={`flex items-center gap-x-2 rounded-md bg-yellow-50
                  px-4 py-2 font-medium text-richblack-900
                  ${customClasses}`}
        >
            {text}
            {children}
        </button>
    );
};

export default IconButton;
