export const transactionType = [
    {
        displayValue: 'Income',
        value: 'Income'
    },
    {
        displayValue: 'Expenses',
        value: 'Expenses'
    },
    {
        displayValue: 'Investment',
        value: 'Investment'
    }
];

const IncomCategories = [
    {
        displayValue: 'Salary',
        value: 'Salary'
    },
    {
        displayValue: 'Other',
        value: 'Other'
    }
];

const ExpensesCategories = [
    {
        displayValue: 'Amazon',
        value: 'Amazon'
    },
    {
        displayValue: 'Flipkart',
        value: 'Flipkart'
    },
    {
        displayValue: 'Food',
        value: 'Food'
    },
    {
        displayValue: 'Electricity',
        value: 'Electricity'
    },
    {
        displayValue: 'Mobile Recharge',
        value: 'MobileRecharge'
    },
    {
        displayValue: 'Studies',
        value: 'Studies'
    },
    {
        displayValue: 'Medical',
        value: 'Medical'
    },
    {
        displayValue: 'Travel',
        value: 'Travel'
    },
    {
        displayValue: 'Shopping',
        value: 'Shopping'
    }
];

const InvestmentCategories = [
    {
        displayValue: 'Share Market',
        value: 'ShareMarket'
    },
    {
        displayValue: 'Mutual Fund',
        value: 'MutualFund'
    },
    {
        displayValue: 'Banke FD',
        value: 'BankFd'
    }
];


export const transactionOptions: any = {
    'Income': IncomCategories,
    'Expenses': ExpensesCategories,
    'Investment': InvestmentCategories
}
