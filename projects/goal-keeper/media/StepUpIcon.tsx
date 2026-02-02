import React from 'react';

const StepUpIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200" className='max-h-full'>
        <rect width="300" height="200" fill="transparent"/>
        
        <polyline
            points="
            30,170
            100,170
            100,100
            170,100
            170,30
            240,30
            "
            stroke="#2ECC71"
            strokeWidth="10"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export default StepUpIcon;