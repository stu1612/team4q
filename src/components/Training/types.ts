// interim — replace with graphql-codegen output in Phase 2 (see /graphql skill)

export interface CoachRD {
  name: string;
  photo: ImageMetadata | string | null;
}

export interface TrainingTeamRD {
  name: string;
  slug: string;
}

export interface TrainingRD {
  venue: string;
  date: string;
  startTime: string;
  endTime: string;
  trainingType: string;
  coach: CoachRD;
  team: TrainingTeamRD;
  information: string;
}
