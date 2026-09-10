import React from 'react';

const HighlighText = ({ text }) => {
    return ( 
        <span className='font-semiboldbold text-yellow-400'>
            {text}
        </span>
    );
};

export default HighlighText;
