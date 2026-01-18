export default function GetAvgRating(ratingArr) {
    if (!ratingArr || ratingArr.length === 0) return 0;

    const totalReviewCount = ratingArr.reduce((acc, curr) => {
        return acc + (curr.rating || 0);
    }, 0);

    // Round to 1 decimal place
    return Math.round((totalReviewCount / ratingArr.length) * 10) / 10;
}
