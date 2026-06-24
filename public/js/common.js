const API_BASE = '/api';

const storage = {
  getToken() {
    return localStorage.getItem('token');
  },
  setToken(token) {
    localStorage.setItem('token', token);
  },
  removeToken() {
    localStorage.removeItem('token');
  },
  getUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },
  setUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
  },
  removeUser() {
    localStorage.removeItem('user');
  },
  clear() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

const toast = (message, type = 'info', duration = 2000) => {
  let toastEl = document.querySelector('.toast');
  if (!toastEl) {
    toastEl = document.createElement('div');
    toastEl.className = 'toast';
    document.body.appendChild(toastEl);
  }

  toastEl.className = `toast ${type}`;
  toastEl.textContent = message;
  
  setTimeout(() => {
    toastEl.classList.add('show');
  }, 10);

  setTimeout(() => {
    toastEl.classList.remove('show');
  }, duration);
};

const request = async (url, options = {}) => {
  const token = storage.getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(API_BASE + url, {
      ...options,
      headers
    });

    const data = await response.json();

    if (data.code === 401) {
      storage.clear();
      if (!window.location.pathname.includes('/login.html') && 
          !window.location.pathname.includes('/register.html')) {
        toast('请先登录', 'error');
        setTimeout(() => {
          window.location.href = '/login.html';
        }, 1000);
      }
      return null;
    }

    if (data.code !== 200) {
      toast(data.message || '请求失败', 'error');
      return null;
    }

    return data.data;
  } catch (error) {
    console.error('请求错误:', error);
    toast('网络错误，请稍后重试', 'error');
    return null;
  }
};

const formatMoney = (amount) => {
  return Number(amount).toFixed(2);
};

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

const getOrderStatusText = (status) => {
  const statusMap = {
    0: '待支付',
    1: '已支付',
    2: '已发货',
    3: '已完成',
    4: '已取消'
  };
  return statusMap[status] || '未知';
};

const getOrderStatusClass = (status) => {
  const classMap = {
    0: 'pending',
    1: 'paid',
    2: 'shipped',
    3: 'completed',
    4: 'cancelled'
  };
  return classMap[status] || '';
};

const checkAuth = () => {
  const token = storage.getToken();
  if (!token) {
    window.location.href = '/login.html';
    return false;
  }
  return true;
};

const logout = () => {
  storage.clear();
  toast('已退出登录', 'success');
  setTimeout(() => {
    window.location.href = '/login.html';
  }, 500);
};
