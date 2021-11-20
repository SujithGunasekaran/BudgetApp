
interface objectKey {
    [key: string]: any
}

const date = new Date();

export const currentDateValue = date.getDate();

export const currentMonthValue = date.getMonth();

export const currentYearValue = date.getFullYear();

export const lastDateOfCurrentMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

export const FullMonth = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const formValidation = (objectKeys: string[], formData: objectKey, errorStateSetter: any) => {

    let result = true;
    objectKeys.forEach(key => {
        if (key === 'password') {
            if (formData[key] && formData[key].length < 7) {
                result = false;
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
