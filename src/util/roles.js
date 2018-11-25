const managerRoles = ['ProjectManager', 'SysAdmin']; // TODO: adjust after define roles for manager

/**
 *  check project roles include manager or not
 * @param {array} roles
 * @return {bool}
 */
export const isRolesManager = roles => {
  if (!roles || roles.length === 0) {
    return false;
  }

  return roles.some(userRole => managerRoles.includes(userRole));
};
