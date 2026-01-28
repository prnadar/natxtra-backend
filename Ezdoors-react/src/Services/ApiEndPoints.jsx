// ReviewNotes:-P2- Rename STATIC_FIELDS to SYSTEM_MASTER

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/web/user/login",
    SIGNUP: `/web/user/register`,
    FORGOT_PASSWORD_EMAIL: `/web/user/forgot-password`,
    PROFILE: "/web/user/profile",
    CHANGE_PASSWORD: "/web/user/change-password",
    GET_ADDRESS: "/web/api/get_userBillingAddress",
    ADD_ADDRESS: "/web/api/add-userBillingAddress",
    UPDATE_ADDRESS: "/web/api/update-userBillingAddress",
    DELETE_ADDRESS: (id) => `/web/api/delete-userBillingAddress?id=${id}`,
    CONTACT_US: `/web/api/contactus`,
    WEB_DATA: `/web/api/get_webSettings_data`,
    GET_PRODUCT: `/web/api/get_all_products`,
    GET_CATEGORY: `/web/api/get_categories`,
    GET_PRODUCT_BY_CATEGORY: (id) => `/web/api/products_by_category?_id=${id}`,
    GALLERY_CATEGORY: `/web/api/get_gallery_categories`,
    GET_GALLERY: `/web/api/get_gallery`,
    GET_GALLERY_BY_CATEGORY: (id) =>
      `/web/api/get_gallery_by_category?_id=${id}`,
    GET_FAQ: `/web/api/get_all_faqs`,
    GET_ALL_STORES: `/web/api/get_all_stores`,
    CREATE_ORDER: `/web/user/create-order`,
    DEFAULT_BILLING_ADDRESS: (id) =>
      `web/api/make_default-userBillingAddress?id=${id}`,
    GET_DEFAULT_BILLING_ADDRESS: `/web/api/get_default-userBillingAddress`,
    ORDER_NOW: `/web/user/payment-checkout`,
    RESET_PASSWORD: `/web/user/reset-password`,
    GET_DASHBOARD_SLIDER: `/web/api/get_sliders`,
    GET_BANNER: `/web/api/get_banners`,
    GET_ORDER_HISTORY: `/web/api/get_orderItems`,
  },
};
