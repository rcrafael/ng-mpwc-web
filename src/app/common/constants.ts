export class Constants {
     public static HOST = 'https://api-gateway-a6z0.onrender.com/api';
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
     public static UPDATE_METER_STATUS = '/customer/meter/status-update';

}

export class BillingApi {
     public static CREATE_BILLING = '/billing';
     public static UPDATE_BILLING = '/billing';
     public static GET_BILLING_BY_ID = '/billing/id/{billingId}';
     public static GET_BILLING = '/billing/{pageNo}/{pageSize}';
     public static GET_BILLING_BY_CUSTOMER_ID = '/billing/customer/{customerId}/{pageNo}/{pageSize}';
     public static GET_NEW_READING_NUMBER = '/billing/new-reading-number';
     public static GET_RECENT_BILLING_BY_CUSTOMER_ID = '/billing/get-recent-billings';
     public static GET_UNPAID_BILLING_BY_CUSTOMER_ID = '/billing/get-unpaid-bills';
     public static GET_BILLING_SEARCH = '/billing/search/{pageNo}/{pageSize}';
     public static VOID_BILLING = '/billing/void/{id}';
     public static DELETE_BILLING = '/billing/{id}';
}

export class PaymentApi {
     public static GET_OR_ALL_PAYMENTS = '/payment/official-receipt/{pageNo}/{pageSize}';
     public static GET_OR_ALL_PAYMENTS_BY_CUSTOMER_ID = '/payment/customer/{customerId}/{pageNo}/{pageSize}';
     public static GENERATE_OR_NUMBER = '/payment/official-receipt/new-or-number';
     public static CREATE_OR_PAYMENT = '/payment/official-receipt';
     public static GET_OR_ALL_PAYMENTS_WITH_CUSTOMER_INFO = '/payment/official-receipt/with-cust-info/{pageNo}/{pageSize}';
     public static GET_OR_ALL_PAYMENTS_WITH_CUSTOMER_INFO_BY_ID = '/payment/official-receipt/with-cust-info/{id}';
     public static GET_OR_ALL_WITH_SEARCH = '/payment/official-receipt/search/{pageNo}/{pageSize}';
     public static VOID_OR_RECORD = '/payment/official-receipt/void/{id}';

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

     public static PRINT_OR_PDF = '/payment/official-receipt/receipt/pdf/{id}';
     public static PRINT_OR_EXCEL = '/payment/official-receipt/receipt/excel/{id}';

     public static GET_SHARE_SUMMARY_BY_CUSTOMER_ID = '/payment/share-summary/{customerId}';
     public static UPDATE_SHARE_SUMMARY = '/payment/share-summary/update';

}

export class AuthApi {
     public static LOGIN = '/auth/login';
}

export class UserApi {
     public static GET_USERNAME = '/user/username/{id}';
     public static GET_USERS = '/user/getAllUser';
     public static REGISTER = '/user/register';
     public static GET_USER_BY_ID = '/user/{userId}';
     public static UPDATE_USER = '/user';
}

export class RoleApi {
     public static GET_ROLES = '/role';
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

export class WaterRatesApi {
     public static GET_ACTIVE_WATER_RATES_RESIDENTIAL = '/billing/rates/residential/active';
     public static GET_ACTIVE_WATER_RATES_COMMERCIAL = '/billing/rates/commercial/active';
     public static UPDATE_RESIDENTIAL_RATES = '/billing/rates/residential';
     public static UPDATE_COMMERCIAL_RATES = '/billing/rates/commercial';
}

export class ReportsApi {
     public static GET_DASHBOARD_DATA = '/reports/collection/getDashboardData/{startDate}/{endDate}';
     public static GET_COLLECTION_REPORT_SUMMARY = '/reports/collection/generateCollectionReportSummary/{startDate}/{endDate}';
     public static GET_COLLECTION_REPORT_DETAILED = '/reports/collection/generateCollectionReportDetails/{startDate}/{endDate}';
     public static GET_OTHER_COLLECTION_REPORT_SUMMARY = '/reports/collection/generateOtherCollectionReportSummary/{startDate}/{endDate}';
     public static GET_OTHER_COLLECTION_REPORT_DETAILED = '/reports/collection/generateOtherCollectionReportDetails/{startDate}/{endDate}';
     public static GET_OUTSIDE_COLLECTION_REPORT_SUMMARY = '/reports/collection/generateOutsideCollectionReportSummary/{startDate}/{endDate}';
     public static GET_OUTSIDE_COLLECTION_REPORT_DETAILED = '/reports/collection/generateOutsideCollectionReportDetails/{startDate}/{endDate}';

     public static GET_BILLING_REPORT_SUMMARY = '/reports/billing/generateBillingReportSummary/{startDate}/{endDate}';
     public static GET_BILLING_REPORT_DETAILED = '/reports/billing/generateBillingReportDetailed/{startDate}/{endDate}';
     public static GET_UNPAID_BILLING_REPORT = '/reports/billing/generateUnpaidBillingReport/{startDate}/{endDate}';

     public static GET_CUSTOMER_METER_USAGE_SUMMARY = '/reports/collection/getCustomerMeterUsagePerYear/{year}';

}

export class DefaultValuesApi {
     public static GET_DEFAULT_VALUES = '/settings/default-values';
     public static UPDATE_DEFAULT_VALUES = '/settings/default-values';
}

export class ToastrTitle {
     public static INVALID_INPUT = 'Invalid Input';
     public static LOGIN_FAILED = 'Login Failed';
     public static SUCCESS = 'Success';
     public static ERROR = 'Error';
     public static WARNING = 'Warning';
}

export class ToastrMessage {
     public static SUCCESS_CREATE = 'Successfully created!';
     public static SUCCESS_UPDATE = 'Successfully updated!';
     public static SUCCESS_DELETE = 'Successfully deleted!';
     public static SUCCESS_VOID = 'Successfully voided!';

     public static INVALID_INPUT = 'Invalid input! Please try again.';

     public static ERROR_LOGIN = 'Invalid email or password.';
     public static ERROR_CREATE = 'Failed creating';
     public static ERROR_UPDATE = 'Failed updating';
     public static ERROR_DELETE = 'Failed deleting';
     public static ERROR_FETCHING_DATA = 'Failed fetching data';
     public static ERROR_VOID = 'Failed voiding';

}

export class IconPaths {
     public static PAYMENTS = '/assets/icons/payments.svg';
     public static GROUP = '/assets/icons/group.svg';
     public static NEWSPAPER = '/assets/icons/newspaper.svg';
     public static HANDYMAN = '/assets/icons/handyman.svg';
}

