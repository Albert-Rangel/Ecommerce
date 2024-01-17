
import { logger } from '../../utils/logger.js';
import userRepositories from '../../repositories/userRepositories.js';

const UserRepositories = new userRepositories()

class UserManager {
  async changeRol(uid) {
    return await UserRepositories.changeRol(uid)
  }
  async verifyUserDocumentation(uid) {
    return await UserRepositories.verifyUserDocumentation(uid);
  }
  async uploadFile(uid) {
    return await UserRepositories.uploadFile(uid);
  }
  async obtainusers() {
    return await UserRepositories.obtainusers();
  }

  async obtainuser(uid) {
    return await UserRepositories.obtainuser(uid);
  }
  async deleteUser(uid) {
    return await UserRepositories.deleteUser(uid);
  }

   async deleteUsersLateConn() {
    return await UserRepositories.deleteUsersLateConn();
  }

  async updatelastConnection(uid) {
    return await UserRepositories.updatelastConnection(uid);
  }
  
}

export default UserManager




