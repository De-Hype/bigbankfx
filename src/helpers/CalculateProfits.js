const CalculateDailyProfit = async(plan) => {
    //For this to work, we are gonna set up a scripts that runs every day
    //This script will fetch the details of the user and then check their balance
    //If they have cash in their balance, it will calculate the profit off the amount in the balance.
    //This should be done for all the users
    let principal =0;
    const dailyPercentForBasicPlan=(2/100);
    const dailyPercentForSilverPlan=(2/100);
    const dailyPercentForGoldPlan=(2/100);
    if (plan === "basic"){
        //Fetch User Details 
    }
     
};
module.exports = { CalculateDailyProfit };
