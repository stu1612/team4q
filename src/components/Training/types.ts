// interim — replace RD with graphql-codegen output in the codegen task (see /graphql skill)
// The mapper is still a stub; VM shape here is provisional and may expand in Phase 4.

// Hygraph Asset selection shape. Interim union with ImageMetadata — see Hero/types.ts.
export interface AssetRD {
  url: string;
  width: number | null;
  height: number | null;
}

export type IsActive = "active" | "inactive";
export type TrainingType = "team" | "individual";

// TrainingModel.clubMemberModels (the coaches relation) — a list, 0-to-many. Standalone
// ClubMemberModel, all fields nullable. Separate RD/VM per usage per /data-mapping — this
// is the coach usage.
export interface CoachRD {
  name: string | null;
  role: string | null;
  profileImage: AssetRD | ImageMetadata | null;
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
  trainingType: TrainingType;
  isActive: IsActive;
  information: string | null;
  teamModel: TrainingTeamRD | null;
  clubMemberModels: CoachRD[];
}

export interface CoachVM {
  name: string;
  role: string;
  hasCoachPhoto: boolean;
  // Narrowed to ImageMetadata for the interim — see Hero/types.ts.
  photo: ImageMetadata | null;
}

export interface TrainingVM {
  venue: string;
  date: string;
  startTime: string;
  endTime: string;
  trainingTypeLabel: string;
  information: string;
  hasTeam: boolean;
  teamLabel: string;
  hasCoaches: boolean;
  coaches: CoachVM[];
}
