import { supercategoryColors } from "./ExpensePlotHelpers";

export const getData = (isMonthView, year, month, dataType) => {
 
    
    return getMockData(isMonthView, year, month, dataType);
}
export const getMockData = (isMonthView, year, month, dataType) => {
    console.log("generate mock data");
    console.log(year, month, dataType);

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
              {
                  supercategory: "Living Expenses",
                  category: "Rent",
                  amount: 1200,
              },
              {
                  supercategory: "Transportation",
                  category: "Gas",
                  amount: 150,
              },
              {
                  supercategory: "Personal",
                  category: "Gym Membership",
                  amount: 50,
              },
              {
                  supercategory: "Health & Education",
                  category: "Books",
                  amount: 60,
              },
              {
                  supercategory: "Living Expenses",
                  category: "Internet",
                  amount: 70,
              },
              {
                  supercategory: "Transportation",
                  category: "Taxi",
                  amount: 40,
              },
              {
                  supercategory: "Personal",
                  category: "Subscriptions",
                  amount: 30,
              },
              {
                  supercategory: "Health & Education",
                  category: "Online Courses",
                  amount: 200,
              },
              {
                  supercategory: "Living Expenses",
                  category: "Home Insurance",
                  amount: 100,
              },
              {
                  supercategory: "Transportation",
                  category: "Car Maintenance",
                  amount: 120,
              },
              {
                  supercategory: "Personal",
                  category: "Clothing",
                  amount: 150,
              },
              {
                  supercategory: "Health & Education",
                  category: "Medical Bills",
                  amount: 250,
              },
              {
                  supercategory: "Living Expenses",
                  category: "Property Tax",
                  amount: 300,
              },
              {
                  supercategory: "Transportation",
                  category: "Parking Fees",
                  amount: 60,
              },
              {
                  supercategory: "Personal",
                  category: "Hobbies",
                  amount: 80,
              },
              {
                  supercategory: "Health & Education",
                  category: "Childcare",
                  amount: 400,
              },
              {
                  supercategory: "Living Expenses",
                  category: "Cleaning Supplies",
                  amount: 40,
              },
              {
                  supercategory: "Transportation",
                  category: "Public Transit Pass",
                  amount: 100,
              },
              {
                  supercategory: "Personal",
                  category: "Pet Care",
                  amount: 90,
              },
              {
                  supercategory: "Health & Education",
                  category: "Therapy Sessions",
                  amount: 150,
              },
              {
                  supercategory: "Living Expenses",
                  category: "Gardening Supplies",
                  amount: 60,
              },
              {
                  supercategory: "Transportation",
                  category: "Bicycle Maintenance",
                  amount: 30,
              },
              {
                  supercategory: "Personal",
                  category: "Gifts",
                  amount: 200,
              },
              {
                  supercategory: "Health & Education",
                  category: "Fitness Classes",
                  amount: 120,
              },
          ]
        : {
              January: [
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
                  {
                      supercategory: "Health & Education",
                      category: "Tutoring",
                      amount: 150,
                  },
                  {
                      supercategory: "Transportation",
                      category: "Ride Sharing",
                      amount: 100,
                  },
                  {
                      supercategory: "Personal",
                      category: "Pet Supplies",
                      amount: 80,
                  },
                  {
                      supercategory: "Living Expenses",
                      category: "Home Repairs",
                      amount: 200,
                  },
                  {
                      supercategory: "Health & Education",
                      category: "Gym Classes",
                      amount: 120,
                  },
                  {
                      supercategory: "Transportation",
                      category: "Public Transport",
                      amount: 60,
                  },
                  {
                      supercategory: "Personal",
                      category: "Gifts",
                      amount: 90,
                  },
                  {
                      supercategory: "Living Expenses",
                      category: "Household Items",
                      amount: 150,
                  },
                  {
                      supercategory: "Health & Education",
                      category: "Online Courses",
                      amount: 250,
                  },
                  {
                      supercategory: "Transportation",
                      category: "Taxi Rides",
                      amount: 70,
                  },
              ],
              February: [
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
                  {
                      supercategory: "Health & Education",
                      category: "Online Subscriptions",
                      amount: 60,
                  },
                  {
                      supercategory: "Transportation",
                      category: "Car Rental",
                      amount: 200,
                  },
                  {
                      supercategory: "Personal",
                      category: "Hobbies",
                      amount: 150,
                  },
                  {
                      supercategory: "Living Expenses",
                      category: "Gardening",
                      amount: 100,
                  },
                  {
                      supercategory: "Health & Education",
                      category: "Workshops",
                      amount: 300,
                  },
                  {
                      supercategory: "Transportation",
                      category: "Long-Distance Travel",
                      amount: 400,
                  },
                  {
                      supercategory: "Personal",
                      category: "Subscriptions",
                      amount: 50,
                  },
                  {
                      supercategory: "Living Expenses",
                      category: "Cleaning Services",
                      amount: 120,
                  },
                  {
                      supercategory: "Health & Education",
                      category: "Books",
                      amount: 80,
                  },
                  {
                      supercategory: "Transportation",
                      category: "Fuel",
                      amount: 90,
                  },
              ],
              March: [
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
                  {
                      supercategory: "Health & Education",
                      category: "Fitness Classes",
                      amount: 200,
                  },
                  {
                      supercategory: "Transportation",
                      category: "Air Travel",
                      amount: 500,
                  },
                  {
                      supercategory: "Personal",
                      category: "Concerts",
                      amount: 250,
                  },
                  {
                      supercategory: "Living Expenses",
                      category: "Home Decor",
                      amount: 300,
                  },
                  {
                      supercategory: "Health & Education",
                      category: "Language Classes",
                      amount: 180,
                  },
                  {
                      supercategory: "Transportation",
                      category: "Bike Maintenance",
                      amount: 40,
                  },
                  {
                      supercategory: "Personal",
                      category: "Craft Supplies",
                      amount: 70,
                  },
                  {
                      supercategory: "Living Expenses",
                      category: "Utilities",
                      amount: 150,
                  },
                  {
                      supercategory: "Health & Education",
                      category: "Childcare",
                      amount: 400,
                  },
                  {
                      supercategory: "Transportation",
                      category: "Parking Fees",
                      amount: 60,
                  },
              ],
              April: [
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
                  {
                      supercategory: "Health & Education",
                      category: "Nutritionist",
                      amount: 120,
                  },
                  {
                      supercategory: "Transportation",
                      category: "Bicycle Rental",
                      amount: 50,
                  },
                  {
                      supercategory: "Personal",
                      category: "Photography",
                      amount: 300,
                  },
                  {
                      supercategory: "Living Expenses",
                      category: "Home Security",
                      amount: 200,
                  },
                  {
                      supercategory: "Health & Education",
                      category: "Art Classes",
                      amount: 150,
                  },
                  {
                      supercategory: "Transportation",
                      category: "Car Maintenance",
                      amount: 100,
                  },
                  {
                      supercategory: "Personal",
                      category: "Sports Equipment",
                      amount: 250,
                  },
                  {
                      supercategory: "Living Expenses",
                      category: "Insurance",
                      amount: 400,
                  },
                  {
                      supercategory: "Health & Education",
                      category: "Therapy Sessions",
                      amount: 250,
                  },
                  {
                      supercategory: "Transportation",
                      category: "Public Transport Pass",
                      amount: 150,
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
              ],
              June: [
                  {
                      supercategory: "Living Expenses",
                      category: "Food",
                      amount: 330,
                  },
                  {
                      supercategory: "Living Expenses",
                      category: "Utilities",
                      amount: 110,
                  },
                  {
                      supercategory: "Transportation",
                      category: "Public Transit",
                      amount: 70,
                  },
                  {
                      supercategory: "Transportation",
                      category: "Car Expenses",
                      amount: 90,
                  },
                  {
                      supercategory: "Personal",
                      category: "Entertainment",
                      amount: 250,
                  },
                  {
                      supercategory: "Personal",
                      category: "Shopping",
                      amount: 300,
                  },
                  {
                      supercategory: "Health & Education",
                      category: "Healthcare",
                      amount: 100,
                  },
                  {
                      supercategory: "Health & Education",
                      category: "Education",
                      amount: 150,
                  },
                  {
                      supercategory: "Living Expenses",
                      category: "Home Improvement",
                      amount: 500,
                  },
                  {
                      supercategory: "Transportation",
                      category: "Vacation Travel",
                      amount: 800,
                  },
                  {
                      supercategory: "Personal",
                      category: "Summer Clothing",
                      amount: 200,
                  },
                  {
                      supercategory: "Health & Education",
                      category: "Summer Camp",
                      amount: 400,
                  },
              ],
              July: [
                  {
                      supercategory: "Living Expenses",
                      category: "Food",
                      amount: 350,
                  },
                  {
                      supercategory: "Living Expenses",
                      category: "Utilities",
                      amount: 130,
                  },
                  {
                      supercategory: "Transportation",
                      category: "Public Transit",
                      amount: 60,
                  },
                  {
                      supercategory: "Transportation",
                      category: "Car Expenses",
                      amount: 100,
                  },
                  {
                      supercategory: "Personal",
                      category: "Entertainment",
                      amount: 280,
                  },
                  {
                      supercategory: "Personal",
                      category: "Shopping",
                      amount: 320,
                  },
                  {
                      supercategory: "Health & Education",
                      category: "Healthcare",
                      amount: 90,
                  },
                  {
                      supercategory: "Health & Education",
                      category: "Education",
                      amount: 100,
                  },
                  {
                      supercategory: "Living Expenses",
                      category: "Air Conditioning",
                      amount: 150,
                  },
                  {
                      supercategory: "Transportation",
                      category: "Road Trip",
                      amount: 600,
                  },
                  {
                      supercategory: "Personal",
                      category: "Outdoor Equipment",
                      amount: 250,
                  },
                  {
                      supercategory: "Health & Education",
                      category: "Sports Classes",
                      amount: 180,
                  },
              ],
              August: [
                  {
                      supercategory: "Living Expenses",
                      category: "Food",
                      amount: 340,
                  },
                  {
                      supercategory: "Living Expenses",
                      category: "Utilities",
                      amount: 120,
                  },
                  {
                      supercategory: "Transportation",
                      category: "Public Transit",
                      amount: 65,
                  },
                  {
                      supercategory: "Transportation",
                      category: "Car Expenses",
                      amount: 95,
                  },
                  {
                      supercategory: "Personal",
                      category: "Entertainment",
                      amount: 260,
                  },
                  {
                      supercategory: "Personal",
                      category: "Shopping",
                      amount: 290,
                  },
                  {
                      supercategory: "Health & Education",
                      category: "Healthcare",
                      amount: 110,
                  },
                  {
                      supercategory: "Health & Education",
                      category: "Education",
                      amount: 200,
                  },
                  {
                      supercategory: "Living Expenses",
                      category: "Back-to-School Supplies",
                      amount: 300,
                  },
                  {
                      supercategory: "Transportation",
                      category: "Last-Minute Getaway",
                      amount: 450,
                  },
                  {
                      supercategory: "Personal",
                      category: "Fall Wardrobe",
                      amount: 280,
                  },
                  {
                      supercategory: "Health & Education",
                      category: "Textbooks",
                      amount: 250,
                  },
              ],
              September: [
                  {
                      supercategory: "Living Expenses",
                      category: "Food",
                      amount: 320,
                  },
                  {
                      supercategory: "Living Expenses",
                      category: "Utilities",
                      amount: 105,
                  },
                  {
                      supercategory: "Transportation",
                      category: "Public Transit",
                      amount: 80,
                  },
                  {
                      supercategory: "Transportation",
                      category: "Car Expenses",
                      amount: 85,
                  },
                  {
                      supercategory: "Personal",
                      category: "Entertainment",
                      amount: 230,
                  },
                  {
                      supercategory: "Personal",
                      category: "Shopping",
                      amount: 270,
                  },
                  {
                      supercategory: "Health & Education",
                      category: "Healthcare",
                      amount: 95,
                  },
                  {
                      supercategory: "Health & Education",
                      category: "Education",
                      amount: 180,
                  },
                  {
                      supercategory: "Living Expenses",
                      category: "Home Maintenance",
                      amount: 200,
                  },
                  {
                      supercategory: "Transportation",
                      category: "Commute Expenses",
                      amount: 120,
                  },
                  {
                      supercategory: "Personal",
                      category: "Hobby Supplies",
                      amount: 150,
                  },
                  {
                      supercategory: "Health & Education",
                      category: "Tutoring",
                      amount: 220,
                  },
              ],
              October: [
                  {
                      supercategory: "Living Expenses",
                      category: "Food",
                      amount: 335,
                  },
                  {
                      supercategory: "Living Expenses",
                      category: "Utilities",
                      amount: 115,
                  },
                  {
                      supercategory: "Transportation",
                      category: "Public Transit",
                      amount: 75,
                  },
                  {
                      supercategory: "Transportation",
                      category: "Car Expenses",
                      amount: 80,
                  },
                  {
                      supercategory: "Personal",
                      category: "Entertainment",
                      amount: 240,
                  },
                  {
                      supercategory: "Personal",
                      category: "Shopping",
                      amount: 285,
                  },
                  {
                      supercategory: "Health & Education",
                      category: "Healthcare",
                      amount: 105,
                  },
                  {
                      supercategory: "Health & Education",
                      category: "Education",
                      amount: 160,
                  },
                  {
                      supercategory: "Living Expenses",
                      category: "Halloween Decorations",
                      amount: 100,
                  },
                  {
                      supercategory: "Transportation",
                      category: "Fall Road Trip",
                      amount: 350,
                  },
                  {
                      supercategory: "Personal",
                      category: "Halloween Costume",
                      amount: 80,
                  },
                  {
                      supercategory: "Health & Education",
                      category: "Flu Shot",
                      amount: 30,
                  },
              ],
              November: [
                  {
                      supercategory: "Living Expenses",
                      category: "Food",
                      amount: 345,
                  },
                  {
                      supercategory: "Living Expenses",
                      category: "Utilities",
                      amount: 125,
                  },
                  {
                      supercategory: "Transportation",
                      category: "Public Transit",
                      amount: 70,
                  },
                  {
                      supercategory: "Transportation",
                      category: "Car Expenses",
                      amount: 75,
                  },
                  {
                      supercategory: "Personal",
                      category: "Entertainment",
                      amount: 220,
                  },
                  {
                      supercategory: "Personal",
                      category: "Shopping",
                      amount: 400,
                  },
                  {
                      supercategory: "Health & Education",
                      category: "Healthcare",
                      amount: 100,
                  },
                  {
                      supercategory: "Health & Education",
                      category: "Education",
                      amount: 140,
                  },
                  {
                      supercategory: "Living Expenses",
                      category: "Thanksgiving Groceries",
                      amount: 200,
                  },
                  {
                      supercategory: "Transportation",
                      category: "Holiday Travel",
                      amount: 300,
                  },
                  {
                      supercategory: "Personal",
                      category: "Black Friday Shopping",
                      amount: 500,
                  },
                  {
                      supercategory: "Health & Education",
                      category: "Gym Membership",
                      amount: 60,
                  },
              ],
              December: [
                  {
                      supercategory: "Living Expenses",
                      category: "Food",
                      amount: 380,
                  },
                  {
                      supercategory: "Living Expenses",
                      category: "Utilities",
                      amount: 140,
                  },
                  {
                      supercategory: "Transportation",
                      category: "Public Transit",
                      amount: 65,
                  },
                  {
                      supercategory: "Transportation",
                      category: "Car Expenses",
                      amount: 70,
                  },
                  {
                      supercategory: "Personal",
                      category: "Entertainment",
                      amount: 300,
                  },
                  {
                      supercategory: "Personal",
                      category: "Shopping",
                      amount: 600,
                  },
                  {
                      supercategory: "Health & Education",
                      category: "Healthcare",
                      amount: 85,
                  },
                  {
                      supercategory: "Health & Education",
                      category: "Education",
                      amount: 120,
                  },
                  {
                      supercategory: "Living Expenses",
                      category: "Holiday Decorations",
                      amount: 150,
                  },
                  {
                      supercategory: "Transportation",
                      category: "Holiday Travel",
                      amount: 450,
                  },
                  { supercategory: "Personal", category: "Gifts", amount: 700 },
                  {
                      supercategory: "Health & Education",
                      category: "Year-End Medical Checkup",
                      amount: 200,
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
