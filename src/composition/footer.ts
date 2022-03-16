import {reactive, ref} from "vue";
const BSCSCAN = "/assets/featured/2_bscscan.png";
const CMC = "/assets/featured/3_cmc.png";
const COINGECKO = "/assets/featured/4_coingecko.png";
const CERTIK = "/assets/featured/certik.png";
const INTERFI = "/assets/featured/interfi.png";

export function footer() {
    return {
        footer: reactive({
            instructions: ref([
                {
                    label: "1. Connect your wallet",
                },
                {
                    label: "2. Wrap your MELD",
                },
                {
                    label: "3. Start earning",
                },
            ]),
            info: ref([
                {
                    label: "Support",
                    url: "mailto:support@melodity.org",
                },
            ]),
            docs: ref([
                {
                    label: "Presentation",
                    url: "https://docsend.com/view/e9knzicbry3ncaca",
                },
                {
                    label: "Whitepaper",
                    url: "https://docsend.com/view/fpxvfwmhtnq38gi6",
                },
                {
                    label: "Documentation",
                    url: "https://docs.melodity.org/",
                },
            ]),
            social: ref([
                {
                    label: "Telegram",
                    url: "https://t.me/Melodity_Official_Community",
                },
                {
                    label: "Twitter",
                    url: "https://twitter.com/meloditytoken",
                },
                {
                    label: "CoinMarketCap",
                    url: "https://coinmarketcap.com/currencies/melodity/",
                },
            ]),
            links: ref([
                {
                    label: "ArmonyArt",
                    url: "#",
                },
                {
                    label: "Melodity",
                    url: "https://melodity.org/",
                },
                {
                    label: "Do inc.",
                    url: "https://do-inc.co/",
                },
            ]),
        }),
        featuredIcons: ref([
            {
                pic: BSCSCAN,
                url: "https://bscscan.com/address/0x13E971De9181eeF7A4aEAEAA67552A6a4cc54f43",
                alt: "Melodity (MELD) rating bscscan",
                bullet: false
            },
            {
                pic: CMC,
                url: "https://coinmarketcap.com/currencies/melodity/",
                alt: "Melodity (MELD) rating cmc",
                bullet: false
            },
            {
                pic: COINGECKO,
                url: "https://www.coingecko.com/en/coins/melodity",
                alt: "Melodity (MELD) rating coingecko",
                bullet: false
            },
            {
                pic: CERTIK,
                desc: "Audit",
                url: "https://www.certik.com/projects/melodity",
                alt: "certik",
                bullet: false,
            },
            {
                pic: INTERFI,
                url: "https://github.com/interfinetwork/project-kyc-verification/blob/main/Melodity_KYCCertificate_InterFi.pdf",
                desc: "KYC",
                alt: "interfi",
                bullet: false,
            },
        ])
    }
}
