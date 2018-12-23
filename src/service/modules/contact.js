import fetchWrap from '../../util/fetch';

export const submitContactForm = payload => {
  return fetchWrap({
    url: '/user-report/submit',
    method: 'POST',
    body: payload,
  });
};
