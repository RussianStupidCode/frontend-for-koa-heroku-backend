import moment from 'moment';

export function titleValidate(title) {
  const refineTitle = title.trim();

  const result = {
    errorMessage: '',
    isValid: true,
  };

  if (refineTitle.length === 0) {
    result.isValid = false;
    result.errorMessage = 'Пустая строка';
  }

  return result;
}

export function dateFormat(timeStamp) {
  return moment.unix(timeStamp).format('YYYY-MM-DD HH:mm:ss');
}
