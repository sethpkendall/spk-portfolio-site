import React from 'react';

const CountDownIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200" className='max-h-full'>
        <rect width="300" height="200" fill="transparent"/>
        
        <polyline
            points="
                30,30
                100,30
                100,60
                170,60
                170,170
                240,170
            "
            stroke="#E74C3C"
            strokeWidth="10"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export default CountDownIcon;