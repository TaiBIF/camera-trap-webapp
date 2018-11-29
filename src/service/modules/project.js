import fetchWrap from '../../util/fetch';
import moment from 'moment';

const getProjects = async () => {
  const res = await fetchWrap({
    url: '/project/related-to-me',
    method: 'POST',
    body: { userId: localStorage.getItem('userId') },
  });

  return res.ret.map(val => val.project_metadata);
};

const createProject = async payload => {
  console.log(payload);
  const { form, licenseForm } = payload;
  await fetchWrap({
    url: '/project/init',
    method: 'POST',
    body: {
      projectTitle: form.name,
      userId: localStorage.getItem('userId'),
    },
  });
  await fetchWrap({
    url: '/project/bulk-insert',
    method: 'POST',
    body: [
      {
        projectTitle: form.name,
        shortTitle: form.slot,
        funder: form.agency,
        adminProjectId: form.adminProjectId,
        principalInvestigator: form.principalInvestigator,
        projectStartDate: moment(form.startAt).format('YYYY-MM-DD'),
        projectEndDate: moment(form.endAt).format('YYYY-MM-DD'),
        adminArea: form.area,
        abstract: form.description,
        remarks: form.comment,
        license: {
          metadata: licenseForm.forData,
          data: licenseForm.forInfo,
          multimedia: licenseForm.forImg,
        },
        dataPublicDate: moment(form.publicAt).format('YYYY-MM-DD'),
      },
    ],
  });
};

const getSpeciesGroup = async payload => {
  const res = await fetchWrap({
    url: '/project/image-species-group',
    method: 'POST',
    body: { projectId: payload },
  });

  return res.ret.length > 0 ? res.ret[0] : null;
};

const getLocationIdentifiedStatus = async payload => {
  const res = await fetchWrap({
    url: '/project/location-month-identified-num',
    method: 'POST',
    body: payload,
  });

  return res.ret;
};

const getLocationRetrievedStatus = async payload => {
  const res = await fetchWrap({
    url: '/project/location-month-retrieved-num',
    method: 'POST',
    body: payload,
  });

  return res.ret;
};

const getLocationAbnormalStatus = async payload => {
  const res = await fetchWrap({
    url: '/project/location-month-abnormal',
    method: 'POST',
    body: payload,
  });

  return res.ret;
};

const getDataFields = async payload => {
  const res = await fetchWrap({
    url: '/project/data-fields',
    method: 'POST',
    body: payload,
  });

  return res.ret[0];
};

const editProject = async payload => {
  const {
    _id,
    projectTitle,
    shortTitle,
    funder,
    adminProjectId,
    principalInvestigator,
    projectStartDate,
    projectEndDate,
    adminArea,
    abstract,
    remarks,
  } = payload;
  await fetchWrap({
    url: '/project/bulk-update',
    method: 'POST',
    body: [
      {
        _id,
        projectTitle,
        $set: {
          shortTitle,
          funder,
          adminProjectId,
          principalInvestigator,
          projectStartDate: moment(projectStartDate).format('YYYY-MM-DD'),
          projectEndDate: moment(projectEndDate).format('YYYY-MM-DD'),
          adminArea,
          abstract,
          remarks,
        },
      },
    ],
  });
};

export {
  getProjects,
  createProject,
  getSpeciesGroup,
  getLocationIdentifiedStatus,
  getLocationRetrievedStatus,
  getLocationAbnormalStatus,
  getDataFields,
  editProject,
};
