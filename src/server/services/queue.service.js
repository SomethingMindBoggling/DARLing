const Agenda = require('agenda');

require('dotenv').config();
const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASS;

export class QueueService {
  constructor() {
    this.agenda = new Agenda({ db: {
      address: `mongodb://${dbUser}:${dbPass}@ds151651.mlab.com:51651/dar-tool`,
      collection: 'agendaJobs',
    } });
    this.agenda.start();
  }

  addJob(jobName, job) {
    this.agenda.define(jobName, job);
    this.agenda.now(jobName);
  }
  stop() {
    this.agenda.stop();
  }
}
