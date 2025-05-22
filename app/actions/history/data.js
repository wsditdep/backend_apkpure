"use server";

import { connectToDB } from "@/utils/connection";
import { User } from "@/modals/User";
import { JourneyHistory } from "@/modals/JourneyHistory";

export const fetchDealingHistory = async (q, sortByType) => {

    try {
        await connectToDB();
        let history;
        if (sortByType === "") {
            sortByType = "all"
        }

        const relatedUser = await User.findById(q);
        const histories = await JourneyHistory?.findById(relatedUser?.journeyHistory);
        history = histories?.JourneyHistory?.reverse();

        if (relatedUser?.journeyHistory === null) {
            history = [];
        }

        if (sortByType === "all") {
            return { history };
        } else if (sortByType === "ticket") {
            history = history?.filter((data) => data?.isJourneyProduct);
        } else {
            history = history?.filter((data) => !data?.isJourneyProduct);
        }

        return { history };
    } catch (error) {
        console.log(error)
    }
}