export const CONFIG: any = {
  SERVER_URL: 'http://localhost:8000/api/v1',
  DATE_FORMAT: 'YYYY-MM-DD',
  DATETIME_FORMAT: 'YYYY-MM-DD HH:MM:SS',

  endpoints: {
    login: '/api/login_check',
    logout: '/api/logout',
    tokenRefresh: '/api/token/refresh',
    onboardCustomer: '/api/onboard-customer',

    addToCategory: '/api/categories',
    getCategory: '/api/categories',

    startJourney: '/Login',
    saveAddress: '/DeliveryAddress',
    getAddress: '/DeliveryAddress',
  },
  messages: {
    http_error: 'Unknown error. Please try again later.',
    error_upload_image_file_size: 'Please select image of size smaller than 2MB.',
    error_upload_image_file_select: 'Please select image/photo.',
    error_upload_image_file_type: 'Please select valid image of type JPG, PNG only.',
    error_unable_to_select: 'Unable to select image/photo.',
  },
};
