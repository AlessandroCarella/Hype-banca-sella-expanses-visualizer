import { supercategoryColors } from './ExpensePlotHelpers';

export const generateMockData = (isMonthView) => {
    const mockData = isMonthView
        ? [
              {
                  supercategory: "Living Expenses",
                  category: "Food",
                  amount: 300,
              },
              {
                  supercategory: "Living Expenses",
                  category: "Utilities",
                  amount: 100,
              },
              {
                  supercategory: "Transportation",
                  category: "Public Transit",
                  amount: 80,
              },
              {
                  supercategory: "Transportation",
                  category: "Car Expenses",
                  amount: 70,
              },
              {
                  supercategory: "Personal",
                  category: "Entertainment",
                  amount: 200,
              },
              { supercategory: "Personal", category: "Shopping", amount: 250 },
              {
                  supercategory: "Health & Education",
                  category: "Healthcare",
                  amount: 80,
              },
              {
                  supercategory: "Health & Education",
                  category: "Education",
                  amount: 120,
              },
          ]
        : {
              Jan: [
                  {
                      supercategory: "Living Expenses",
                      category: "Food",
                      amount: 300,
                  },
                  {
                      supercategory: "Living Expenses",
                      category: "Utilities",
                      amount: 100,
                  },
                  {
                      supercategory: "Transportation",
                      category: "Public Transit",
                      amount: 80,
                  },
                  {
                      supercategory: "Transportation",
                      category: "Car Expenses",
                      amount: 70,
                  },
                  {
                      supercategory: "Personal",
                      category: "Entertainment",
                      amount: 200,
                  },
                  {
                      supercategory: "Personal",
                      category: "Shopping",
                      amount: 250,
                  },
                  {
                      supercategory: "Health & Education",
                      category: "Healthcare",
                      amount: 80,
                  },
                  {
                      supercategory: "Health & Education",
                      category: "Education",
                      amount: 120,
                  },
              ],
              Feb: [
                  {
                      supercategory: "Living Expenses",
                      category: "Food",
                      amount: 280,
                  },
                  {
                      supercategory: "Living Expenses",
                      category: "Utilities",
                      amount: 110,
                  },
                  {
                      supercategory: "Transportation",
                      category: "Public Transit",
                      amount: 90,
                  },
                  {
                      supercategory: "Transportation",
                      category: "Car Expenses",
                      amount: 60,
                  },
                  {
                      supercategory: "Personal",
                      category: "Entertainment",
                      amount: 180,
                  },
                  {
                      supercategory: "Personal",
                      category: "Shopping",
                      amount: 200,
                  },
                  {
                      supercategory: "Health & Education",
                      category: "Healthcare",
                      amount: 90,
                  },
                  {
                      supercategory: "Health & Education",
                      category: "Education",
                      amount: 130,
                  },
              ],
              Mar: [
                  {
                      supercategory: "Living Expenses",
                      category: "Food",
                      amount: 320,
                  },
                  {
                      supercategory: "Living Expenses",
                      category: "Utilities",
                      amount: 95,
                  },
                  {
                      supercategory: "Transportation",
                      category: "Public Transit",
                      amount: 70,
                  },
                  {
                      supercategory: "Transportation",
                      category: "Car Expenses",
                      amount: 80,
                  },
                  {
                      supercategory: "Personal",
                      category: "Entertainment",
                      amount: 220,
                  },
                  {
                      supercategory: "Personal",
                      category: "Shopping",
                      amount: 280,
                  },
                  {
                      supercategory: "Health & Education",
                      category: "Healthcare",
                      amount: 70,
                  },
                  {
                      supercategory: "Health & Education",
                      category: "Education",
                      amount: 110,
                  },
              ],
              Apr: [
                  {
                      supercategory: "Living Expenses",
                      category: "Food",
                      amount: 290,
                  },
                  {
                      supercategory: "Living Expenses",
                      category: "Utilities",
                      amount: 105,
                  },
                  {
                      supercategory: "Transportation",
                      category: "Public Transit",
                      amount: 85,
                  },
                  {
                      supercategory: "Transportation",
                      category: "Car Expenses",
                      amount: 75,
                  },
                  {
                      supercategory: "Personal",
                      category: "Entertainment",
                      amount: 190,
                  },
                  {
                      supercategory: "Personal",
                      category: "Shopping",
                      amount: 230,
                  },
                  {
                      supercategory: "Health & Education",
                      category: "Healthcare",
                      amount: 85,
                  },
                  {
                      supercategory: "Health & Education",
                      category: "Education",
                      amount: 125,
                  },
              ],
              May: [
                  {
                      supercategory: "Living Expenses",
                      category: "Food",
                      amount: 310,
                  },
                  {
                      supercategory: "Living Expenses",
                      category: "Utilities",
                      amount: 98,
                  },
                  {
                      supercategory: "Transportation",
                      category: "Public Transit",
                      amount: 75,
                  },
                  {
                      supercategory: "Transportation",
                      category: "Car Expenses",
                      amount: 85,
                  },
                  {
                      supercategory: "Personal",
                      category: "Entertainment",
                      amount: 210,
                  },
                  {
                      supercategory: "Personal",
                      category: "Shopping",
                      amount: 260,
                  },
                  {
                      supercategory: "Health & Education",
                      category: "Healthcare",
                      amount: 75,
                  },
                  {
                      supercategory: "Health & Education",
                      category: "Education",
                      amount: 115,
                  },
              ],
              Jun: [
                  {
                      supercategory: "Living Expenses",
                      category: "Food",
                      amount: 305,
                  },
                  {
                      supercategory: "Living Expenses",
                      category: "Utilities",
                      amount: 102,
                  },
                  {
                      supercategory: "Transportation",
                      category: "Public Transit",
                      amount: 88,
                  },
                  {
                      supercategory: "Transportation",
                      category: "Car Expenses",
                      amount: 78,
                  },
                  {
                      supercategory: "Personal",
                      category: "Entertainment",
                      amount: 195,
                  },
                  {
                      supercategory: "Personal",
                      category: "Shopping",
                      amount: 240,
                  },
                  {
                      supercategory: "Health & Education",
                      category: "Healthcare",
                      amount: 88,
                  },
                  {
                      supercategory: "Health & Education",
                      category: "Education",
                      amount: 118,
                  },
              ],
          };
    // Add color information to the data
    return isMonthView
        ? mockData.map((item) => ({
              ...item,
              color: supercategoryColors[item.supercategory],
          }))
        : Object.fromEntries(
              Object.entries(mockData).map(([month, items]) => [
                  month,
                  items.map((item) => ({
                      ...item,
                      color: supercategoryColors[item.supercategory],
                  })),
              ])
          );
};
