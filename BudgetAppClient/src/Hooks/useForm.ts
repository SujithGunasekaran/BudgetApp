import React, { useState } from 'react';


const useForm = () => {

    const [formValue, setFormValue] = useState<{ [key: string]: any }>({});
    const [formError, setFormError] = useState<{ [key: string]: any }>({});

    const updateFormValue = (name: string | undefined, value: string | undefined) => {
        if (name) {
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

    const removeKeyFromError = (keyName: string) => {
        setFormError(prevValue => {
            let formError = JSON.parse(JSON.stringify(prevValue));
            delete formError[keyName];
            return formError;
        })
    }

    const handleFormValueWithEvent = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;
        if (e.target && e.target.dataset) {
            switch (true) {
                case e.target.dataset.remove === 'comma':
                    value = value.replace(/,/g, '');
                    break;
                default: value = e.target.value;
            }
        }
        updateFormValue(e.target.name, value);
        if (formError[`${e.target.name}Error`]) {
            removeKeyFromError(`${e.target.name}Error`);
        }
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
        if (name && formError[`${name}Error`]) {
            removeKeyFromError(`${name}Error`);
        }
        if (clearKey && name && formValue[name] && formValue[name] !== value) clearFormValue(clearKey);
    }


    return { formValue, formError, setFormError, handleFormValueWithEvent, handleFormValueWithParams, updateDefaultValue }

}

export default useForm;
