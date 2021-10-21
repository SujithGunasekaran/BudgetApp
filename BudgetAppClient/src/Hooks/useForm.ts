import React, { useState } from 'react';


const useForm = () => {

    const [formValue, setFormValue] = useState<{ [key: string]: any }>({});

    const updateFormValue = (name: string | undefined, value: string | undefined) => {
        if (name && value) {
            setFormValue((prevValue) => {
                let formValue = JSON.parse(JSON.stringify(prevValue));
                formValue = {
                    ...formValue,
                    [name]: value
                }
                return formValue;
            })
        }
    }

    const updateDefaultValue = (valueList: { [key: string]: any }) => {
        setFormValue((prevValue) => {
            let formValue = JSON.parse(JSON.stringify(prevValue));
            formValue = valueList;
            return formValue;
        })
    }

    const handleFormValueWithEvent = (e: React.ChangeEvent<HTMLInputElement>) => {
        updateFormValue(e.target.name, e.target.value);
    }

    const clearFormValue = (keyName: string) => {
        if (formValue[keyName]) {
            setFormValue((prevValue) => {
                let formValue = JSON.parse(JSON.stringify(prevValue));
                delete formValue[keyName];
                return formValue;
            })
        }
    }

    const handleFormValueWithParams = (name: string | undefined, value: string | undefined, clearKey: string | undefined) => {
        updateFormValue(name, value);
        if (clearKey && name && formValue[name] && formValue[name] !== value) clearFormValue(clearKey);
    }


    return { formValue, handleFormValueWithEvent, handleFormValueWithParams, updateDefaultValue }

}

export default useForm;
