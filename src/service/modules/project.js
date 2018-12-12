import fetchWrap from '../../util/fetch';
import { uploadCoverImage } from '../../util/uploadToS3';
import moment from 'moment';

const getProjects = async () => {
  const res = await fetchWrap({
    url: '/project/related-to-me',
    method: 'POST',
    body: { userId: window.currentUser.userId },
  });

  return res.ret.map(val => ({
    ...val.project_metadata,
    members: val.members,
  }));
};

const createProject = async payload => {
  console.log(payload);
  const { form, licenseForm, file } = payload;
  const { ret } = await fetchWrap({
    url: '/project/init',
    method: 'POST',
    body: {
      projectTitle: form.name,
      userId: window.currentUser.userId,
    },
  });
  const { projectId } = ret;
  if (file) {
    const { key } = await uploadCoverImage({
      file,
      projectId,
    });
    form.cover = `https://s3-ap-northeast-1.amazonaws.com/camera-trap/${key}`;
  } else {
    form.cover =
      'https://s3-ap-northeast-1.amazonaws.com/camera-trap/cover_images/default_cover.png';
  }

  await fetchWrap({
    url: '/project/bulk-insert',
    method: 'POST',
    body: [
      {
        projectId,
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
        coverImage: form.cover,
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
    shortTitle,
    funder,
    adminProjectId,
    principalInvestigator,
    projectStartDate,
    projectEndDate,
    adminArea,
    abstract,
    remarks,
    coverImage,
  } = payload;
  await fetchWrap({
    url: '/project/bulk-update',
    method: 'POST',
    body: [
      {
        _id,
        projectId: _id,
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
          coverImage,
        },
      },
    ],
  });
};

const getProject = async payload => {
  const res = await fetchWrap({
    url: `/project/${payload}`,
  });

  return {
    _id: payload,
    ...res,
  };
};

const editCameraLocations = async payload => {
  await fetchWrap({
    url: '/project/bulk-update',
    method: 'POST',
    body: payload,
  });
};

const getColumnsField = async () => {
  return await fetchWrap({
    url: '/data-field-available',
    method: 'GET',
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
  getProject,
  editCameraLocations,
  getColumnsField,
};
