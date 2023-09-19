"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const InvoiceFilter_1 = require("./InvoiceFilter");
const file = fs_1.default.readFileSync('src/email.txt').toString();
console.log(file);
// trích xuất 1 giá trị từ chuỗi
/**
 *
 * @param data : string (chuỗi)
 * @param pattern : RegexExpression(expression để trích xuất dữ liệu từ chuỗi)
 * @returns : trả về 1 dữ liệu cần trích xuất hoặc undefined nếu không tìm thấy
 */
function extractValueOf(data, pattern) {
    // tìm dữ liệu match với pattern
    const match = data.match(pattern);
    // nếu không match trả về undefined
    if (!match) {
        return undefined;
    }
    // trả về dữ liệu cần trích xuất nếu match
    // lưu ý: 
    // match[0] trả về toàn bộ dữ liệu kể cả giá trị filter (vd: Invoice Id: 123)
    // match[1] trả về đúng dữ liệu cần trích xuất (vd: 123)
    return match[1];
}
// trích xuất nhiều giá trị từ chuỗi
/**
 *
 * @param data : string (chuỗi)
 * @param pattern : RegexExpression(expression để trích xuất dữ liệu từ chuỗi)
 * @returns : trả về 1 hoặc nhiều dữ liệu cần trích xuất hoặc undefined nếu không tìm thấy
 */
function extractMultipleValuesOf(data, pattern) {
    // tìm tất cả dữ liệu match với pattern
    const matches = [...data.matchAll(pattern)];
    // nếu không tìm thấy return undefined
    if (matches.length === 0) {
        return undefined;
    }
    // trả về toàn bộ giá trị match được
    const results = matches.map(match => (match[0]));
    return results;
}
// hàm extract 1 đoạn văn và trả về các dữ liệu cần trích xuất
function extract(data) {
    const invoiceId = extractValueOf(data, InvoiceFilter_1.InvoiceFilter.INVOICE_ID);
    const symbol = extractValueOf(data, InvoiceFilter_1.InvoiceFilter.SYMBOL);
    const code = extractValueOf(data, InvoiceFilter_1.InvoiceFilter.CODE);
    const searchCode = extractValueOf(data, InvoiceFilter_1.InvoiceFilter.SEARCH_CODE);
    const link = extractMultipleValuesOf(data, InvoiceFilter_1.InvoiceFilter.LINK_ATTACHED);
    const taxCode = extractValueOf(data, InvoiceFilter_1.InvoiceFilter.TAX_CODE);
    return { invoiceId, symbol, code, searchCode, link, taxCode };
}
const result = extract(file);
console.log(result);
