
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
}

export default UserManager




