
export type EnergyLevel = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export interface ActivityFeed {

  level: EnergyLevel;
  isHearted: boolean;
  title: string;
  description: string;
  tags: string[];
  count : number;
  goodPoint?: string; //활동의 장점
  Insight?: string; //활동의 인사이트
  durationMinutes: number; //활동에 필요한 소요시간
}