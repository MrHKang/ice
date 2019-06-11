import * as EventEmitter from 'events';
import Client from './client';
import { IProject, IDEFModule } from '../../../interface';

const isDev = process.env.NODE_ENV === 'local';
const token = isDev
  ? 'f87bf958ad0ecb310b86b1536746b5209799902b1f556850f1a29f26a2375f28'
  : '72d7d45ac4495e9fb0047a96579a9af886e5c869f8ae148b68957c543d49ada1';
const env = isDev ? 'daily' : 'prod';

export default class DEF extends EventEmitter implements IDEFModule {
  public project: IProject;

  constructor(project: IProject) {
    super();
    this.project = project;
  }

  async push(params: { target: string; commitId: string; branch: string; repository: string; empId: string; }) {
    const { target, commitId, branch, repository, empId } = params;
    const client = new Client.Client();
    client.run({
      hideBuildMessage: true,
      // eslint-disable-next-line
      client_token: token,
      // eslint-disable-next-line
      client_emp_id: empId,
      target,
      repo: repository,
      branch,
      // eslint-disable-next-line
      commit_id: commitId,
      env,
    });

    client.on('start', () => {
      this.emit('push.start');
    });
    client.on('message', (message) => {
      this.emit('push.data', `${message}\n\r`);
    });
    client.on('build_message', (message) => {
      this.emit('push.data', message);
    });
    client.on('error', (error) => {
      this.emit('push.data', `\r\n${error.message}`);
      this.emit('push.exit', 1);
    });
    client.on('success', () => {
      this.emit('push.exit', 0);
    });
  }
}
