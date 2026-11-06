/** 부호는 본문처럼 유니코드 마이너스로 씁니다. */
export const fmt = (value: number) => `${value < 0 ? "−" : ""}${Math.abs(value)}`;
