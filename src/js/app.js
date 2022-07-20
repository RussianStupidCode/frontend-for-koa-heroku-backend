import moment from 'moment';
import CRM from './crm/crm';

moment.locale('ru');

const crm = new CRM();
crm.bindToDOM(document.querySelector('.field'));
