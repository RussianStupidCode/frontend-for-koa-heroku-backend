const URL = 'https://koa-backend.herokuapp.com';
// const URL = 'http://localhost:7070';

export function all() {
  return fetch(`${URL}/allTickets`);
}

export function get(id) {
  return fetch(`${URL}/ticketById/${id}`);
}

export function remove(id) {
  return fetch(`${URL}/ticketById/${id}`, { method: 'DELETE' });
}

export function update({
  id,
  title = undefined,
  description = undefined,
  status = undefined,
}) {
  const body = {};

  if (title) {
    body.name = title;
  }

  if (description) {
    body.description = description;
  }

  if (status) {
    body.status = status;
  }

  return fetch(`${URL}/ticketById/${id}`, {
    method: 'PUT',
    body: JSON.stringify(body),
    headers: {
      'content-type': 'application/json',
    },
  });
}

export function create({ title, description, status }) {
  const body = {
    name: title,
    description,
    status,
  };

  return fetch(`${URL}/createTicket`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'content-type': 'application/json',
    },
  });
}
