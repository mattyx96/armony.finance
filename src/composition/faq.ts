import {reactive, ref} from "vue";

export function faq() {
    return {
        faq: ref(
            [
                reactive({
                    label: "Why should artists join Melodity?",
                    url: "https://docs.melodity.org/faq/generalities#why-should-artists-join-melodity",
                }),
                reactive({
                    label: "How can I buy MELD?",
                    url: "https://docs.melodity.org/faq/generalities#how-can-i-buy-meld",
                }),
                /*reactive({
                    label: "When will be the Melodity ICO?",
                    url: "https://docs.melodity.org/faq/generalities#how-can-i-buy-meld",
                }),*/
                reactive({
                    label: "What are locks?",
                    url: "https://docs.melodity.org/faq/lock-explanation#what-are-locks",
                }),
                reactive({
                    label: "Which are the lock times?",
                    url: "https://docs.melodity.org/faq/lock-explanation#which-are-the-lock-times",
                }),
                reactive({
                    label: "Where can i find my locks?",
                    url: "https://docs.melodity.org/faq/lock-explanation#where-can-i-find-my-current-locks",
                }),
            ]
        )
    }
}
