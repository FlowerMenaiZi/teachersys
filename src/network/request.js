
/** 接口调用工具*/

import axios from 'axios'
var root = 'http://119.29.185.52:9001'
axios.defaults.headers.post['content-Type'] = 'application/json;charset=UTF-8';

// 自定义判断元素类型JS
function toType(obj) {
  return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
}

/** 参数过滤函数*/
function filterNull(o) {
  for (var key in o) {
    if (o[key] === null) {
      delete o[key]
    }
    if (toType(o[key]) === 'string') {
      o[key] = o[key].trim()
    } else if (toType(o[key]) === 'object') {
      o[key] = filterNull(o[key])
    } else if (toType(o[key]) === 'array') {
      o[key] = filterNull(o[key])
    }
  }
  return o
}

/**添加headers,可以动态添加header参数*/
function setHeaders(headers) {
  axios.defaults.headers.school_id = headers.school_id;
  axios.defaults.headers.token = headers.token;
}


//其实success与failure这两个参数，传过来的是两个放方法
function apiAxios(method, url, headers, params, success, failure,root2=null) {
  // if (headers) {
  //   headers = filterNull(headers);
  //   setHeaders(headers)
  // }
  if (params) {
    params = filterNull(params)
  }
  axios({
    method: method,
    url: url,
    data: method === 'POST' || method === 'PUT' ? params : null,
    params: method === 'GET' || method === 'DELETE' ? params : null,
    baseURL: root2?root2:root,
    withCredentials: false
  })
    .then(function (res) {
        if (success) {
          //使用success(data)方法
          success(res)
        }
    })
    .catch(function (err) {
      let res = err.response
      if (err){
        failure(res)
      }
    })
}

// 返回在vue模板中的调用接口
export default {
  get: function (url, headers, params, success, failure,root2) {
    return apiAxios('GET',url, headers, params, success, failure,root2)
  },
  post: function (url, headers, params, success, failure,root2) {
    return apiAxios('POST', url, headers, params, success, failure,root2)
  },
  put: function (url, headers, params, success, failure,root2) {
    return apiAxios('PUT', url, headers, params, success, failure,root2)
  },
  delete: function (url, headers, params, success, failure,root2) {
    return apiAxios('DELETE', url, headers, params, success, failure,root2)
  }
}
