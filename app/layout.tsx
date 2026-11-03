import type {Metadata} from 'next';
export const metadata:Metadata={title:'萌兽渔港 · 联网版',description:'与动物船队一起经营渔场，保存航程、挑战渔获峰值并拜访其他船长的水族馆。'};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="zh-CN"><body>{children}</body></html>;}
