import React from 'react';

const HighlighText = ({ text }) => {
    return ( 
        <span className='font-bold text-blue-100'>
            {text}
        </span>
    );
};

export default HighlighText;
