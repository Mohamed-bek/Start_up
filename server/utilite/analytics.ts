// import { Document, Model } from "mongoose";

// interface MonthData {
//   month: string;
//   count: number;
// }
// export async function generateLast12MonthsData<T extends Document>(
//   model: Model<T>
// ): Promise<{ last12Months: MonthData[] }> {
//   const last12Months: MonthData[] = [];
//   const currentDate = new Date();
//   currentDate.setDate(currentDate.getDate() + 1);

//   for (let i = 11; i >= 0; i--) {
//     const endDate = new Date(
//       currentDate.getFullYear(),
//       currentDate.getMonth(),
//       currentDate.getDate() - i * 28
//     );
//     const startDate = new Date(
//       endDate.getFullYear(),
//       endDate.getMonth(),
//       endDate.getDate() - 28
//     );
//     const monthYear = endDate.toLocaleString("default", {
//       day: "numeric",
//       month: "short",
//       year: "numeric",
//     });
//     const count = await model.countDocuments({
//       createdAt: {
//         $gte: startDate,
//         $lt: endDate,
//       },
//     });
//     last12Months.push({ month: monthYear, count });
//   }
//   return { last12Months };
// }

// import { Document, Model } from "mongoose";

// interface MonthData {
//   month: string;
//   count: number;
// }

// export async function generateLast12MonthsData<T extends Document>(
//   model: Model<T>
// ): Promise<{ last12Months: MonthData[] }> {
//   try {
//     const last12Months: MonthData[] = [];

//     // Get the current date
//     const currentDate = new Date();

//     // Calculate the date 12 months ago
//     const twelveMonthsAgo = new Date();
//     twelveMonthsAgo.setMonth(currentDate.getMonth() - 11);

//     // Aggregate query to group documents by month and count them
//     const result = await model.aggregate([
//       {
//         $match: {
//           createdAt: { $gte: twelveMonthsAgo, $lt: currentDate },
//         },
//       },
//       {
//         $group: {
//           _id: { $dateToString: { format: "%Y %B", date: "$createdAt" } },
//           count: { $sum: 1 },
//         },
//       },
//       {
//         $sort: { _id: 1 },
//       },
//     ]);

//     // Populate the last12Months array with the result
//     result.forEach((item: any) => {
//       last12Months.push({ month: item._id, count: item.count });
//     });

//     return { last12Months };
//   } catch (error) {
//     throw new Error(`Error generating last 12 months data: ${error}`);
//   }
// }

// import { Document, Model } from "mongoose";

// interface MonthData {
//   month: string;
//   count: number;
// }

// export async function generateLast12MonthsData<T extends Document>(
//   model: Model<T>
// ): Promise<{ last12Months: MonthData[] }> {
//   const last12Months: MonthData[] = [];
//   const currentDate = new Date();
//   currentDate.setDate(currentDate.getDate() + 1);

//   for (let i = 11; i >= 0; i--) {
//     const endDate = new Date(
//       currentDate.getFullYear(),
//       currentDate.getMonth() - i,
//       0
//     ); // Last day of the month
//     const startDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1); // First day of the month
//     const monthYear = endDate.toLocaleString("default", {
//       month: "short",
//       year: "numeric",
//     });
//     const count = await model.countDocuments({
//       createdAt: {
//         $gte: startDate,
//         $lte: endDate,
//       },
//     });
//     last12Months.push({ month: monthYear, count });
//   }
//   return { last12Months };
// }
import { Document, Model } from "mongoose";

interface MonthData {
  month: string;
  count: number;
}

export async function generateLast6MonthsData<T extends Document>(
  model: Model<T>
): Promise<{ months: string[]; counts: number[] }> {
  const months: string[] = [];
  const counts: number[] = [];
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + 1);

  for (let i = 5; i >= 0; i--) {
    const endDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - i,
      0
    ); // Last day of the month
    const startDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1); // First day of the month
    const monthYear = endDate.toLocaleString("default", {
      month: "short",
      year: "numeric",
    });
    const count = await model.countDocuments({
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    });
    months.push(monthYear);
    counts.push(count);
  }
  return { months, counts };
}
