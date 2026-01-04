
export default function formatArabicDate(date) {



    const formattedDate = new Date(date);
    return formattedDate;

    // return formattedDate.toLocaleDateString("ar-EG", {
    //     day: "numeric",
    //     month: "long",
    //     year: "numeric",
    // });
}