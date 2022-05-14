/* 
本地存储token
*/
export const setItem = (key, value) => {
  //localstorage只能对字符串进行存储
  //value使用typeof运算，如果是对象或者数组，则会返回字符串object
  if (typeof value == "object") {
    value = JSON.stringify(value);
  }
  localStorage.setItem(key, value);
};

/* 
获取token
*/
export const getItem = (key) => {
  //判断它是否为json格式的字符串
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch (error) {
    return localStorage.getItem(key);
  }
};
/* 
删除token
*/
export const removeItem = (key) => {
  localStorage.removeItem(key);
};
