import axios from 'axios';

export class AxiosInstance {
  protected api;
  constructor(_url, _config) {
    let defaultConfig = {
      baseURL: _url,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 0,
    };
    defaultConfig = Object.assign(defaultConfig, _config);
    this.api = axios.create(defaultConfig);
  }

  get(url, config = {}) {
    const defaultConfig = {
      ...config,
    };
    const request = this.api.get(url, defaultConfig).then(this.mapData).catch(this.mapError);
    return request;
  }

  post(url, body, config = {}) {
    const defaultConfig = {
      ...config,
    };
    const request = this.api.post(url, body, defaultConfig).then(this.mapData).catch(this.mapError);
    return request;
  }

  put(url, body, config = {}) {
    const defaultConfig = {
      ...config,
    };
    const request = this.api.put(url, body, defaultConfig).then(this.mapData).catch(this.mapError);
    return request;
  }

  patch(url, body, config = {}) {
    const defaultConfig = {
      ...config,
    };
    const request = this.api.patch(url, body, defaultConfig).then(this.mapData).catch(this.mapError);
    return request;
  }

  _delete(url, config = {}) {
    const defaultConfig = {
      ...config,
    };
    const request = this.api.delete(url, defaultConfig).then(this.mapData).catch(this.mapError);
    return request;
  }

  mapData(res) {
    return res.data;
  }

  mapError(err) {
    throw new Error(err.message || err + '');
  }
}
