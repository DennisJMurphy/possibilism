import React { useState } from 'react';

export function useStatefulFields() {
    const [fields, setFields] = useState({});
    const handleChange = e => {
        setFields({
            ...fields, // spreads the state values across the fields
            [e.target.name]: e.target.value,
        });
    };
    return [fields, handleChange];
}

// in Start:
//import { useStatefulFields } from './hooks/useStatefulFields';