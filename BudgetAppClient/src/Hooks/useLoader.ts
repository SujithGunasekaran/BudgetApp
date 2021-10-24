import { useState } from 'react';


const useLoader = () => {

    const [loader, setLoader] = useState<Boolean>(false);

    return { loader, setLoader };

}

export default useLoader;
