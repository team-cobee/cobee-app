// export enum Snoring {
//     Snore = 'SNORE',
//     NoSnore = 'NO_SNORE',
//     Impossible = 'IMPOSSIBLE',
//     None = 'NONE'
// }

// export enum Smoking {
//     Smoke = 'SMOKE',
//     NotSmoke = 'NOT_SMOKE',
//     Impossible = 'IMPOSSIBLE',
//     None = 'NONE'
// }
// types/enums.ts 파일에서
  export enum Smoking {
    Impossible = "IMPOSSIBLE",  // 기존: NotSmoke
    None = "NONE"               // 기존: Smoke  
  }

  export enum Snoring {
    Impossible = "IMPOSSIBLE",  // 기존: NoSnore
    None = "NONE"               // 기존: Snore
  }

  export enum Pets {
    Possible = "POSSIBLE",      // 기존: Have
    Impossible = "IMPOSSIBLE",  // 기존: NotHave  
    None = "NONE"               // 새로 추가
  }

export enum Gender {
  Male = "MALE",
  Female = "FEMALE",
  None = "NONE",
}

export enum Lifestyle {
  Morning = "MORNING",
  Evening = "NIGHT",
  None = "NONE"
}

export enum Personality {
  Introvert = 'INTROVERT',
  Extrovert = 'EXTROVERT',
  None = 'NONE'
}

// export enum Pets {
//   Have = 'HAVE',
//   NotHave = 'NOT_HAVE',
//   Possible = 'POSSIBLE',
//   Impossible = 'IMPOSSIBLE',
//   None = 'NONE'
// }

export enum MatchStatus {
  OnWait = 'ON_WAIT',
  Matching = 'MATCHING',
  Matched = 'MATCHED',
  Rejected = 'REJECTED',
}

export enum RecruitStatus {
    Recruiting = 'RECRUITING',
    OnContact = 'ON_CONTACT',
    RecruitOver = 'RECRUIT_OVER'
}

export enum SocialType {
    Kakao = 'KAKAO',
    Google = 'GOOGLE'
}

export enum MessageType {
    Text = 'TEXT', 
    Image = 'IMAGE'
}

export enum AlarmType {
    Comment = 'COMMENT',
    Chat = 'CHAT',
    ChatInvited = 'INVITED',
    NewApply = 'NEW_APPLY',
    StartMatching = 'START_MATCHING',
    MatchComplete = 'MATCH_COMPLETE'
}

