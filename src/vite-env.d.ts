/// <reference types="vite/client" />

// 지원하는 언어
type langs = 'ko' | 'en';


// 이징 프리셋 관련
// 이징 종류
type TEasingType = 'linear' | 'bezier' | 'constant';
// 이징 프리셋 타입
type IEasingPreset =
    // 베지어 프리셋
    | {
        name: string;
        type: 'bezier';
        points: {
            x: number;
            y: number;
        }
    }
    // bezier가 아닌 프리셋
    | {
        name: string;
        type: Exclude<TEasingType, 'bezier'>;
        points?: never
    };