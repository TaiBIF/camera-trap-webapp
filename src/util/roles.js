/**
 * https://github.com/TaiBIF/camera-trap-api/wiki/role-permission
 * // 計畫相關角色 (允許在 3.6.1.1 加入)
 * ProjectManager 計畫管理員（初始權限等同研究人員）
 * Researcher 研究人員（初始權限等同計畫管理員）
 * ResearchAssistant 研究助理
 * CaseOfficer 林管處承辦人
 *
 * // 機能型角色 (不允許在 3.6.1.1 加入，不在選單中列出)
 * SysAdmin 系統管理員
 * ProjectInitiator 可建立新計畫的人, 同計畫管理員
 */

const systemManagerRoles = ['SysAdmin'];
const projectManagerRoles = [
  'ProjectInitiator',
  'ProjectManager',
  'Researcher',
];

/**
 * @param {string} role
 * @return {bool}
 */
export const isAllowManageProject = role => {
  if (!role) {
    return false;
  }

  return (
    systemManagerRoles.includes(role) || projectManagerRoles.includes(role)
  );
};

/**
 * @param {string} role
 * @return {bool}
 */
export const isAllowAddColumns = role => {
  if (!role || role === '') {
    return false;
  }

  return projectManagerRoles.includes(role);
};
