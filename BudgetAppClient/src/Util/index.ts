
interface objectKey {
    [key: string]: any
}

export const formValidation = (objectKeys: string[], formData: objectKey, errorStateSetter: any) => {

    let result = true;
    objectKeys.forEach(key => {
        if (key === 'password') {
            if (formData[key] && formData[key].length < 7) {
                errorStateSetter((prevValue: objectKey) => {
                    let errorMessage = JSON.parse(JSON.stringify(prevValue));
                    errorMessage = {
                        ...errorMessage,
                        [`${key}Error`]: `Password Must be atleast 8 character length`
                    };
                    return errorMessage;
                })
            }
        }
        if (!formData[key]) {
            result = false;
            errorStateSetter((prevValue: objectKey) => {
                let errorMessage = JSON.parse(JSON.stringify(prevValue));
                errorMessage = {
                    ...errorMessage,
                    [`${key}Error`]: `Please enter ${key}`
                };
                return errorMessage;
            })
        }
    })

    return result;

}