// regex để filter dữ liệu
export class InvoiceFilter {
    public static INVOICE_ID = /Số hóa đơn:\s+(\w+)/s;
    public static SYMBOL = /Ký hiệu: ([^\/\n]+\/\d+)/s;
    public static CODE = /Mẫu số: ([^\/\n]+\/\d+)/s;
    public static SEARCH_CODE = /Mã tra cứu:\s+(\w+)/s;
    public static TAX_CODE = /Mã số thuế\s+(\d{10}-\d{3})/s;
    public static LINK_ATTACHED = /http:\/\/[^\s\]]+/g;
}