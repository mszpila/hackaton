import wretch from 'wretch';

export const apiClient = (token: string | null) => {
  if (token) {
    return wretch()
      .headers({ 'x-token': token })
      .url(process.env.REACT_APP_SERVER_URL!);
  }

  return wretch().url(process.env.REACT_APP_SERVER_URL!);
};
