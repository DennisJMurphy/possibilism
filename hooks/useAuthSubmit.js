import React { useState } from 'react';
// need state to track an error setting
import axios from './axios';

export function useAuthSubmit() {
    const [error, setError] = useState();

    const handleSubmit = (url, fieldValues) => {
        axios.post(url, fieldValues).then((resp => {
            resp.data.success ? location.replace('/') : setError(true);
            // nifty E6 shorthand for if / else
            // if (resp.data.success === true) {
            //     location.replace('/')
            // } else {
            //     setError(true);
            // }
            }
        })
    .catch (err) => {
        console.log('error in axios Post to' + url, err);
        setError(true);
    });
};
return [error, handleSubmit];
}

// in Start:
//import { useAuthSubmit } from './hooks/useAuthSubmit';
