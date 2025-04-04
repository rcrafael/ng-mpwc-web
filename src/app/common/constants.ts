export class Constants {
     public static HOST = 'http://localhost:8080/';
}

export class CustomerApi {
     
     public static GET_CUSTOMER_LIST = 'api/customer/get/{pageNo}/{pageSize}';
     public static GET_CUSTOMER_BY_ID = 'api/customer/{id}';
     public static CREATE_CUSTOMER = 'api/customer';
     public static GET_NEW_ACCOUNT_NUMBER = 'api/customer/new-account-number';

     public static GET_METER_BY_CUSTOMER_ID = 'api/customer/meter';
     public static GET_METER_BY_METER_NO = 'api/customer/meter/{meterNo}';
     public static UPDATE_METER_NO = 'api/customer/meter/single-update';
     public static CREATE_METER_NO = 'api/customer/meter';
}

export class BillingApi {
     public static GET_ACTIVE_WATER_RATES_RESIDENTIAL = 'api/billing/rates/residential/active';
     public static GET_ACTIVE_WATER_RATES_COMMERCIAL = 'api/billing/rates/commercial/active';
     public static CREATE_BILLING = 'api/billing';
     public static GET_BILLING_BY_ID = 'api/billing/id/{billingId}';
     public static GET_BILLING = 'api/billing/{pageNo}/{pageSize}';
     public static GET_BILLING_BY_CUSTOMER_ID = 'api/billing/customer/{customerId}/{pageNo}/{pageSize}';
     public static GET_NEW_READING_NUMBER = 'api/billing/new-reading-number';
     public static GET_RECENT_BILLING_BY_CUSTOMER_ID = 'api/billing/get-recent-billings';
     public static GET_UNPAID_BILLING_BY_CUSTOMER_ID = 'api/billing/get-unpaid-bills';
}

export class PaymentApi {
     public static GET_OR_ALL_PAYMENTS = 'api/payment/official-receipt/{pageNo}/{pageSize}';
     public static GET_OR_ALL_PAYMENTS_BY_CUSTOMER_ID = 'api/payment/customer/{customerId}/{pageNo}/{pageSize}';
     public static GENERATE_OR_NUMBER = 'api/payment/official-receipt/new-or-number';
     public static CREATE_OR_PAYMENT = 'api/payment/official-receipt';
     public static GET_OR_ALL_PAYMENTS_WITH_CUSTOMER_INFO = 'api/payment/official-receipt/with-cust-info/{pageNo}/{pageSize}';
     public static GET_OR_ALL_PAYMENTS_WITH_CUSTOMER_INFO_BY_ID = 'api/payment/official-receipt/with-cust-info/{id}';
}

export class AuthApi {
     public static LOGIN = 'api/auth/login';
}