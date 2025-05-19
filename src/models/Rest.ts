export interface RestData {
  durationSeconds: number;
  type: 'rest';
}

export class Rest {
  durationSeconds: number;
  type: 'rest';

  constructor(raw: RestData) {
    this.durationSeconds = raw.durationSeconds;
    this.type = raw.type;
  }
}
