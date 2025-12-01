
export type EnergyLevel = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export interface ActivityFeed {
  id : string;
  level: EnergyLevel;
  title: string;
  description: string;
  count : number;
  goodPoint?: string; //활동의 장점
  insight?: string; //활동의 인사이트
  durationMinutes?: string; //활동에 필요한 소요시간
}