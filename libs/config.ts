export const REACT_APP_API_URL = `${process.env.REACT_APP_API_URL}`;

export const availableProductOptions = ['productExchangeable', 'productRentalAvailable'];

const thisYear = new Date().getFullYear();

export const productYears: number[] = [];
export const toDateRangeISOString = (startYear: number, endYear: number) => ({
	start: new Date(startYear, 0, 1).toISOString(),              // Jan 1, startYear 00:00:00
	end: new Date(endYear, 11, 31, 23, 59, 59, 999).toISOString(), // Dec 31, endYear 23:59:59.999
  });

for (let i = 2020; i <= thisYear; i++) {
	productYears.push(i);
}
export const ringSize: number[] = [
	0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
	11, 12, 13, 14, 15, 16, 17, 18, 19,
	20, 21, 22, 23, 24,
];

export const productWeight = [
	1.0, 1.5, 1.8,2.0, 2.2, 2.5, 2.7, 3.0, 3.3, 3.5, 3.8, 4.0, 4.2,
	4.5, 4.7, 5.0, 5.3, 5.5, 5.8, 6.0, 6.3, 6.5, 6.8, 7.0
  ];
export const productPrice: number[] = [];

const maxPrice = 20000000; // max price you want
const step = 50000; // step amount, you can adjust

for (let price = 0; price <= maxPrice; price += step) {
  productPrice.push(price);
}
export const Messages = {
	error1: 'Something went wrong!',
	error2: 'Please login first!',
	error3: 'Please fulfill all inputs!',
	error4: 'Message is empty!',
	error5: 'Only images with jpeg, jpg, png format allowed!',
};

export const topProductRank = 2
