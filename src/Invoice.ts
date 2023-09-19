export interface Invoice {
    invoiceId?: string, //số hóa đơn
    symbol?: string, //ký hiệu
    code?: string, //mẫu số
    searchCode?: string, //mã tra cứu
    link?: string[], //các links
    taxCode?: string, //mã số thuế
}