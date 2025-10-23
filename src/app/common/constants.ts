export class Constants {
     public static HOST = 'http://localhost:8080/api';
}

export class CustomerApi {
     
     public static GET_CUSTOMER_LIST = '/customer/get/{pageNo}/{pageSize}';
     public static GET_CUSTOMER_BY_ID = '/customer/{id}';
     public static GET_CUSTOMER_SEARCH = '/customer/search/{pageNo}/{pageSize}';
     public static CREATE_CUSTOMER = '/customer';
     public static GET_NEW_ACCOUNT_NUMBER = '/customer/new-account-number';
     public static UPDATE_CUSTOMER = '/customer';

     public static GET_METER_BY_CUSTOMER_ID = '/customer/meter';
     public static GET_METER_BY_METER_NO = '/customer/meter/{meterNo}';
     public static UPDATE_METER_NO = '/customer/meter/single-update';
     public static CREATE_METER_NO = '/customer/meter';
     
}

export class BillingApi {
     public static GET_ACTIVE_WATER_RATES_RESIDENTIAL = '/billing/rates/residential/active';
     public static GET_ACTIVE_WATER_RATES_COMMERCIAL = '/billing/rates/commercial/active';
     public static CREATE_BILLING = '/billing';
     public static UPDATE_BILLING = '/billing';
     public static GET_BILLING_BY_ID = '/billing/id/{billingId}';
     public static GET_BILLING = '/billing/{pageNo}/{pageSize}';
     public static GET_BILLING_BY_CUSTOMER_ID = '/billing/customer/{customerId}/{pageNo}/{pageSize}';
     public static GET_NEW_READING_NUMBER = '/billing/new-reading-number';
     public static GET_RECENT_BILLING_BY_CUSTOMER_ID = '/billing/get-recent-billings';
     public static GET_UNPAID_BILLING_BY_CUSTOMER_ID = '/billing/get-unpaid-bills';
}

export class PaymentApi {
     public static GET_OR_ALL_PAYMENTS = '/payment/official-receipt/{pageNo}/{pageSize}';
     public static GET_OR_ALL_PAYMENTS_BY_CUSTOMER_ID = '/payment/customer/{customerId}/{pageNo}/{pageSize}';
     public static GENERATE_OR_NUMBER = '/payment/official-receipt/new-or-number';
     public static CREATE_OR_PAYMENT = '/payment/official-receipt';
     public static GET_OR_ALL_PAYMENTS_WITH_CUSTOMER_INFO = '/payment/official-receipt/with-cust-info/{pageNo}/{pageSize}';
     public static GET_OR_ALL_PAYMENTS_WITH_CUSTOMER_INFO_BY_ID = '/payment/official-receipt/with-cust-info/{id}';
     public static GET_OR_ALL_WITH_SEARCH = '/payment/official-receipt/search/{pageNo}/{pageSize}';

     //Others
     public static CREATE_OTHER_PAYMENT = '/payment/others';
     public static GET_ALL_OTHER_PAYMENTS = '/payment/others/{pageNo}/{pageSize}';
     public static GET_ALL_OTHER_PAYMENTS_WITH_CUSTOMER_INFO = '/payment/others/with-cust-info/{pageNo}/{pageSize}';
     public static GET_ALL_OTHER_PAYMENTS_BY_CUSTOMER_ID = '/payment/others/customer/{customerId}/{pageNo}/{pageSize}';
     public static GET_ALL_OTHER_PAYMENTS_WITH_CUSTOMER_INFO_BY_ID = '/payment/others/with-cust-info/{id}';
     public static GET_ALL_OTHER_PAYMENTS_WITH_SEARCH = '/payment/others/search/{pageNo}/{pageSize}';
     
     //Generics
     public static UPDATE_STATUS = '/payment/official-receipt/update-status';
     public static DELETE_RECORD = '/payment/official-receipt/{id}';
     
}

export class AuthApi {
     public static LOGIN = '/auth/login';
}

export class UserApi {
     public static GET_USERNAME = '/user/username/{id}';
}

export class SeptageFeeApi {
     public static GET_SEPTAGE_FEES = '/billing/septage-fee/rates';
     public static UPDATE_SEPTAGE_FEES = '/billing/septage-fee/rates';
}

export class PartsApi {
     public static GET_PARTS_LIST = '/settings/part/list-all';
     public static GET_PARTS_ALL = '/settings/part/{pageNo}/{pageSize}';
     public static CREATE_PARTS = '/settings/part';
     public static GET_PARTS_BY_ID = '/settings/part/{id}';
     public static UPDATE_PARTS = '/settings/part';
}