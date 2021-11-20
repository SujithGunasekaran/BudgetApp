
interface objectKeys {
    [key: string]: any
}

interface dashboardData {
    date: string | number,
    Income: string | number,
    Expenses: string | number,
    Investment: string | number
}

class MonthData {

    startDate: number;
    endDate: number;
    transactionData: objectKeys;
    monthlyDashboardData: Array<dashboardData>;

    constructor(currentStartDate: any, currentEndDate: any, transactionData: any) {
        this.startDate = +currentStartDate;
        this.endDate = +currentEndDate;
        this.transactionData = transactionData;
        this.monthlyDashboardData = [];
    }

    #constructInitialData() {
        for (let i: number = this.startDate; i <= this.endDate; i++) {
            let initialData: dashboardData = {
                date: String(i),
                Income: 0,
                Expenses: 0,
                Investment: 0
            };
            this.monthlyDashboardData.push(initialData);
        }
    }


    #calculateTransaction(transactionHistory: objectKeys[]) {
        let Income = 0, Expenses = 0, Investment = 0;
        transactionHistory.forEach((element: any) => {
            const { transactiontype, amount } = element;
            switch (transactiontype) {
                case 'Income':
                    Income += +amount;
                    break;
                case 'Expenses':
                    Expenses += +amount;
                    break;
                case 'Investment':
                    Investment += +amount;
                    break;
                default: null;
            }
        });
        return { Income, Expenses, Investment };
    }


    #addDataToMonthlyDashboard(monthDate: string, transactionResult: objectKeys) {
        for (let i: number = 0; i < this.monthlyDashboardData.length; i++) {
            const { date } = this.monthlyDashboardData[i];
            const { Income, Expenses, Investment } = transactionResult;
            if (String(date) === monthDate) {
                this.monthlyDashboardData[i] = {
                    date,
                    Income, Expenses, Investment
                }
            }
        }
    }


    #calculateNextStartAndEndDate() {
        let date = new Date();
        let monthLastDate: any = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
        let nextStartDate = (+monthLastDate - +this.startDate) >= 7 ? +this.startDate + 7 : (+this.startDate + (+monthLastDate - +this.startDate));
        let nextEndDate = (+monthLastDate - +this.endDate) >= 7 ? (+this.endDate + 7) : (+this.endDate + (+monthLastDate - +this.endDate));
        return { nextStartDate, nextEndDate };
    }


    getTransactionData() {
        return new Promise((resolve) => {
            this.#constructInitialData();
            const { nextStartDate, nextEndDate } = this.#calculateNextStartAndEndDate();
            if (this.transactionData.transactionHistory || this.transactionData.transactionHistory.monthHistory.length > 0) {
                const { dateHistory = [] } = this.transactionData.transactionHistory.monthHistory[0];
                dateHistory.forEach((element: any) => {
                    const { date, transactionList } = element;
                    if (+date >= this.startDate && +date <= this.endDate) {
                        const calculatedTransactionResult = this.#calculateTransaction(transactionList);
                        this.#addDataToMonthlyDashboard(String(date), calculatedTransactionResult);
                    }
                });
                const monthlyDashboardData = {
                    previousStartDate: this.startDate,
                    previousEndDate: this.endDate,
                    nextStartDate,
                    nextEndDate,
                    dashBoardData: this.monthlyDashboardData
                }
                resolve(monthlyDashboardData);
            }
            else {
                const monthlyDashboardData = {
                    previousStartDate: this.startDate,
                    previousEndDate: this.endDate,
                    nextStartDate,
                    nextEndDate,
                    dashBoardData: this.monthlyDashboardData
                }
                resolve(monthlyDashboardData);
            }
        })
    }

}


export default MonthData;
