import { showWarning } from './Toaster';
import api from '../api/client';
// import querystring from 'querystring';
export const Post = async (url, data) => {
  try {
    const payload = querystring.stringify(data);
    const response = await api.post(url, payload);
    if (response.status === 200) {
      return response.data;
    } else {
      console.error('Error  xxxxx respo1ddddddddddddddd:', response);
      return response;
    }
  } catch (err) {
    console.log('err', err);
    showWarning(err.message || 'Something went wrong');
  }
};
export const Get = async (url) => {
  try {
    const response = await api.get(url);
    if (response.status === 200) {
      return response.data;
    } else {
      console.error('Error  xxxxx respo1ddddddddddddddd:', response);
      return response;
    }
  } catch (err) {
    console.log('err', err.message);
    throw err;
  }
};

// const Post2 = async (url, data) => {
//   const user = await AsyncStorage.getItem('userDetail');
//   let userDetail = JSON.parse(user);
//   const response = await axios.post(url, data, {
//     headers: {
//       'Content-Type': 'application/x-www-form-urlencoded',
//       Accept: '*/*',
//       Authorization: `Bearer ${userDetail?.token || ''}`,
//     },
//   });

//   if (response.status === 200) {
//     return response.data;
//   } else {
//     console.error('Error response:', response);
//     return response;
//   }
// };
// GetApi function for fetching data from the server
// const GetApi = async url => {
//   const user = await AsyncStorage.getItem('userDetail');
//   const token = JSON.parse(user)?.token;
//   console.log(token,'token')
//   return axios
//     .get(
//       Constant.baseUrl + url,
//       {},
//       {
//         headers: {
//           Authorization: `Bearer ${token || ''}`,
//         },
//       },
//     )
//     .then(res => {
//       return res.data;
//     })
//     .catch(err => {
//       console.log('err to h ', err.response);
//       return err;
//     });
// };

// export { Post, Post2 };
