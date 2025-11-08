import instance from './axios';

export const getMessages = async () => {
  const response = await instance.get('/api/messages/');
  return response.data;
};

export const sendMessage = async (text) => {
  const response = await instance.post('/api/messages/', { text });
  return response.data;
};

export const getOnlineCount = async () => {
  const response = await instance.get('/api/online/');
  return response.data;
};
