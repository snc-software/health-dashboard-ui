export interface DailyHealthStat {
  date: string;
  steps: number | null;
  restingHeartRate: number | null;
  sleepSeconds: number | null;
  sleepScore: number | null;
  peakBodyBattery: number | null;
  hrvLastNightAverage: number | null;
  hrvStatus: string | null;
  trainingReadinessScore: number | null;
  trainingStatus: string | null;
  vo2Max: number | null;
  fitnessAge: number | null;
  weightGrams: number | null;
  intensityMinutes: number | null;
  updatedTimestamp: string;
}
