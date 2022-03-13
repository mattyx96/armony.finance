import {reactive, ref} from "vue";

export function home() {
    return {
        home: reactive({
            how_armony_works: ref([
                reactive({
                    title: "1. Connect",
                    body: "On Armony platform, customers can view their combined trading balance as well as the interest they’ve earned."
                }),
                reactive({
                    title: "2. Warp your $MELD",
                    body: "Armony vwho are vetted through a risk management framework that reviews our partners’ collateralization management process. "
                }),
                reactive({
                    title: "3. Start Earning",
                    body: "Armony will continue to add high-quality partners in order to ensure competitive rates and allow users to diversify borrowers."
                }),
            ])
        })
    }
}
