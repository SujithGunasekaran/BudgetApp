interface objectKeys {
    [key: string]: any
};


export const checkIsDateRangeIsAvailable = (date: string, monthData: objectKeys[]) => {
    let firstDate = monthData[0].date;
    let lastDate = monthData[monthData.length - 1].date;
    if (+date >= firstDate && +date <= lastDate) return true;
    else return false;
}


const searchValueInSortedArray = (arr: string[], findValue: number, start: number, end: number): null | number => {
    if (start > end) return null;
    let mid = Math.floor((start + end) / 2);
    if (+arr[mid] === findValue) return mid;
    if (+arr[mid] > findValue) {
        return searchValueInSortedArray(arr, findValue, start, mid - 1);
    }
    else {
        return searchValueInSortedArray(arr, findValue, mid + 1, end);
    }
}

export const getDateIndex = (date: string, monthData: objectKeys[]) => {
    let dateArray = monthData.map((element: any) => element.date);
    const dateIndex = searchValueInSortedArray(dateArray, Number(date), 0, monthData.length - 1);
    return dateIndex;
}
