"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoiceFilter = void 0;
// regex để filter dữ liệu
class InvoiceFilter {
}
exports.InvoiceFilter = InvoiceFilter;
InvoiceFilter.INVOICE_ID = /Số hóa đơn:\s+(\w+)/s;
InvoiceFilter.SYMBOL = /Ký hiệu: ([^\/\n]+\/\d+)/s;
InvoiceFilter.CODE = /Mẫu số: ([^\/\n]+\/\d+)/s;
InvoiceFilter.SEARCH_CODE = /Mã tra cứu:\s+(\w+)/s;
InvoiceFilter.TAX_CODE = /Mã số thuế\s+(\d{10}-\d{3})/s;
InvoiceFilter.LINK_ATTACHED = /http:\/\/[^\s\]]+/g;
