export class Constants {
     public static HOST = 'http://localhost:8080/';
}

export class CustomerApi {
     public static GET_CUSTOMER_LIST = 'api/customer/get/{pageNo}/{pageSize}';
     public static GET_CUSTOMER_BY_ID = 'api/customer/{id}';

     public static GET_METER_BY_CUSTOMER_ID = 'api/customer/meter';
     public static GET_METER_BY_METER_NO = 'api/customer/meter/{meterNo}';

     public static UPDATE_METER_NO = 'api/customer/meter/single-update';

}

export class BillingApi {
     public static GET_ACTIVE_WATER_RATES_RESIDENTIAL = 'api/billing/rates/residential/active';
     public static GET_ACTIVE_WATER_RATES_COMMERCIAL = 'api/billing/rates/commercial/active';
     public static CREATE_BILLING = 'api/billing';
}