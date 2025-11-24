export const COLORS = {
    primary: {
        50: "#ECEFF9",
        100: "#D2D8F1",
        200: "#AFB9E6",
        300: "#8A98DA",
        400: "#6679CF",
        500: "#455CC5", // 지금 버튼 컬러
        600: "#3B4EA7",
        700: "#31418C",
        800: "#273470",
        900: "#1F2959",
    },
    secondary: {
        yellowDefault: "#F2EDBA",
        yellowHighlight: "#98935E",
        pinkDefault: "#F2BAE9",
        skyDefault: "#95E2EE",
        pinkHighlight: "#803773",
        redDefault: "#ED1515",
        timeHighlight: "#FFF34F",
    },
    gray: {
        50: "#FFFFFF",
        100: "#FCFCFC",
        200: "#F5F5F5",
        300: "#F0F0F0",
        400: "#D9D9D9",
        500: "#BFBFBF",
        600: "#8C8C8C",
        700: "#595959",
        800: "#454545",
        900: "#262626",
        1000: "#1F1F1F",
        1100: "#141414",
        1200: "#000000",
    }
} as const;

export type ColorPrimary = keyof typeof COLORS.primary;
export type ColorSecondary = keyof typeof COLORS.secondary;
export type ColorGray = keyof typeof COLORS.gray;



// 사용예시
// import type { ColorPrimary, ColorSecondary } from "@/styles/colors";
// import { COLORS } from "@/styles/colors";

// type MainBtnProps = {
//   color?: ColorPrimary | ColorSecondary;
//   onClick?: () => void;
//   children: React.ReactNode;
// };

// export default function MainBtn({
//   color = 500, // default: primary[500]
//   onClick,
//   children,
// }: MainBtnProps) {
//   const bg = 
//     typeof color === "number"
//       ? COLORS.primary[color]
//       : COLORS.secondary[color];

//   return (
//     <button
//       style={{
//         backgroundColor: bg,
//         color: COLORS.gray[50]
//       }}
//       onClick={onClick}
//     >
//       {children}
//     </button>
//   );
// }
