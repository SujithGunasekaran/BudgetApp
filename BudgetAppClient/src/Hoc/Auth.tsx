import React, { useState, useEffect, FC } from 'react';
import { userAxios } from '../Util/Api';
import { useDispatch } from 'react-redux';
import ErrorMessage from '../UI/Messages/ErrorMessage';

type AuthHocProps = {
    history: any
}

const AuthHoc = (Component: FC<AuthHocProps>) => {

    const NewComponent: FC<AuthHocProps> = (props) => {

        // react-state
        const [isUserAuthenticated, setIsUserAuthenticated] = useState<boolean>(false);
        const [apiError, setApiError] = useState<null | string>(null);

        // props
        const { history } = props;

        // dispatch
        const dispatch = useDispatch();

        useEffect(() => {
            getUserInfo();
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [])

        const getUserInfo = async () => {
            const userToken = sessionStorage.getItem('userToken');
            try {
                const response: any = await userAxios.get('/checkUser', {
                    headers: {
                        'x-powered-token': userToken || ''
                    }
                });
                if (response && response.data && response.data.status === 'Success') {
                    const { data } = response;
                    dispatch({
                        type: 'SET_USER_INFO',
                        userInfo: data.userInfo
                    });
                    setIsUserAuthenticated(true);
                }
            }
            catch (err: any) {
                if (err.response && err.response.data) {
                    if (err.response.data.message === 'InvalidToken') {
                        setApiError('Invalid Token, User not authenticated');
                        sessionStorage.removeItem('userToken');
                        setTimeout(() => {
                            history.push('/');
                        }, 3000)
                    }
                }
            }
        }

        if (apiError) {
            return (
                <ErrorMessage
                    message={apiError}
                    handleMessageModel={() => { }}
                />
            )
        }

        if (!isUserAuthenticated) return <div>Loading...</div>

        return (
            <Component
                {...props}
            />
        )

    }

    return NewComponent;


}

export default AuthHoc;
